import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, off, set, query, orderByChild } from 'firebase/database';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { database, auth } from './firebase.js';
import AdminChatList from './AdminChatList';
import { Send, X, MessageCircle } from 'lucide-react';
import '../../style/admin-chat.css';

const AdminChatPanel = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize Firebase Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        console.log('Admin Firebase user authenticated:', authUser.uid);
        setFirebaseUser(authUser);
        const userRef = ref(database, `users/${authUser.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserData({
              uid: authUser.uid,
              username: data.username || 'Admin',
              role: data.role || 'user'
            });
          }
        }, (err) => {
          console.error('Error fetching user data:', err);
          setError('Lỗi tải thông tin admin: ' + err.message);
        });
      } else {
        try {
          console.log('Admin signing in anonymously...');
          const result = await signInAnonymously(auth);
          console.log('Admin anonymous sign in successful:', result.user.uid);
          setFirebaseUser(result.user);
        } catch (authError) {
          console.error('Admin anonymous sign in failed:', authError);
          setError('Không thể kết nối đến hệ thống chat: ' + authError.message);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen to messages when chat is selected
  useEffect(() => {
    if (!selectedChatId || !firebaseUser) {
      setMessages([]);
      return;
    }
    console.log('Admin listening to messages for:', selectedChatId);
    setLoading(true);
    const messagesRef = ref(database, `private_chats/${selectedChatId}/messages`);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'));

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setMessages(loadedMessages);
        const chatInfoRef = ref(database, `private_chats/${selectedChatId}/info/unreadByAdmin`);
        set(chatInfoRef, false);
      } else {
        setMessages([]);
      }
      setLoading(false);
    }, (err) => {
      console.error('Admin message listener error:', err);
      setError('Lỗi tải tin nhắn: ' + err.message);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up admin message listener');
      off(messagesRef);
    };
  }, [selectedChatId, firebaseUser]);

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    setError(null);
  };

  const sendMessage = async () => {
    if (!selectedChatId || !newMessage.trim() || !firebaseUser || !userData) return;
    try {
      const messagesRef = ref(database, `private_chats/${selectedChatId}/messages`);
      const messageData = {
        text: newMessage.trim(),
        senderId: firebaseUser.uid,
        senderName: userData.username || 'Admin',
        timestamp: Date.now(),
        isAdmin: true,
        chatId: selectedChatId
      };
      await push(messagesRef, messageData);
      const chatInfoRef = ref(database, `private_chats/${selectedChatId}/info`);
      await set(chatInfoRef, {
        lastMessage: newMessage.trim(),
        lastMessageTime: Date.now(),
        customerName: messages.length > 0 
          ? messages.find(m => !m.isAdmin)?.senderName || 'Khách hàng'
          : 'Khách hàng',
        customerId: messages.length > 0 
          ? messages.find(m => !m.isAdmin)?.senderId || 'unknown'
          : 'unknown',
        isActive: true,
        unreadByAdmin: false,
        unreadByCustomer: true
      });
      setNewMessage('');
    } catch (err) {
      setError('Gửi tin nhắn thất bại: ' + err.message);
      console.error('Admin send message error:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!firebaseUser) {
    return (
      <div className="admin-chat-panel">
        <div className="chat-loading">
          <MessageCircle size={48} />
          <p>Đang kết nối đến hệ thống chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-chat-panel">
      <div className="chat-sidebar">
        <AdminChatList 
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChatId}
          firebaseUser={firebaseUser}
        />
      </div>
      <div className="chat-main">
        {selectedChatId ? (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                <MessageCircle size={20} />
                <span>Chat: {selectedChatId}</span>
                <small style={{ marginLeft: '10px', color: '#666' }}>
                  Firebase ID: {firebaseUser.uid}
                </small>
              </div>
              <button 
                className="close-chat-btn"
                onClick={() => setSelectedChatId(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="messages-container">
              {loading && <div className="loading">Đang tải tin nhắn...</div>}
              {error && <div className="error">{error}</div>}
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.isAdmin ? 'admin' : 'user'} ${
                    message.senderId === firebaseUser.uid ? 'own-message' : 'other-message'
                  }`}
                >
                  <div className="message-sender">
                    {message.isAdmin ? 'Bạn (Admin)' : message.senderName}
                  </div>
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn hỗ trợ..."
                disabled={loading}
              />
              <button 
                onClick={sendMessage} 
                disabled={loading || !newMessage.trim()}
                className="send-btn"
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <MessageCircle size={64} className="no-chat-icon" />
            <h3>Chọn một cuộc trò chuyện</h3>
            <p>Chọn một cuộc trò chuyện từ danh sách để bắt đầu hỗ trợ khách hàng</p>
            <small>Firebase User: {firebaseUser.uid}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPanel;
