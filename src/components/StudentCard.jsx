import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, remove } from "firebase/database";
import { db } from "../firebase";
import { toast } from "react-toastify";

function StudentCard({ id, details, setKeyProp }) {
  const navigate = useNavigate();
  const deleteStudent = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this student?");
    if (!confirm) return;
  
    try {
      await remove(ref(db, `users/${id}`));
      toast.success("Student deleted successfully");
      setKeyProp(Math.random())
  
      // Optional: delete from Firebase Auth too (only if you’re an admin or use admin SDK)
      // const user = await getUserById(id); // Your method to find the auth user
      // await deleteUser(user);
  
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete student");
    }
  };
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 w-full max-w-md">
      {/* Trash Icon */}
      <div className="flex justify-end" >
        <button
          className="justify-self-end top-2 right-2 text-red-500 hover:text-red-700"
          onClick={() => deleteStudent(id)}
          title="Delete Student"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 2a1 1 0 00-1 1v1H3.5a.5.5 0 000 1h13a.5.5 0 000-1H15V3a1 1 0 00-1-1H6zm2 5a.5.5 0 011 0v7a.5.5 0 01-1 0V7zm3 0a.5.5 0 011 0v7a.5.5 0 01-1 0V7z" />
            <path
              fillRule="evenodd"
              d="M4 6a1 1 0 011-1h10a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm2 1a.5.5 0 011 0v7a.5.5 0 01-1 0V7z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={details.profilepic || "image.png"}
            alt="Profile"
            className="w-20 h-20 mx-auto rounded-full mb-4"
          />
          <div>
            <h3 className="font-semibold text-lg">{details.name}</h3>
            <p className="text-gray-500 text-sm">{details.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-gray-500 text-sm">Class</p>
          <p className="font-medium">{details.clas || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Exam</p>
          <p className="font-medium">{details.exam || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Credits</p>
          <p className="font-medium">{details.credits || "N/A"}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button className="flex items-center space-x-2 rounded-md px-3 py-2 text-gray-700 border border-gray-300 hover:bg-gray-100 transition duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8h5M7 16h6"
            />
          </svg>
          <span>Message</span>
        </button>
        <button
          onClick={() => navigate(`/students/${details.id}`)}
          className="bg-indigo-400 hover:bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md transition duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default StudentCard;
