import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Firebase configuration details
const firebaseConfig = {
  apiKey: "AIzaSyBGIKtYX7TJBvrjQMVzsei6fynEZ2BC-PM",
  authDomain: "aut-playground.firebaseapp.com",
  projectId: "aut-playground",
  storageBucket: "aut-playground.appspot.com",
  messagingSenderId: "731605926574",
  appId: "1:731605926574:web:20b685e88682c1576ca33f",
};

// Initialize Firebase only if no apps have been initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use the existing initialized app
}

// Initialize Firebase Auth with AsyncStorage persistence
let auth;
if (!auth) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };
