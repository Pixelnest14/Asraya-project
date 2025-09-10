
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { FirebaseApp } from "firebase/app";
import { getAuth, type Auth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "@/lib/firebase";

type FirebaseContextValue = {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  user: User | null;
  isLoading: boolean;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const authInstance = getAuth(appInstance);
    const dbInstance = getFirestore(appInstance);

    setApp(appInstance);
    setAuth(authInstance);
    setDb(dbInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, auth, db, user, isLoading }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
