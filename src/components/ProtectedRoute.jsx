import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthProvider);

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
