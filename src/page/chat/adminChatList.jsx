import React, { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { database, auth } from './firebase.js';
import { MessageCircle, Clock, User } from 'lucide-react';
import '../../style/admin-chat.css';

const AdminChatList = ({ onSelectChat, selectedChatId }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);

  // Initialize Firebase Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        console.log('AdminChatList Firebase user authenticated:', authUser.uid);
        setFirebaseUser(authUser);
      } else {
        try {
          console.log('AdminChatList signing in anonymously...');
          const result = await signInAnonymously(auth);
          console.log('AdminChatList anonymous sign in successful:', result.user.uid);
          setFirebaseUser(result.user);
        } catch (authError) {
          console.error('AdminChatList anonymous sign in failed:', authError);
          setError('Không thể kết nối đến hệ thống chat: ' + authError.message);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!firebaseUser) {
      console.log('AdminChatList waiting for Firebase authentication');
      return;
    }
    const chatRoomsRef = ref(database, 'private_chats');
    console.log('AdminChatList: Starting to listen to private_chats with user:', firebaseUser.uid);

    const unsubscribe = onValue(chatRoomsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('AdminChatList: Raw Firebase data:', data);
      setDebugInfo({
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : [],
        totalChats: data ? Object.keys(data).length : 0,
        firebaseUserId: firebaseUser.uid
      });

      if (data) {
        const rooms = Object.keys(data)
          .map(chatId => {
            const chatData = data[chatId];
            console.log(`Processing chat ${chatId}:`, chatData);
            return {
              chatId,
              info: chatData.info || {},
              hasMessages: chatData.messages ? Object.keys(chatData.messages).length > 0 : false,
              messageCount: chatData.messages ? Object.keys(chatData.messages).length : 0,
              ...chatData.info
            };
          })
          .filter(room => room.hasMessages || room.isActive)
          .sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
        console.log('AdminChatList: Filtered rooms:', rooms);
        setChatRooms(rooms);
      } else {
        setChatRooms([]);
      }
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error('AdminChatList Firebase error:', err);
      setError('Lỗi tải danh sách chat: ' + err.message);
      setLoading(false);
    });

    return () => {
      console.log('AdminChatList: Cleaning up listener');
      off(chatRoomsRef);
    };
  }, [firebaseUser]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    }
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return '';
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  const filteredChatRooms = chatRooms.filter(room =>
    room.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.chatId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || !firebaseUser) {
    return (
      <div className="admin-chat-list loading">
        <div className="loading-spinner">
          {!firebaseUser ? 'Đang xác thực...' : 'Đang tải danh sách chat...'}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-chat-list">
      <div className="chat-list-header">
        <h3>
          <MessageCircle size={20} />
          Danh sách chat ({filteredChatRooms.length})
        </h3>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc tin nhắn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="chat-search-input"
        />
      </div>
      {debugInfo && (
        <div className="debug-info" style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px', borderRadius: '4px' }}>
          <strong>Debug Info:</strong><br/>
          Firebase User: {debugInfo.firebaseUserId}<br/>
          Has Data: {debugInfo.hasData ? 'Yes' : 'No'}<br/>
          Total Chats: {debugInfo.totalChats}<br/>
          Chat IDs: {debugInfo.dataKeys.join(', ')}<br/>
          Filtered: {filteredChatRooms.length}
        </div>
      )}
      {error && (
        <div className="admin-chat-error" style={{ color: 'red', padding: '10px', background: '#ffebee', borderRadius: '4px', margin: '10px 0' }}>
          {error}
        </div>
      )}
      <div className="chat-rooms">
        {filteredChatRooms.length === 0 ? (
          <div className="no-chats">
            <MessageCircle size={48} className="no-chat-icon" />
            <p>{searchQuery ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có cuộc trò chuyện nào'}</p>
            <small>Hãy yêu cầu khách hàng gửi tin nhắn để tạo cuộc trò chuyện</small>
            <br/>
            <small style={{ marginTop: '10px', display: 'block' }}>
              Đã xác thực với Firebase: {firebaseUser?.uid}
            </small>
          </div>
        ) : (
          filteredChatRooms.map((room) => (
            <div
              key={room.chatId}
              className={`chat-room-item ${selectedChatId === room.chatId ? 'active' : ''} ${room.unreadByAdmin ? 'unread' : ''}`}
              onClick={() => onSelectChat(room.chatId)}
            >
              <div className="room-avatar">
                <User size={24} />
              </div>
              <div className="room-info">
                <div className="room-header">
                  <h4 className="customer-name">
                    {room.customerName || room.chatId || 'Khách hàng'}
                  </h4>
                  <span className="last-message-time">
                    {formatTime(room.lastMessageTime)}
                  </span>
                </div>
                <div className="room-footer">
                  <p className="last-message">
                    {truncateMessage(room.lastMessage) || 'Tin nhắn mới'}
                  </p>
                  <small className="message-count">
                    ({room.messageCount} tin nhắn)
                  </small>
                  {room.unreadByAdmin && (
                    <div className="unread-indicator">
                      <span className="unread-dot"></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminChatList;
