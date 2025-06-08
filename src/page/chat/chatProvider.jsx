import React, { createContext, useContext, useState, useEffect } from 'react';
import ChatPopup from './ChatPopup.jsx';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const userRef = ref(database, `users/${authUser.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          setUser({
            uid: authUser.uid,
            username: userData?.username || 'Khách hàng',
            email: userData?.email || authUser.email || null,
            role: userData?.role || 'user'
          });
        }, (error) => {
          console.error('Error fetching user data:', error);
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSetShowChat = (value) => {
    setShowChat(value);
  };

  return (
    <ChatContext.Provider value={{ showChat, setShowChat: handleSetShowChat, user }}>
      {children}
      {showChat && <ChatPopup onClose={() => handleSetShowChat(false)} />}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
