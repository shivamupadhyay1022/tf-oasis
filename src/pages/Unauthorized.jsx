import React from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
const Unauthorized = () => {
  const { currentUser} = useAuth();
  const navigate = useNavigate();

  const onSignOut = async () => {
    if(currentUser)
      await signOut(auth)
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          You are not authorized to access TF-OASIS
        </h1>
        {currentUser && (
          <p className="text-gray-700 mb-6">
            The account with email:{" "}
            <span className="font-semibold">{currentUser.email}</span> is not
            approved.
          </p>
        )}
        <button
          onClick={onSignOut}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
