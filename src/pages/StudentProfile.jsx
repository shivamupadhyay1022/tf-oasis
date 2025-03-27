import React, { useState, useEffect } from "react";
import Overview from "../components/StudentProfile/Overview";
import ClassTracking from "../components/StudentProfile/ClassTracking";
import TestRecords from "../components/StudentProfile/TestRecords";
import FeeDetails from "../components/StudentProfile/FeeDetails";
import Attendance from "../components/StudentProfile/Attendance";
import { useParams } from "react-router-dom";
import { ref, get, update } from "firebase/database";
import { db } from "../firebase";
// import { supabase } from "../supabase";

const StudentProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profilepic: "",
    clas: "",
    exam: "",
    credits: 0,
    bio: "",
  });
  const [activeTab, setActiveTab] = useState("Overview");
  const [key, setKey] = useState(0)


  // Fetch User Data from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = ref(db, `users/${id}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }
      console.log(userData);
    };

    fetchUserData();
  }, [id,key]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update User Data in Firebase
  const handleSave = async () => {
    const userRef = ref(db, `users/${id}`);
    await update(userRef, userData);
    toast.success("User data updated successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{userData.name}</h1>
          <p className="text-gray-500">Student Profile: {id}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5 md:space-x-4  px-4 mb-4 py-2 rounded-lg text-gray-600">
        {[
          "Overview",
          "Class Tracking",
          "Test Records",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 p-1 w-full rounded-xl ${
              activeTab === tab
                ? "font-semibold border-b-2 bg-gray-200 border-indigo-500"
                : "hover:text-indigo-500 border-b-2 border-gray-200 "
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Render Content Based on Active Tab */}
      {activeTab === "Overview" && (
        <Overview
          student={userData}
        />
      )}
      {activeTab === "Class Tracking" && <ClassTracking userData={userData} setKeyProp={setKey} />}
      {activeTab === "Test Records" && <TestRecords />}
      {activeTab === "Fee Details" && <FeeDetails />}
      {activeTab === "Attendance" && <Attendance />}
    </div>
  );
};
export default StudentProfile;
