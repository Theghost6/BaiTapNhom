// contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import config from './config';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Khởi tạo socket connection
    const newSocket = io(config.SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
      timeout: 20000,
    });

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      toast.success('Kết nối thành công với server!');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        // Server đã ngắt kết nối, cần reconnect thủ công
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Không thể kết nối với server!');
    });

    newSocket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      toast.info('Đã kết nối lại với server!');
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('Socket reconnection failed:', error);
    });

    setSocket(newSocket);

    // Cleanup function
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const connectSocket = (user) => {
    if (socket && !isConnected) {
      socket.auth = { user };
      socket.connect();
    }
  };

  const disconnectSocket = () => {
    if (socket && isConnected) {
      socket.disconnect();
    }
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    connectSocket,
    disconnectSocket,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
