import React, { createContext, useContext, useState } from 'react';
import ChatPopup from './ChatPopup.jsx';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [showChat, setShowChat] = useState(false);

  return (
    <ChatContext.Provider value={{ showChat, setShowChat }}>
      {children}
      {showChat && <ChatPopup onClose={() => setShowChat(false)} />}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
