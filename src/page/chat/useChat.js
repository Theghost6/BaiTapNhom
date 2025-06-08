import { useState, useEffect, useCallback } from 'react';
import { ref, push, onValue, off, set, query, orderByChild, limitToLast } from 'firebase/database';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { database, auth } from './firebase.js';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [chatId, setChatId] = useState(null);
  const MAX_MESSAGES = 100;
  const GUEST_CHAT_ID_KEY = 'guest_chat_id';

  const getOrCreateUserId = useCallback(() => {
    return firebaseUser?.uid || null;
  }, [firebaseUser]);

  const generateChatId = useCallback(() => {
    const userId = getOrCreateUserId();
    if (!userId) return null;
    return `user_${userId}`;
  }, [getOrCreateUserId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      if (authUser) {
        setFirebaseUser(authUser);
        const userRef = ref(database, `users/${authUser.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserData({
              uid: authUser.uid,
              username: data.username || 'Khách hàng',
              email: data.email || authUser.email || null,
              role: data.role || 'user'
            });
          } else {
            const defaultUserData = {
              username: 'Khách hàng',
              email: authUser.email || null,
              role: 'user',
              createdAt: Date.now()
            };
            set(userRef, defaultUserData).then(() => {
              setUserData({ uid: authUser.uid, ...defaultUserData });
            });
          }
        }, (err) => {
          setError('Lỗi tải thông tin người dùng: ' + err.message);
        });

        setChatId(`user_${authUser.uid}`);
        localStorage.setItem(GUEST_CHAT_ID_KEY, authUser.uid);
      } else {
        try {
          const result = await signInAnonymously(auth);
          setFirebaseUser(result.user);
          const storedChatId = localStorage.getItem(GUEST_CHAT_ID_KEY);
          if (storedChatId) {
            setChatId(`user_${storedChatId}`);
          }
        } catch (authError) {
          setError('Không thể kết nối: ' + authError.message);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const validateMessage = (message) => {
    if (!message || typeof message !== 'string') return false;
    if (message.trim().length === 0 || message.length > 1000) return false;
    return true;
  };

  const sendMessage = useCallback(async () => {
    if (!chatId || !validateMessage(newMessage) || !firebaseUser || !userData) {
      setError('Tin nhắn không hợp lệ hoặc chưa xác thực.');
      return;
    }

    try {
      setError(null);
      const messagesRef = ref(database, `private_chats/${chatId}/messages`);
      const messageData = {
        text: newMessage.trim(),
        senderId: firebaseUser.uid,
        senderName: userData.username,
        timestamp: Date.now(),
        isAdmin: userData.role === 'admin'
      };

      await push(messagesRef, messageData);
      const chatInfoRef = ref(database, `private_chats/${chatId}/info`);
      await set(chatInfoRef, {
        chatId,
        lastMessage: newMessage.trim(),
        lastMessageTime: Date.now(),
        customerName: userData.username,
        customerId: firebaseUser.uid,
        customerType: userData.uid ? 'registered' : 'guest',
        isActive: true,
        unreadByAdmin: userData.role !== 'admin',
        unreadByCustomer: userData.role === 'admin',
        createdAt: Date.now()
      });

      setNewMessage('');
    } catch (err) {
      setError('Gửi tin nhắn thất bại: ' + err.message);
    }
  }, [newMessage, firebaseUser, userData, chatId]);

  useEffect(() => {
    if (!chatId || !firebaseUser) {
      setLoading(false);
      return;
    }

    const messagesRef = ref(database, `private_chats/${chatId}/messages`);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'), limitToLast(MAX_MESSAGES));
    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(loadedMessages);
        const readField = userData?.role === 'admin' ? 'unreadByAdmin' : 'unreadByCustomer';
        set(ref(database, `private_chats/${chatId}/info/${readField}`), false);
      } else {
        setMessages([]);
      }
      setLoading(false);
    }, (err) => {
      setError('Lỗi tải tin nhắn: ' + err.message);
      setLoading(false);
    });

    return () => off(messagesRef);
  }, [chatId, firebaseUser, userData]);

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    loading,
    error,
    currentUser: userData,
    chatId
  };
};
