// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, updateDoc } from "firebase/firestore";  // Firestore imports

const firebaseConfig = {
  apiKey: "AIzaSyC6-nHPqTIJnfhnX3tWHRGkMQRbP-5sDTU",
  authDomain: "oasis-buildathon-27c6e.firebaseapp.com",
  projectId: "oasis-buildathon-27c6e",
  storageBucket: "oasis-buildathon-27c6e.firebasestorage.app",
  messagingSenderId: "129499605758",
  appId: "1:129499605758:web:df21f6932fff16fd7893af",
  measurementId: "G-KT24P3J7K7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, firestore, googleProvider, signInWithPopup, createUserWithEmailAndPassword, collection, getDocs, addDoc, updateDoc };
