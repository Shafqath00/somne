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
  apiKey: "AIzaSyBQF5LbS7t5oQWWzEk650WqadodeNLqdac",
  authDomain: "somne-f5b59.firebaseapp.com",
  projectId: "somne-f5b59",
  storageBucket: "somne-f5b59.firebasestorage.app",
  messagingSenderId: "955169704350",
  appId: "1:955169704350:web:9ec9609c3b1be8a0116e8f",
  measurementId: "G-TQBW8K8X5H"
};

// Initialize Firebase  
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const auth = getAuth(app);