import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChXRf08P_P_H7R1Wf7qOp1r_Ax-C9iVFzwM",
  authDomain: "oasis-buildathon.firebaseapp.com",
  projectId: "oasis-buildathon",
  storageBucket: "oasis-buildathon.appspot.com",
  messagingSenderId: "408477099939",
  appId: "1:408477099939:web:f1cec2480f6a9d4fe61c16",
  measurementId: "G-T5717719JQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider, signInWithPopup };
