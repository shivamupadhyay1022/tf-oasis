import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';

function StudentCard({ details }) {
   const navigate = useNavigate();
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 w-full max-w-md">
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8h5M7 16h6" />
          </svg>
          <span>Message</span>
        </button>
        <button onClick={()=>navigate(`/students/${details.id}`)} className="bg-indigo-400 hover:bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md transition duration-200">
          View Details
        </button>
      </div>
    </div>
  )
}

export default StudentCard