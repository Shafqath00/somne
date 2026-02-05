// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBQF5LbS7t5oQWWzEk650WqadodeNLqdac",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "somne-f5b59.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "somne-f5b59",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "somne-f5b59.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "955169704350",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:955169704350:web:9ec9609c3b1be8a0116e8f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-TQBW8K8X5H"
};

// Initialize Firebase  
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const auth = getAuth(app);