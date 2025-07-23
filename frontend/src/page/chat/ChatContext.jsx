import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { getWafEnabled } from './waf';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (message) => {
      if (message && message.content) {
        setMessages(prev => [...prev, message]);
        if (!showChat) {
          setUnreadCount(prev => prev + 1);
        }
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('user_typing', (data) => {
      setTypingUsers(prev => {
        if (!prev.includes(data.username)) {
          return [...prev, data.username];
        }
        return prev;
      });
    });

    socket.on('user_stop_typing', (data) => {
      setTypingUsers(prev => prev.filter(user => user !== data.username));
    });

    socket.on('chat_history', (history) => {
      setChatHistory(history);
      setMessages(history);
    });

    socket.on('room_joined', (roomData) => {
      setCurrentRoom(roomData.room);
    });

    return () => {
      socket.off('new_message');
      socket.off('error');
      socket.off('user_typing');
      socket.off('user_stop_typing');
      socket.off('chat_history');
      socket.off('room_joined');
    };
  }, [socket, showChat]);

  useEffect(() => {
    if (showChat) {
      setUnreadCount(0);
    }
  }, [showChat]);

  const sendMessage = async (content, user) => {
    if (!socket || !isConnected) return;
    const messageData = {
      content: content,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        role: user.role || 'user'
      },
      room: currentRoom || 'general',
      timestamp: new Date().toISOString(),
      wafEnabled: getWafEnabled()
    };
    socket.emit('send_message', messageData);
  };

  const joinRoom = (roomId, user) => {
    if (!socket || !isConnected) return;
    socket.emit('join_room', {
      room: roomId,
      user: user
    });
  };

  const leaveRoom = (roomId) => {
    if (!socket || !isConnected) return;
    socket.emit('leave_room', { room: roomId });
    setCurrentRoom(null);
    setMessages([]);
  };

  const startTyping = (user) => {
    if (!socket || !isConnected) return;
    socket.emit('typing', {
      room: currentRoom || 'general',
      username: user.username
    });
  };

  const stopTyping = (user) => {
    if (!socket || !isConnected) return;
    socket.emit('stop_typing', {
      room: currentRoom || 'general',
      username: user.username
    });
  };

  const openChat = (roomId = 'general', user) => {
    setShowChat(true);
    if (user) {
      joinRoom(roomId, user);
    }
  };

  const closeChat = () => {
    setShowChat(false);
    if (currentRoom) {
      leaveRoom(currentRoom);
    }
  };

  const clearSecurityWarnings = () => {
    setSecurityWarnings([]);
  };

  const value = {
    showChat,
    setShowChat,
    messages,
    currentRoom,
    unreadCount,
    isTyping,
    typingUsers,
    chatHistory,
    sendMessage,
    joinRoom,
    leaveRoom,
    startTyping,
    stopTyping,
    openChat,
    closeChat,
    isConnected
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};