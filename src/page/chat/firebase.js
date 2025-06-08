import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD888LDJJHRxdBkh05v-ItjI7Oz2u4Zy7g",
  authDomain: "webchat-5fbf5.firebaseapp.com",
  projectId: "webchat-5fbf5",
  storageBucket: "webchat-5fbf5.firebasestorage.app",
  messagingSenderId: "472890095735",
  appId: "1:472890095735:web:960abfc3412aaf7148ee72",
  measurementId: "G-2PZ432K5H4",
  databaseURL: "https://webchat-5fbf5-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Database
const database = getDatabase(app);

// Initialize Firebase Auth with persistence
const auth = getAuth(app);

// Set persistence to local (survives browser restarts)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Firebase auth persistence set to local');
  })
  .catch((error) => {
    console.error('Error setting Firebase auth persistence:', error);
  });

export { database, auth };
