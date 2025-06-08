import { useState, useEffect, useRef } from 'react';
import useChat from './useChat.js';

function ChatPopup({ onClose }) {
  const { messages, sendMessage, loading, error, customerInfo, isCustomerChat } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [loading]);

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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) {
      return;
    }

    setSending(true);
    try {
      await sendMessage(newMessage.trim());
      setNewMessage('');
      
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
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

  const clearError = () => {
    // Có thể thêm hàm clear error từ useChat hook nếu cần
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '380px',
      height: '500px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
            💬 Hỗ trợ khách hàng
          </h3>
          {customerInfo && (
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
              Xin chào, {customerInfo.name}!
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            opacity: 0.8
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.8'}
          title="Đóng chat"
        >
          ×
        </button>
      </div>

      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        backgroundColor: '#f8f9fa',
        position: 'relative'
      }}>
        {error && (
          <div style={{
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            padding: '10px 12px',
            borderRadius: '6px',
            marginBottom: '12px',
            border: '1px solid #f5c6cb',
            fontSize: '13px',
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
                fontSize: '16px',
                padding: '0 4px'
              }}
            >
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>⏳</div>
            <p style={{ margin: 0, fontSize: '14px' }}>Đang kết nối...</p>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '30px 20px',
                color: '#666'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>👋</div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#333' }}>
                  Chào mừng bạn!
                </h4>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.4' }}>
                  Hãy gửi tin nhắn để được hỗ trợ.<br/>
                  Chúng tôi sẽ phản hồi sớm nhất có thể.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.isAdmin ? 'flex-start' : 'flex-end',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ maxWidth: '80%' }}>
                      <div style={{
                        fontSize: '10px',
                        color: '#888',
                        marginBottom: '2px',
                        textAlign: msg.isAdmin ? 'left' : 'right',
                        paddingLeft: msg.isAdmin ? '12px' : '0',
                        paddingRight: msg.isAdmin ? '0' : '12px'
                      }}>
                        {msg.senderName} • {formatTimestamp(msg.timestamp)}
                      </div>
                      
                      <div style={{
                        padding: '10px 14px',
                        borderRadius: msg.isAdmin ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                        backgroundColor: msg.isAdmin ? '#e9ecef' : '#007bff',
                        color: msg.isAdmin ? '#333' : 'white',
                        fontSize: '14px',
                        wordWrap: 'break-word',
                        lineHeight: '1.4',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        position: 'relative'
                      }}>
                        {msg.text}
                        
                        {!msg.isAdmin && (
                          <div style={{
                            fontSize: '9px',
                            opacity: 0.8,
                            marginTop: '4px',
                            textAlign: 'right'
                          }}>
                            ✓
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
        padding: '12px 16px',
        borderTop: '1px solid #eee',
        backgroundColor: '#fff',
        borderRadius: '0 0 12px 12px'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              disabled={sending || loading}
              style={{
                width: '100%',
                minHeight: '36px',
                maxHeight: '80px',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '18px',
                fontSize: '14px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: '1.3',
                backgroundColor: (sending || loading) ? '#f8f9fa' : '#fff'
              }}
              rows="1"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
              }}
            />
            {sending && (
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '11px'
              }}>
                ⏳
              </div>
            )}
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending || loading}
            style={{
              padding: '10px 16px',
              backgroundColor: (!newMessage.trim() || sending || loading) ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '18px',
              cursor: (!newMessage.trim() || sending || loading) ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              minWidth: '60px',
              transition: 'background-color 0.2s ease'
            }}
            title={sending ? 'Đang gửi...' : 'Gửi tin nhắn'}
          >
            {sending ? '⏳' : '📤'}
          </button>
        </div>
        
        <div style={{
          fontSize: '10px',
          color: '#888',
          marginTop: '6px',
          textAlign: 'center'
        }}>
          Nhấn Enter để gửi • Shift + Enter để xuống dòng
        </div>
      </div>
    </div>
  );
}

export default ChatPopup;
