import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "../firebase";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [access, setAccess] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const usersRef = ref(db, "allowedUsers/");
        onValue(usersRef, (snapshot) => {
          const data = snapshot.val();
          const userData = Object.values(data || {}).find(
            (u) => u.email === user.email
          );

          if (userData) {
            setCurrentUser(user);
            setAccess(userData.access);
            setUserName(userData.name);
          } else {
            signOut(auth);
            setCurrentUser(null);
            setAccess(null);
          }
          setLoading(false);
        });
      } else {
        setCurrentUser(null);
        setAccess(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, access,userName }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
