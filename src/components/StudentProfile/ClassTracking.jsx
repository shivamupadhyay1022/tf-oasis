import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ClassTracking = ({ userData }) => {
  const [classHistory, setClassHistory] = useState({});
  const [selectedTutor, setSelectedTutor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      const groupedByTutors = {};
      Object.entries(userData.classHistory).forEach(([id, class_]) => {
        // console.log("Class Object:", class_);
        if (!groupedByTutors[class_.tutorName]) {
          groupedByTutors[class_.tutorName] = [];
        }
        groupedByTutors[class_.tutorName].push({ id, ...class_ });
      });
      setClassHistory(groupedByTutors);
    }
  }, [userData]);

  // useEffect(() => {
  //   console.log("Processed Class History:", classHistory);
  // }, [classHistory]);
  // useEffect(() => {
  //   if (!userData || Object.keys(userData).length === 0) {
  //     console.log("No class history data available.");
  //     return;
  //   }

  //   // console.log("Received userData:", userData);

  //   const groupedClasses = {};
  //   Object.entries(userData).forEach(([id, class_]) => {
  //     if (!class_ || !class_.tutorName) return; // Skip invalid entries

  //     if (!groupedClasses[class_.tutorName]) {
  //       groupedClasses[class_.tutorName] = [];
  //     }
  //     groupedClasses[class_.tutorName].push({ id, ...class_ });
  //   });

  //   console.log("Processed Class History:", groupedClasses);
  //   setClassHistory(groupedClasses);
  // }, [userData]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Class History</h2>
      {Object.keys(classHistory).length === 0 ? (
        <p className="text-gray-500">No class history available.</p>
      ) : (
        <div className="space-y-4">
          {Object.keys(classHistory).map((tutor) => (
            <div key={tutor}>
              {/* Tutor Dropdown */}
              <button
                className="w-full flex justify-between text-left font-semibold bg-gray-200 p-3 rounded-lg"
                onClick={() =>
                  setSelectedTutor(selectedTutor === tutor ? null : tutor)
                }
              >
                {tutor} ▼
              </button>

              {/* Show Classes if Tutor is Selected */}
              {selectedTutor === tutor && (
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classHistory[tutor].map((session) => (
                    <div
                      key={session.id}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-md"
                    >

                      <p className="text-gray-500 text-sm">
                        Duration: {session.duration || "N/A"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Date: {new Date(session.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Time: {new Date(session.startTime).toLocaleTimeString()}
                      </p>

                      <div className="mt-3">
                        <p className="text-gray-500 text-sm">Topics Covered:</p>
                        <ul className="list-disc ml-4">
                          {session.topicsCovered?.length > 0 ? (
                            session.topicsCovered.map((topic, index) => (
                              <li key={index} className="font-medium text-sm">
                                {topic}
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-400 text-sm">
                              No topics covered
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="flex items-center justify-end mt-4">
                        <button
                          onClick={() => navigate(`/tutors/${session.tutorId}`)}
                          className="bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition duration-200"
                        >
                          View Tutor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassTracking;
