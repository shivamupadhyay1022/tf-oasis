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

  const [isAuthorized, setIsAuthorized] = useState("pending");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      if (user) {
        const usersRef = ref(db, "allowedUsers/");
        onValue(
          usersRef,
          (snapshot) => {
            const data = snapshot.val();
            const userData = Object.values(data || {}).find(
              (u) => u.email === user.email
            );

            if (userData) {
              setCurrentUser(user);
              setAccess(userData.access);
              setUserName(userData.name);
              setIsAuthorized("authorized");
            } else {
              setCurrentUser(user); // Keep user to display email
              setAccess(null);
              setUserName(null);
              setIsAuthorized("unauthorized");
            }
            setLoading(false);
          },
          {
            onlyOnce: true,
          }
        );
      } else {
        setCurrentUser(null);
        setAccess(null);
        setUserName(null);
        setIsAuthorized("unauthorized");
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, access, userName, isAuthorized, handleSignOut }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
