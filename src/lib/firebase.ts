// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// All values MUST be provided via environment variables (VITE_FIREBASE_*)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate required config in development
if (import.meta.env.DEV && !firebaseConfig.apiKey) {
  console.error('Missing Firebase config. Create a .env file with VITE_FIREBASE_* variables.');
}

// Initialize Firebase  
export const app = initializeApp(firebaseConfig);
// Analytics throws without a projectId, so only start it when config is present
export const analytics: Analytics | null = firebaseConfig.projectId ? getAnalytics(app) : null;
export const storage = getStorage(app);
export const auth = getAuth(app);