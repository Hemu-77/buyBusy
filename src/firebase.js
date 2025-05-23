// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPZfykLD_oEtvF-B1dcrVrHp1paa_WdpM",
  authDomain: "fakestore-c358c.firebaseapp.com",
  projectId: "fakestore-c358c",
  storageBucket: "fakestore-c358c.firebasestorage.app",
  messagingSenderId: "871059419694",
  appId: "1:871059419694:web:81ba10c959a2a6f735e5bf",
  measurementId: "G-XS4R2R6BG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)