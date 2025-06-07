import { useState, useEffect, useContext } from 'react';
import { ref, push, onValue, off, set } from 'firebase/database';
import { database } from './firebase.js'; // Adjust the import path as necessary
import { AuthContext } from '../funtion/AuthContext.jsx'; // You'll need to create this or use your existing auth context

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext); // Get current user from context

const sendMessage = () => {
    if (!newMessage.trim()) return;

    try {
      const messagesRef = ref(database, 'messages');
      const newMessageRef = push(messagesRef);
      
      // Tạo senderId mặc định nếu user chưa đăng nhập
      const senderId = user?.uid || `guest_${Date.now()}`;
      const senderName = user?.displayName || 'Khách';
      
      set(newMessageRef, {
        text: newMessage.trim(),
        senderId: senderId, // Đảm bảo không bao giờ undefined
        senderName: senderName,
        timestamp: Date.now()
      });
      
      setNewMessage('');
    } catch (err) {
      setError('Gửi tin nhắn thất bại');
      console.error(err);
    }
  };



  useEffect(() => {
    const messagesRef = ref(database, 'messages');
    
    const handleData = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setMessages(loadedMessages);
      }
      setLoading(false);
    };

    const handleError = (error) => {
      setError('Failed to load messages');
      console.error(error);
      setLoading(false);
    };

    onValue(messagesRef, handleData, handleError);

    return () => {
      off(messagesRef);
    };
  }, []);

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    loading,
    error,
    currentUser: user
  };
};
