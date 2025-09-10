import type { FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";

// Your web app's Firebase configuration
// IMPORTANT: This is a placeholder configuration.
// To use your own Firebase project, replace these values with the ones
// from your Firebase project's settings.
export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your-app-id"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Initialize Firebase only if it hasn't been initialized yet.
if (getApps().length === 0) {
  // Basic check to see if the config is just placeholders
  if (firebaseConfig.apiKey === "your-api-key") {
    console.warn("Using placeholder Firebase config. Please update src/lib/firebase.ts with your project's credentials.");
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
