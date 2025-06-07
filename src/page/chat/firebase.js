import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD888LDJJHRxdBkh05v-ItjI7Oz2u4Zy7g",
  authDomain: "webchat-5fbf5.firebaseapp.com",
  projectId: "webchat-5fbf5",
  storageBucket: "webchat-5fbf5.firebasestorage.app",
  messagingSenderId: "472890095735",
  appId: "1:472890095735:web:960abfc3412aaf7148ee72",
  measurementId: "G-2PZ432K5H4",
    databaseURL: "https://webchat-5fbf5-default-rtdb.asia-southeast1.firebasedatabase.app" // Thêm URL đúng region
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
