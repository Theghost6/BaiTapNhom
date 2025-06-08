import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, set, get } from 'firebase/database';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';

// Admin UID list
const ALLOWED_ADMIN_UIDS = ['VsLTdtVP3ecoJv5TkXiOYZzhmDx2'];

export default function useChat() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();
  const database = getDatabase();

  // Check if user is admin
  const checkAdminStatus = async (authUser) => {
    if (!ALLOWED_ADMIN_UIDS.includes(authUser.uid)) {
      return false;
    }
    
    try {
      const userRef = ref(database, `users/${authUser.uid}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();
      
      return userSnapshot.exists() && 
             userData.role === 'admin' && 
             userData.adminVerified === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      setError(null);
      
      try {
        if (authUser) {
          setFirebaseUser(authUser);
          
          // Check if user is admin
          const adminStatus = await checkAdminStatus(authUser);
          setIsAdmin(adminStatus);
          
          if (adminStatus) {
            console.log('Admin logged in, skipping customer chat creation');
            setMessages([]);
            setChatId(null);
            setCustomerInfo(null);
            setLoading(false);
            return;
          }

          // Regular customer logic
          const userRef = ref(database, `users/${authUser.uid}`);
          const userSnapshot = await get(userRef);
          const userData = userSnapshot.val();
          
          const customerName = userData?.username || authUser.displayName || 'Khách hàng';
          const customerEmail = userData?.email || authUser.email || '';
          
          setCustomerInfo({
            name: customerName,
            email: customerEmail,
            uid: authUser.uid
          });

          // Generate chatId for customer
          const generatedChatId = `customer_${authUser.uid}`;
          setChatId(generatedChatId);
          console.log('Customer Chat ID:', generatedChatId);

          const chatRef = ref(database, `private_chats/${generatedChatId}`);
          const messagesRef = ref(database, `private_chats/${generatedChatId}/messages`);

          // Listen for messages
          const messagesUnsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const messagesList = Object.keys(data)
                .map(key => ({ id: key, ...data[key] }))
                .sort((a, b) => a.timestamp - b.timestamp);
              setMessages(messagesList);
            } else {
              setMessages([]);
            }
            console.log('Messages loaded for customer:', data ? Object.values(data) : []);
            setLoading(false);
          }, (err) => {
            console.error('Messages error:', err);
            setError('Lỗi tải tin nhắn: ' + err.message);
            setLoading(false);
          });

          // Check and create chat node if it doesn't exist
          const chatSnapshot = await get(chatRef);
          if (!chatSnapshot.exists()) {
            try {
              console.log('Creating new chat node for customer:', generatedChatId);
              await set(chatRef, {
                info: {
                  chatId: generatedChatId,
                  customerId: authUser.uid,
                  customerName: customerName,
                  customerEmail: customerEmail,
                  isActive: true,
                  createdAt: Date.now(),
                  lastMessageTime: Date.now(),
                  unreadByAdmin: false,
                  unreadByCustomer: false
                },
                messages: {}
              });
              console.log('Created new chat node for customer:', generatedChatId);
            } catch (createError) {
              console.error('Create chat node error:', createError);
              setError('Lỗi tạo chat: ' + createError.message);
              setLoading(false);
            }
          } else {
            // Update customer info if changed
            const existingInfo = chatSnapshot.val().info || {};
            if (existingInfo.customerName !== customerName || existingInfo.customerEmail !== customerEmail) {
              await set(ref(database, `private_chats/${generatedChatId}/info/customerName`), customerName);
              await set(ref(database, `private_chats/${generatedChatId}/info/customerEmail`), customerEmail);
            }
          }

          return messagesUnsubscribe;
        } else {
          console.log('No user, signing in anonymously');
          const result = await signInAnonymously(auth);
          console.log('Anonymous user created:', result.user.uid);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setError('Lỗi xác thực: ' + error.message);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sendMessage = async (newMessage) => {
    if (!newMessage.trim() || !firebaseUser || !chatId) {
      console.error('Cannot send message: Missing input/user/chatId', { newMessage, firebaseUser, chatId });
      setError('Vui lòng nhập tin nhắn và đảm bảo đã đăng nhập');
      return;
    }

    if (isAdmin) {
      console.error('Admins cannot send messages through customer chat');
      setError('Quản trị viên không thể gửi tin nhắn qua giao diện khách hàng');
      return;
    }

    try {
      const messageData = {
        text: newMessage.trim(),
        senderId: firebaseUser.uid,
        senderName: customerInfo?.name || 'Khách hàng',
        timestamp: Date.now(),
        isAdmin: false,
        chatId: chatId,
        messageType: 'customer'
      };

      console.log('Attempting to send message:', messageData);
      const messagesRef = ref(database, `private_chats/${chatId}/messages`);
      await push(messagesRef, messageData);
      
      console.log('Updating chat info for:', chatId);
      await Promise.all([
        set(ref(database, `private_chats/${chatId}/info/lastMessageTime`), messageData.timestamp),
        set(ref(database, `private_chats/${chatId}/info/lastMessage`), messageData.text),
        set(ref(database, `private_chats/${chatId}/info/unreadByAdmin`), true),
        set(ref(database, `private_chats/${chatId}/info/unreadByCustomer`), false)
      ]);
      
      console.log('Customer message sent successfully:', messageData);
      setError(null);
    } catch (error) {
      console.error('Send message error:', error, {
        chatId,
        uid: firebaseUser.uid,
        path: `private_chats/${chatId}/info`
      });
      setError(`Lỗi gửi tin nhắn: ${error.message} (Code: ${error.code})`);
      if (error.code === 'PERMISSION_DENIED') {
        console.error('Permission denied. Check Firebase rules and data at:', `private_chats/${chatId}`);
        setError('Không có quyền gửi tin nhắn. Vui lòng kiểm tra quyền truy cập.');
      }
    }
  };

  return { 
    messages, 
    sendMessage, 
    loading, 
    error, 
    customerInfo,
    chatId,
    isCustomerChat: !!chatId && !isAdmin,
    isAdmin 
  };
}
