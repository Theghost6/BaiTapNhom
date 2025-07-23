import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Minimize2,
  Maximize2,
  MessageCircle,
  User,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useChat } from '../chat/ChatContext';
import { useSocket } from '../chat/SocketContext';
import { toast } from 'react-toastify';
import '../../style/chat.css';

const ChatPopup = ({ user }) => {
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    showChat,
    messages,
    currentRoom,
    unreadCount,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
    closeChat,
    isConnected
  } = useChat();

  const { onlineUsers } = useSocket();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (showChat && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showChat, isMinimized]);

  useEffect(() => {
    if (!isConnected) {
      toast.warn('Không thể kết nối với server chat. Vui lòng thử lại sau.');
    }
  }, [isConnected]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    sendMessage(message, user);
    setMessage('');

    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
    stopTyping(user);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!user) return;

    startTyping(user);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      stopTyping(user);
      setTypingTimeout(null);
    }, 3000);

    setTypingTimeout(timeout);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOwnMessage = (messageUser) => {
    return user && messageUser.id === user.id;
  };

  if (!showChat) return null;

  return (
    <div className={`chat-popup ${isMinimized ? 'minimized' : ''}`}>
      <div className="chat-header">
        <div className="chat-title">
          <MessageCircle size={20} />
          <span>Tư vấn cộng đồng</span>
          {!isConnected && (
            <span className="connection-status offline">
              (Đang kết nối...)
            </span>
          )}
          {unreadCount > 0 && isMinimized && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>

        <div className="chat-controls">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="control-btn"
            title={isMinimized ? "Mở rộng" : "Thu nhỏ"}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={closeChat}
            className="control-btn close-btn"
            title="Đóng"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="online-users">
            <div className="online-indicator">
              <div className="green-dot"></div>
              <span>{onlineUsers.length} người đang online</span>
            </div>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="no-messages">
                <MessageCircle size={48} />
                <p>Chào mừng bạn đến với shop cua chúng tôi!</p>
                <p>Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện.</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${isOwnMessage(msg.user) ? 'own' : 'other'}`}
                >
                  {!isOwnMessage(msg.user) && (
                    <div className="message-avatar">
                      {msg.user.avatar ? (
                        <img src={msg.user.avatar} alt={msg.user.username} />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                  )}

                  <div className="message-content">
                    {!isOwnMessage(msg.user) && (
                      <div className="message-sender">
                        {msg.user.username}
                        {msg.user.role === 'admin' && (
                          <span className="admin-badge">Admin</span>
                        )}
                      </div>
                    )}

                    <div className="message-bubble" dangerouslySetInnerHTML={{ __html: msg.content }} />

                    <div className="message-time">
                      <Clock size={12} />
                      {formatTime(msg.timestamp)}
                      {isOwnMessage(msg.user) && (
                        <CheckCircle2 size={12} className="message-status" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {typingUsers.length > 0 && (
              <div className="typing-indicator">
                <div className="typing-animation">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>
                  {typingUsers.join(', ')} đang soạn tin...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-form">
            <div className="chat-input-container">
              <textarea
                ref={inputRef}
                value={message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={
                  user
                    ? "Nhập tin nhắn..."
                    : "Vui lòng đăng nhập để gửi tin nhắn"
                }
                className="chat-input"
                disabled={!user || !isConnected}
                rows={1}
              />
              <button
                type="submit"
                className="send-btn"
                disabled={!message.trim() || !user || !isConnected}
                title="Gửi tin nhắn"
              >
                <Send size={20} />
              </button>
            </div>

            {!user && (
              <div className="login-prompt">
                Bạn cần <a href="/login">đăng nhập</a> để sử dụng tính năng tư vấn
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default ChatPopup;