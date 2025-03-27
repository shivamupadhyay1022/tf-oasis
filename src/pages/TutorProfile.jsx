import React, {useState, useLayoutEffect} from "react";
import Overview from "../components/TutorProfile/Overview";
import ClassTracking from "../components/TutorProfile/ClassTracking";
import TestRecords from "../components/StudentProfile/TestRecords";
import FeeDetails from "../components/StudentProfile/FeeDetails";
import Attendance from "../components/StudentProfile/Attendance";
import { ref,get } from "firebase/database";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import TeachingDetails from "../components/TutorProfile/TeachingDetails";

const TutorProfile = () => {
  const [tutor, setTutor] = useState()  
  const { id } = useParams();
    const [key, setKey] = useState(0)
  
  useLayoutEffect(() => {
    fetchTutors();
  }, [id,key]);
 
  const fetchTutors = async () => {
    const tutorRef = ref(db, `tutors/${id}`);
    const snapshot = await get(tutorRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(data)
      setTutor(data);
    }
  };

  const [activeTab, setActiveTab] = useState("Overview");

  // Function to handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);// Disable editing mode when switching tabs
  };

  return (  
    <div className="p-6 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{tutor?.name}</h1>
          <p className="text-gray-500">Tutor Profile</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 space-x-4  px-4 mb-4 py-2 rounded-lg">
      {[
          "Overview",
          "Teaching Details",
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
      {activeTab === "Overview" && <Overview tutor={tutor}  />}
      {activeTab === "Class Tracking" && <ClassTracking userData={tutor} setKeyProp={setKey} />}
      {activeTab === "Teaching Details" && <TeachingDetails tutorData = {tutor} />}
      {activeTab === "Fee Details" && <FeeDetails />}
      {activeTab === "Attendance" && <Attendance />}
    </div>
  );
};

export default TutorProfile;
