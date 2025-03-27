import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ClassTracking = ({ userData, setUserData }) => {
  const [classHistory, setClassHistory] = useState({});
  const [selectedTutor, setSelectedTutor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      const groupedByUsers = {};
      if (userData.classHistory) {
        Object.entries(userData.classHistory).forEach(([id, class_]) => {
          let studentNames = Array.isArray(class_.studentName)
            ? class_.studentName
            : [class_.studentName];

          studentNames.forEach((name) => {
            if (!groupedByUsers[name]) {
              groupedByUsers[name] = [];
            }
            groupedByUsers[name].push({ id, ...class_ });
          });
        });
      }
      setClassHistory(groupedByUsers);
    }
  }, [userData]);

  const handleDeleteClass = (classId, tutorName, studentIds) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    // Create a copy of userData classHistory
    const updatedClassHistory = { ...userData.classHistory };

    // Remove class from tutor's history
    if (updatedClassHistory[classId]) {
      delete updatedClassHistory[classId];
    }

    // Remove class from each student's history
    studentIds.forEach((studentId) => {
      Object.keys(updatedClassHistory).forEach((key) => {
        if (
          updatedClassHistory[key].studentId.includes(studentId) &&
          updatedClassHistory[key].id === classId
        ) {
          delete updatedClassHistory[key];
        }
      });
    });

    // Update state & database
    setUserData((prev) => ({ ...prev, classHistory: updatedClassHistory }));
    setClassHistory((prev) => {
      const newHistory = { ...prev };
      newHistory[tutorName] = newHistory[tutorName].filter(
        (session) => session.id !== classId
      );
      return newHistory;
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Class History</h2>
      {Object.keys(classHistory).length === 0 ? (
        <p className="text-gray-500">No class history available.</p>
      ) : (
        <div className="space-y-4">
          {Object.keys(classHistory).map((tutor) => (
            <div key={tutor}>
              <button
                className="w-full flex justify-between text-left font-semibold bg-gray-200 p-3 rounded-lg"
                onClick={() =>
                  setSelectedTutor(selectedTutor === tutor ? null : tutor)
                }
              >
                {tutor} ▼
              </button>

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

                      <div className="mt-3">
                        <p className="text-gray-500 text-sm">Feedback:</p>
                        <ul className="list-disc ml-4">
                          {session.feedback &&
                          Object.keys(session.feedback).length > 0 ? (
                            Object.entries(session.feedback).map(
                              ([category, rating]) => (
                                <li
                                  key={category}
                                  className="flex justify-between border-b pb-2"
                                >
                                  <span className="font-medium">
                                    {category}:
                                  </span>
                                  <span>{rating}</span>
                                </li>
                              )
                            )
                          ) : (
                            <li className="text-gray-400 text-sm">
                              No feedback available
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={() =>
                            navigate(`/students/${session.studentId}`)
                          }
                          className="bg-blue-400 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition duration-200"
                        >
                          View Student
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClass(
                              session.id,
                              tutor,
                              Array.isArray(session.studentId)
                                ? session.studentId
                                : [session.studentId]
                            )
                          }
                          className="bg-red-400 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition duration-200"
                        >
                          Delete Class
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
