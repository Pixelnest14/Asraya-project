
import type { FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";

// Your web app's Firebase configuration
// IMPORTANT: This is a placeholder configuration.
// To use your own Firebase project, replace these values with the ones
// from your Firebase project's settings.
export const firebaseConfig: FirebaseOptions = {
  projectId: "asraya-society-hub-5ycb3",
  appId: "1:155221697037:web:5aa3356f354e79853e6b44",
  storageBucket: "asraya-society-hub-5ycb3.firebasestorage.app",
  apiKey: "AIzaSyB1gSdbomqvmuK7I4lpnHjSLCDSrcTUhto",
  authDomain: "asraya-society-hub-5ycb3.firebaseapp.com",
  messagingSenderId: "155221697037"
};

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
