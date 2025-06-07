import React from 'react';
import { useChat } from './useChat';
import '../../style/chat.css'; // Assuming you have a CSS file for styling

const ChatPopup = ({ onClose }) => {
  const {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    loading,
    error,
    currentUser
  } = useChat();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <h3>Chat Support</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="messages-container">
        {loading && <div className="loading">Loading messages...</div>}
        {error && <div className="error">{error}</div>}
        
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.senderId === currentUser?.uid ? 'sent' : 'received'}`}
          >
            <div className="message-sender">{message.senderName}</div>
            <div className="message-text">{message.text}</div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPopup;
