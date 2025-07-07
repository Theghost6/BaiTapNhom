// server.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const server = http.createServer(app);

// Configuration from environment variables
const config = {
  PORT: process.env.PORT || 5000,
  CORS_ORIGINS: process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:3001'],
  STORAGE: {
    MAX_MESSAGES: parseInt(process.env.MAX_MESSAGES) || 1000,
    DATA_DIR: process.env.DATA_DIR || './data',
    MESSAGES_FILE: process.env.MESSAGES_FILE || 'messages.json',
    ROOMS_FILE: process.env.ROOMS_FILE || 'rooms.json',
    USERS_FILE: process.env.USERS_FILE || 'users.json',
  },
  CHAT: {
    TYPING_TIMEOUT: parseInt(process.env.TYPING_TIMEOUT) || 3000,
  }
};

const io = socketIo(server, {
  cors: {
    origin: config.CORS_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: config.CORS_ORIGINS,
  credentials: true
}));
app.use(express.json());

// File paths using config
const DATA_DIR = path.join(__dirname, config.STORAGE.DATA_DIR);
const MESSAGES_FILE = path.join(DATA_DIR, config.STORAGE.MESSAGES_FILE);
const ROOMS_FILE = path.join(DATA_DIR, config.STORAGE.ROOMS_FILE);
const USERS_FILE = path.join(DATA_DIR, config.STORAGE.USERS_FILE);

async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJsonFile(filePath, defaultData = []) {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeJsonFile(filePath, defaultData);
      return defaultData;
    }
    console.error(`Error reading ${filePath}:`, error);
    return defaultData;
  }
}

