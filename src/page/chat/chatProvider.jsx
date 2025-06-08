import React, { createContext, useContext, useState, useEffect } from 'react';
import ChatPopup from './ChatPopup.jsx';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, get } from 'firebase/database';
import { database } from './firebase';

const ALLOWED_ADMIN_UIDS = ['VsLTdtVP3ecoJv5TkXiOYZzhmDx2'];

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (authUser) => {
    if (!ALLOWED_ADMIN_UIDS.includes(authUser.uid)) {
      return false;
    }
    
    try {
      const userRef = ref(database, `users/${authUser.uid}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();
      
      return userSnapshot.exists() && 
             userData.role === 'admin' && 
             userData.adminVerified === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      
      if (authUser) {
        try {
          const adminStatus = await checkAdminStatus(authUser);
          setIsAdmin(adminStatus);

          const userRef = ref(database, `users/${authUser.uid}`);
          onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            setUser({
              uid: authUser.uid,
              username: userData?.username || authUser.displayName || 'Khách hàng',
              email: userData?.email || authUser.email || null,
              role: userData?.role || (adminStatus ? 'admin' : 'user'),
              isAdmin: adminStatus
            });
          }, (error) => {
            console.error('Error fetching user data:', error);
            setUser({
              uid: authUser.uid,
              username: authUser.displayName || 'Khách hàng',
              email: authUser.email || null,
              role: adminStatus ? 'admin' : 'user',
              isAdmin: adminStatus
            });
          });
        } catch (error) {
          console.error('Error in auth state change:', error);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleSetShowChat = (value) => {
    if (isAdmin && value) {
      console.log('Admin users cannot access customer chat interface');
      return;
    }
    setShowChat(value);
  };

  return (
    <ChatContext.Provider value={{ showChat, setShowChat: handleSetShowChat, user, isAdmin, loading }}>
      {children}
      {showChat && !isAdmin && !loading && <ChatPopup onClose={() => handleSetShowChat(false)} />}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
