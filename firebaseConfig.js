// firebaseConfig.js
import firebase, { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { getAuth } from 'firebase/auth';

//Firebase Details for Sign-up
const firebaseConfig = {
  apiKey: "AIzaSyBGIKtYX7TJBvrjQMVzsei6fynEZ2BC-PM",
  authDomain: "aut-playground.firebaseapp.com",
  projectId: "aut-playground",
  storageBucket: "aut-playground.appspot.com",
  messagingSenderId: "731605926574",
  appId: "1:731605926574:web:20b685e88682c1576ca33f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