async function writeJsonFile(filePath, data) {
  try {
    await ensureDataDirectory();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

async function getMessages(roomId, limit = 50) {
  try {
    const messages = await readJsonFile(MESSAGES_FILE, []);
    return messages
      .filter(msg => msg.room === roomId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-limit);
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
}

async function saveMessage(messageData) {
  try {
    const messages = await readJsonFile(MESSAGES_FILE, []);
    const newMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...messageData,
      timestamp: new Date().toISOString()
    };
    messages.push(newMessage);
    
    // Use MAX_MESSAGES from config
    if (messages.length > config.STORAGE.MAX_MESSAGES) {
      messages.splice(0, messages.length - config.STORAGE.MAX_MESSAGES);
    }
    
    await writeJsonFile(MESSAGES_FILE, messages);
    return newMessage;
  } catch (error) {
    console.error('Error saving message:', error);
    return null;
  }
}

async function getRoomInfo(roomId) {
  try {
    const rooms = await readJsonFile(ROOMS_FILE, {});
    return rooms[roomId] || {
      id: roomId,
      name: roomId === 'general' ? 'Tư vấn chung' : roomId,
      users: [],
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting room info:', error);
    return null;
  }
}

async function updateRoomInfo(roomId, roomData) {
  try {
    const rooms = await readJsonFile(ROOMS_FILE, {});
    rooms[roomId] = {
      ...rooms[roomId],
      ...roomData,
      updatedAt: new Date().toISOString()
    };
    await writeJsonFile(ROOMS_FILE, rooms);
    return rooms[roomId];
  } catch (error) {
    console.error('Error updating room info:', error);
    return null;
  }
}

async function updateOnlineUsers(users) {
  try {
    await writeJsonFile(USERS_FILE, {
      onlineUsers: users,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating online users:', error);
  }
}

const onlineUsers = new Map();
const userRooms = new Map();
const typingUsers = new Map();

io.on('connection', async (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', async (data) => {
    try {
      const { room, user } = data;
      if (!room || !user) {
        socket.emit('error', { message: 'Room và user thông tin là bắt buộc' });
        return;
      }
      
      onlineUsers.set(socket.id, {
        ...user,
        socketId: socket.id,
        joinedAt: new Date().toISOString()
      });
      
      socket.join(room);
      userRooms.set(socket.id, room);

      let roomInfo = await getRoomInfo(room);
      if (!roomInfo.users) roomInfo.users = [];

      const existingUserIndex = roomInfo.users.findIndex(u => u.id === user.id);
      if (existingUserIndex === -1) {
        roomInfo.users.push({
          ...user,
          joinedAt: new Date().toISOString()
        });
      } else {
        roomInfo.users[existingUserIndex] = {
          ...roomInfo.users[existingUserIndex],
          ...user,
          lastSeen: new Date().toISOString()
        };
      }

      await updateRoomInfo(room, roomInfo);

      socket.emit('room_joined', { room: room, roomInfo: roomInfo });
      const messages = await getMessages(room);
      socket.emit('chat_history', messages);

      const onlineUsersList = Array.from(onlineUsers.values());
      await updateOnlineUsers(onlineUsersList);
      io.emit('online_users', onlineUsersList);

      socket.to(room).emit('user_joined', {
        user: user,
        message: `${user.username} đã tham gia cuộc trò chuyện`
      });

      console.log(`User ${user.username} joined room: ${room}`);
    } catch (error) {
      console.error('Error in join_room:', error);
      socket.emit('error', { message: 'Lỗi khi tham gia phòng chat' });
    }
  });

  socket.on('send_message', async (messageData) => {
    try {
      const { content, user, room } = messageData;
      if (!content || !user || !room) {
        socket.emit('error', { message: 'Dữ liệu tin nhắn không đầy đủ' });
        return;
      }
      
      const savedMessage = await saveMessage({
        content: content.trim(),
        user: user,
        room: room,
        type: 'text'
      });
      
      if (savedMessage) {
        io.to(room).emit('new_message', savedMessage);
        console.log(`Message from ${user.username} in room ${room}: ${content}`);
      } else {
        socket.emit('error', { message: 'Không thể lưu tin nhắn' });
      }
    } catch (error) {
      console.error('Error in send_message:', error);
      socket.emit('error', { message: 'Lỗi khi gửi tin nhắn' });
    }
  });

  socket.on('typing', (data) => {
    try {
      const { room, username } = data;
      if (!room || !username) return;
      
      const typingKey = `${room}_${username}`;
      if (typingUsers.has(typingKey)) {
        clearTimeout(typingUsers.get(typingKey));
      }
      
      socket.to(room).emit('user_typing', { username, room });
      
      // Use TYPING_TIMEOUT from config
      const timeout = setTimeout(() => {
        socket.to(room).emit('user_stop_typing', { username, room });
        typingUsers.delete(typingKey);
      }, config.CHAT.TYPING_TIMEOUT);
      
      typingUsers.set(typingKey, timeout);
    } catch (error) {
      console.error('Error in typing:', error);
    }
  });

  socket.on('stop_typing', (data) => {
    try {
      const { room, username } = data;
      if (!room || !username) return;
      
      const typingKey = `${room}_${username}`;
      if (typingUsers.has(typingKey)) {
        clearTimeout(typingUsers.get(typingKey));
        typingUsers.delete(typingKey);
      }
      
      socket.to(room).emit('user_stop_typing', { username, room });
    } catch (error) {
      console.error('Error in stop_typing:', error);
    }
  });

  socket.on('leave_room', async (data) => {
    try {
      const { room } = data;
      const user = onlineUsers.get(socket.id);
      
      if (room && user) {
        socket.leave(room);
        
        const roomInfo = await getRoomInfo(room);
        if (roomInfo && roomInfo.users) {
          roomInfo.users = roomInfo.users.filter(u => u.id !== user.id);
          await updateRoomInfo(room, roomInfo);
        }
        
        socket.to(room).emit('user_left', {
          user: user,
          message: `${user.username} đã rời khỏi cuộc trò chuyện`
        });
        
        console.log(`User ${user.username} left room: ${room}`);
      }
    } catch (error) {
      console.error('Error in leave_room:', error);
    }
  });

  socket.on('disconnect', async () => {
    try {
      const user = onlineUsers.get(socket.id);
      const room = userRooms.get(socket.id);
      
      if (user && room) {
        const roomInfo = await getRoomInfo(room);
        if (roomInfo && roomInfo.users) {
          const userIndex = roomInfo.users.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            roomInfo.users[userIndex].lastSeen = new Date().toISOString();
            roomInfo.users[userIndex].online = false;
          }
          await updateRoomInfo(room, roomInfo);
        }
        
        socket.to(room).emit('user_disconnected', {
          user: user,
          message: `${user.username} đã ngắt kết nối`
        });
        
        console.log(`User ${user.username} disconnected from room: ${room}`);
      }
      
      onlineUsers.delete(socket.id);
      userRooms.delete(socket.id);
      
      // Clear typing timeouts for disconnected user
      typingUsers.forEach((timeout, key) => {
        if (key.includes(user?.username)) {
          clearTimeout(timeout);
          typingUsers.delete(key);
        }
      });
      
      const onlineUsersList = Array.from(onlineUsers.values());
      await updateOnlineUsers(onlineUsersList);
      io.emit('online_users', onlineUsersList);
      
      console.log(`User disconnected: ${socket.id}`);
    } catch (error) {
      console.error('Error in disconnect:', error);
    }
  });
});

// REST API
app.get('/api/messages/:roomId', async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const messages = await getMessages(roomId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Lỗi khi lấy tin nhắn' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

server.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS Origins: ${config.CORS_ORIGINS.join(', ')}`);
});
