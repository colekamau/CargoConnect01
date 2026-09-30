import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAbVmrR1GEC714N_GpRxbYZO4GG9pvr5hE",
  authDomain: "cargoconnect01-6ecc7.firebaseapp.com",
  projectId: "cargoconnect01-6ecc7",
  storageBucket: "cargoconnect01-6ecc7.firebasestorage.app",
  messagingSenderId: "564798165435",
  appId: "1:564798165435:web:9a5401b64dafdd32f2349e"
};

// Only initialize app once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Only initialize auth once
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (err) {
  auth = getAuth(app); // Fallback if already initialized
}

// ✅ Initialize Firestore
const db = getFirestore(app);

export { auth, db };
