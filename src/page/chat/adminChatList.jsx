import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, off, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ALLOWED_ADMIN_UIDS = ['VsLTdtVP3ecoJv5TkXiOYZzhmDx2'];

function AdminChatList({ onSelectChat }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminVerified, setAdminVerified] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const auth = getAuth();
  const database = getDatabase();

  const verifyAdminAccess = async (authUser) => {
    if (!ALLOWED_ADMIN_UIDS.includes(authUser.uid)) {
      console.log('Access denied: UID not in allowed list');
      setAccessDenied(true);
      return false;
    }
    
    const userRef = ref(database, `users/${authUser.uid}`);
    const userSnapshot = await get(userRef);
    
    if (!userSnapshot.exists()) {
      console.log('Creating admin user data for UID:', authUser.uid);
      await set(userRef, {
        role: 'admin',
        username: 'Admin',
        adminVerified: true
      });
      setIsAdmin(true);
      setAdminVerified(true);
      return true;
    }
    
    const userData = userSnapshot.val();
    if (userData.role !== 'admin' || userData.adminVerified !== true) {
      console.log('Access denied: User role is not admin or not verified');
      setAccessDenied(true);
      return false;
    }
    
    setIsAdmin(true);
    setAdminVerified(true);
    return true;
  };

  const formatTimestamp = (timestamp) => {
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

  const handleChatSelect = (chatRoom) => {
    setSelectedChatId(chatRoom.chatId);
    if (onSelectChat) {
      onSelectChat(chatRoom);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setFirebaseUser(authUser);
        const isAdminAccess = await verifyAdminAccess(authUser);
        
        if (!isAdminAccess) {
          setChatRooms([]);
          setLoading(false);
          return;
        }

        const chatRoomsRef = ref(database, 'private_chats');
        console.log('Admin listening to private_chats, UID:', authUser.uid);
        
        onValue(chatRoomsRef, (snapshot) => {
          const data = snapshot.val();
          console.log('Raw Firebase data for admin:', data);
          
          if (data) {
            const rooms = Object.keys(data)
              .filter(chatId => chatId.startsWith('customer_'))
              .map(chatId => {
                const chatData = data[chatId];
                const info = chatData.info || {};
                const messages = chatData.messages || {};
                const messageCount = Object.keys(messages).length;
                
                const lastMessage = messageCount > 0 ? 
                  Object.values(messages).sort((a, b) => b.timestamp - a.timestamp)[0] : null;
                
                return {
                  chatId,
                  customerName: info.customerName || 'Khách hàng',
                  customerEmail: info.customerEmail || '',
                  customerId: info.customerId || '',
                  isActive: info.isActive || false,
                  lastMessageTime: info.lastMessageTime || info.createdAt || Date.now(),
                  lastMessage: lastMessage?.text || info.lastMessage || 'Chưa có tin nhắn',
                  lastMessageSender: lastMessage?.senderName || '',
                  messageCount: messageCount,
                  unreadByAdmin: info.unreadByAdmin || false,
                  unreadByCustomer: info.unreadByCustomer || false,
                  createdAt: info.createdAt || Date.now(),
                  ...info
                };
              })
              .sort((a, b) => b.lastMessageTime - a.lastMessageTime);
            
            console.log('Filtered customer chat rooms:', rooms);
            setChatRooms(rooms);
          } else {
            console.log('No chat rooms found');
            setChatRooms([]);
          }
          setLoading(false);
        }, (err) => {
          console.error('Firebase error:', err);
          setError('Lỗi tải danh sách chat: ' + err.message);
          setLoading(false);
        });
      } else {
        setError('Vui lòng đăng nhập admin');
        setLoading(false);
      }
    });

    return () => {
      off(ref(database, 'private_chats'));
      unsubscribe();
    };
  }, []);

  if (accessDenied) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3 style={{ color: 'red' }}>Truy cập bị từ chối</h3>
        <p>Bạn không có quyền truy cập vào trang quản trị chat.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ 
        borderBottom: '2px solid #007bff', 
        paddingBottom: '10px',
        color: '#333'
      }}>
        Danh sách Chat Khách hàng
      </h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffebee', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Đang tải danh sách chat...</p>
        </div>
      ) : (
        <div>
          {chatRooms.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <p style={{ color: '#666' }}>Chưa có cuộc trò chuyện nào từ khách hàng</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatRooms.map(room => (
                <div
                  key={room.chatId}
                  onClick={() => handleChatSelect(room)}
                  style={{
                    padding: '15px',
                    border: selectedChatId === room.chatId ? '2px solid #007bff' : '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedChatId === room.chatId ? '#f0f8ff' : '#fff',
                    transition: 'all 0.2s ease',
                    boxShadow: room.unreadByAdmin ? '0 2px 8px rgba(0,123,255,0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedChatId !== room.chatId) {
                      e.target.style.backgroundColor = '#f8f9fa';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedChatId !== room.chatId) {
                      e.target.style.backgroundColor = '#fff';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <h4 style={{ 
                          margin: 0, 
                          color: '#333',
                          fontWeight: room.unreadByAdmin ? 'bold' : 'normal'
                        }}>
                          {room.customerName}
                          {room.unreadByAdmin && (
                            <span style={{
                              marginLeft: '8px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              borderRadius: '50%',
                              width: '8px',
                              height: '8px',
                              display: 'inline-block'
                            }}></span>
                          )}
                        </h4>
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#666',
                          backgroundColor: '#e9ecef',
                          padding: '2px 6px',
                          borderRadius: '10px'
                        }}>
                          {room.messageCount} tin nhắn
                        </span>
                      </div>
                      
                      {room.customerEmail && (
                        <p style={{ 
                          margin: '0 0 8px 0', 
                          fontSize: '13px', 
                          color: '#666' 
                        }}>
                          📧 {room.customerEmail}
                        </p>
                      )}
                      
                      <p style={{ 
                        margin: '0 0 5px 0', 
                        fontSize: '14px', 
                        color: '#555',
                        fontStyle: room.lastMessage === 'Chưa có tin nhắn' ? 'italic' : 'normal'
                      }}>
                        {room.lastMessageSender && `${room.lastMessageSender}: `}
                        {room.lastMessage.length > 50 ? 
                          room.lastMessage.substring(0, 50) + '...' : 
                          room.lastMessage
                        }
                      </p>
                      
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        ID: {room.chatId.replace('customer_', '')}
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {formatTimestamp(room.lastMessageTime)}
                      </div>
                      {room.isActive && (
                        <div style={{ 
                          fontSize: '10px', 
                          color: '#28a745',
                          marginTop: '4px',
                          fontWeight: 'bold'
                        }}>
                          ● Online
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminChatList;
