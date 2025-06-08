import { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, onValue, push, set, off, query, orderByChild, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function AdminChatPanel({ selectedChat }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [adminInfo, setAdminInfo] = useState(null);
  const [sending, setSending] = useState(false);
  const [chatExists, setChatExists] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const auth = getAuth();
  const database = getDatabase();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? 'Vừa xong' : `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateEChanged(auth, async (authUser) => {
      if (authUser) {
        setFirebaseUser(authUser);
        
        try {
          const userRef = ref(database, `users/${authUser.uid}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            setAdminInfo({
              name: userData.username || 'Admin',
              uid: authUser.uid,
              role: userData.role
            });
            console.log('Admin info loaded:', userData);
          } else {
            console.error('Admin user data not found');
            setError('Không tìm thấy thông tin admin');
          }
        } catch (error) {
          console.error('Error loading admin info:', error);
          setError('Lỗi tải thông tin admin: ' + error.message);
        }
      } else {
        setError('Vui lòng đăng nhập admin');
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedChat || !firebaseUser) {
      setMessages([]);
      setChatExists(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    console.log('Loading messages for chat:', selectedChat.chatId);
    
    const chatRef = ref(database, `private_chats/${selectedChat.chatId}`);
    const messagesRef = ref(database, `private_chats/${selectedChat.chatId}/messages`);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'));

    get(chatRef).then((snapshot) => {
      setChatExists(snapshot.exists());
      if (!snapshot.exists()) {
        setError('Cuộc trò chuyện không tồn tại');
        setMessages([]);
        setLoading(false);
        return;
      }

      const unsubscribe = onValue(messagesQuery, async (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            const messagesList = Object.keys(data)
              .map(key => ({ id: key, ...data[key] }))
              .sort((a, b) => a.timestamp - b.timestamp);
            setMessages(messagesList);
            
            await set(ref(database, `private_chats/${selectedChat.chatId}/info/unreadByAdmin`), false);
            console.log('Messages loaded and marked as read by admin:', messagesList.length);
          } else {
            setMessages([]);
            console.log('No messages found for chat:', selectedChat.chatId);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error processing messages:', error);
          setError('Lỗi xử lý tin nhắn: ' + error.message);
          setLoading(false);
        }
      }, (err) => {
        console.error('Message load error:', err);
        setError('Lỗi tải tin nhắn: ' + err.message);
        setLoading(false);
      });

      return () => {
        off(messagesRef);
        console.log('Unsubscribed from messages for chat:', selectedChat.chatId);
      };
    }).catch((err) => {
      console.error('Chat existence check error:', err);
      setError('Lỗi kiểm tra cuộc trò chuyện: ' + err.message);
      setChatExists(false);
      setLoading(false);
    });
  }, [selectedChat, firebaseUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !firebaseUser || !selectedChat || sending || !chatExists) {
      if (!newMessage.trim()) {
        setError('Vui lòng nhập tin nhắn');
        setTimeout(() => setError(null), 3000);
      } else if (!chatExists) {
        setError('Không thể gửi tin nhắn: Cuộc trò chuyện chưa được bắt đầu');
        setTimeout(() => setError(null), 3000);
      }
      return;
    }

    setSending(true);
    setError(null);

    try {
      const messageData = {
        text: newMessage.trim(),
        senderId: firebaseUser.uid,
        senderName: adminInfo?.name || 'Admin',
        timestamp: Date.now(),
        isAdmin: true,
        messageType: 'admin',
        chatId: selectedChat.chatId,
        status: 'sent'
      };

      console.log('Sending admin message:', messageData);

      const messagesRef = ref(database, `private_chats/${selectedChat.chatId}/messages`);
      await push(messagesRef, messageData);
      
      await Promise.all([
        set(ref(database, `private_chats/${selectedChat.chatId}/info/lastMessageTime`), messageData.timestamp),
        set(ref(database, `private_chats/${selectedChat.chatId}/info/lastMessage`), messageData.text),
        set(ref(database, `private_chats/${selectedChat.chatId}/info/lastMessageSender`), messageData.senderName),
        set(ref(database, `private_chats/${selectedChat.chatId}/info/unreadByCustomer`), true),
        set(ref(database, `private_chats/${selectedChat.chatId}/info/unreadByAdmin`), false)
      ]);
      
      console.log('Admin message sent successfully');
      setNewMessage('');
      
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      
    } catch (error) {
      console.error('Admin send message error:', error);
      setError('Lỗi gửi tin nhắn: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const clearError = () => {
    setError(null);
  };

  if (!selectedChat) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '600px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        color: '#666',
        border: '1px solid #dee2e6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#495057' }}>Chọn cuộc trò chuyện</h3>
          <p style={{ margin: 0, color: '#6c757d' }}>Chọn một khách hàng từ danh sách để bắt đầu chat</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '600px',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid #eee',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px 8px 0 0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>
              💬 {selectedChat.customerName}
              {selectedChat.isActive && (
                <span style={{
                  marginLeft: '8px',
                  fontSize: '12px',
                  color: '#28a745',
                  fontWeight: 'normal'
                }}>
                  ● Online
                </span>
              )}
            </h3>
            {selectedChat.customerEmail && (
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
                📧 {selectedChat.customerEmail}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#888' }}>
            <div>ID: {selectedChat.chatId.replace('customer_', '')}</div>
            <div>{selectedChat.messageCount} tin nhắn</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ 
        flex: 1, 
        padding: '16px 20px', 
        overflowY: 'auto',
        backgroundColor: '#fafbfc',
        position: 'relative'
      }}>
        {error && (
          <div style={{ 
            color: '#dc3545', 
            backgroundColor: '#f8d7da', 
            padding: '12px', 
            borderRadius: '6px',
            marginBottom: '16px',
            border: '1px solid #f5c6cb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{error}</span>
            <button 
              onClick={clearError}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc3545',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0 5px'
              }}
            >
              ×
            </button>
          </div>
        )}
        
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6c757d'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
            <p>Đang tải tin nhắn...</p>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#6c757d'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>📝</div>
                <h4 style={{ margin: '0 0 8px 0', color: '#495057' }}>Chưa có tin nhắn</h4>
                <p style={{ margin: 0 }}>Khách hàng chưa gửi tin nhắn!</p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.isAdmin ? 'flex-end' : 'flex-start',
                      marginBottom: '16px',
                      opacity: msg.status === 'sending' ? 0.7 : 1
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '75%',
                        minWidth: '100px'
                      }}
                    >
                      <div style={{
                        fontSize: '11px',
                        color: '#6c757d',
                        marginBottom: '4px',
                        textAlign: msg.isAdmin ? 'right' : 'left',
                        paddingLeft: msg.isAdmin ? '0' : '14px',
                        paddingRight: msg.isAdmin ? '14px' : '0'
                      }}>
                        {msg.senderName} • {formatTimestamp(msg.timestamp)}
                      </div>
                      
                      <div
                        style={{
                          padding: '12px 16px',
                          borderRadius: msg.isAdmin ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                          backgroundColor: msg.isAdmin ? '#007bff' : '#e9ecef',
                          color: msg.isAdmin ? 'white' : '#333',
                          wordWrap: 'break-word',
                          lineHeight: '1.4',
                          fontSize: '14px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          position: 'relative'
                        }}
                      >
                        {msg.text}
                        
                        {msg.isAdmin && (
                          <div style={{
                            fontSize: '10px',
                            opacity: 0.8,
                            marginTop: '4px',
                            textAlign: 'right'
                          }}>
                            {msg.status === 'sending' ? '⏳' : '✓'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </>
        )}
      </div>

      <div style={{ 
        padding: '16px 20px', 
        borderTop: '1px solid #eee',
        backgroundColor: '#fff',
        borderRadius: '0 0 8px 8px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={chatExists ? "Nhập tin nhắn cho khách hàng..." : "Không thể gửi tin nhắn: Cuộc trò chuyện chưa được bắt đầu"}
              disabled={sending || !chatExists}
              style={{
                width: '100%',
                minHeight: '44px',
                maxHeight: '120px',
                padding: '12px 16px',
                border: '1px solid #ddd',
                borderRadius: '22px',
                fontSize: '14px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: '1.4',
                backgroundColor: (sending || !chatExists) ? '#f8f9fa' : '#fff'
              }}
              rows="1"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
            {sending && (
              <div style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '12px'
              }}>
                ⏳
              </div>
            )}
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending || !chatExists}
            style={{
              padding: '12px 20px',
              backgroundColor: (!newMessage.trim() || sending || !chatExists) ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '22px',
              cursor: (!newMessage.trim() || sending || !chatExists) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              minWidth: '80px',
              transition: 'background-color 0.2s ease'
            }}
            title={sending ? 'Đang gửi...' : 'Gửi tin nhắn (Enter)'}
          >
            {sending ? '⏳' : '📤 Gửi'}
          </button>
        </div>
        
        <div style={{
          fontSize: '11px',
          color: '#6c757d',
          marginTop: '8px',
          textAlign: 'center'
        }}>
          Nhấn Enter để gửi • Shift + Enter để xuống dòng
        </div>
      </div>
    </div>
  );
}

export default AdminChatPanel;
