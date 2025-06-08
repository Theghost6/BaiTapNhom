import React, { useEffect, useRef } from 'react';
import { useChat } from './useChat';
import { useChatContext } from './ChatProvider';
import '../../style/chat.css';

const ChatPopup = ({ onClose }) => {
  const { user } = useChatContext();
  const {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    loading,
    error,
    chatId
  } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <h3>
          {user?.role === 'admin' ? `Chat với khách hàng` : 'Hỗ trợ trực tuyến'}
        </h3>
        <div className="chat-info">
          <small>Phòng chat riêng tư</small>
        </div>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="messages-container">
        {loading && <div className="loading">Đang tải tin nhắn...</div>}
        {error && <div className="error">{error}</div>}
        
        {messages.length === 0 && !loading && (
          <div className="welcome-message">
            <div className="welcome-text">
              {user?.role === 'admin' 
                ? 'Chào mừng bạn đến với phòng chat hỗ trợ khách hàng!' 
                : 'Chào mừng bạn! Hãy nhập tin nhắn để bắt đầu cuộc trò chuyện với đội ngũ hỗ trợ.'
              }
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.isAdmin ? 'admin' : 'user'} ${
              message.senderId === user?.uid ? 'own-message' : 'other-message'
            }`}
          >
            <div className="message-sender">
              {message.isAdmin ? 'Nhân viên hỗ trợ' : message.senderName}
            </div>
            <div className="message-text">{message.text}</div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
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
          placeholder={
            user?.role === 'admin' ? 'Nhập tin nhắn hỗ trợ...' : 'Nhập tin nhắn...'
          }
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
          Gửi
        </button>
      </div>
      
      <div className="chat-footer">
        <small>
          Chat ID: {chatId} | Chỉ bạn và nhân viên hỗ trợ có thể xem cuộc trò chuyện này
        </small>
      </div>
    </div>
  );
};

export default ChatPopup;
