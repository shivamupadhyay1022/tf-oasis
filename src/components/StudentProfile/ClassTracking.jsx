import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase"; // Adjust based on your Firebase config
import {
  ref,
  update,
  remove,
  push,
  set,
  get,
  onValue,
} from "firebase/database";
import SubtopicSearch from "../SubtopicSearch";
import { useAuth } from "../AuthContext";
import { v4 as uuidv4 } from "uuid";
const ClassTracking = ({ userData, setKeyProp, id }) => {
  const [classHistory, setClassHistory] = useState({});
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [topicsList, setTopicsList] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [topics, setTopics] = useState("");
  const [editedDetails, setEditedDetails] = useState({});
  const [onclose, setOnClose] = useState(false);
  const [newClassDetails, setNewClassDetails] = useState({});
  const navigate = useNavigate();

  const { userName } = useAuth();

  useEffect(() => {
    if (userData?.classHistory) {
      console.log(userName);
      console.log(id);
      const groupedByTutors = {};
      // console.log(userData.classHistory)
      Object.entries(userData.classHistory).forEach(([locationId, class_]) => {
        // console.log("Class Object:", class_);
        // console.log("Location ID:", locationId); // Check if this matches the correct key
        // console.log("Class Object:", class_); // Ensure this contains the expected data
        if (!groupedByTutors[class_.tutorName]) {
          groupedByTutors[class_.tutorName] = [];
        }
        groupedByTutors[class_.tutorName].push({ ...class_, id: locationId });
      });
      setClassHistory(groupedByTutors);
    }
  }, [userData]);

  // Function to handle editing topics
  const addTopic = () => {
    if (!newTopic.trim()) return alert("Enter a topic first!");
    const updatedTopics = [...new Set([...topicsList, newTopic])];
    setTopicsList(updatedTopics);
    setNewTopic("");
  };

  const removeTopic = (topic) => {
    const updatedTopics = topicsList.filter((t) => t !== topic);
    setTopicsList(updatedTopics);
  };

  // Function to handle editing class details
  const handleEditClass = (session) => {
    setEditingClass(session.id);
    setEditedDetails({ ...session });
    setTopicsList(session.topicsCovered || []);
  };

  const handleUpdateClass = async (id) => {
    if (!editingClass) return;

    const updatedData = {
      ...editedDetails,
      edited: userName,
      topicsCovered: topicsList,
    };

    try {
      // Update in Firebase
      const tutorRef = ref(
        db,
        `tutors/${editedDetails.tutorId}/classHistory/${id}`
      );
      const studentIds = Array.isArray(editedDetails.studentId)
        ? editedDetails.studentId
        : [editedDetails.studentId];

      await update(tutorRef, updatedData);
      await Promise.all(
        studentIds.map((studentId) =>
          update(ref(db, `users/${studentId}/classHistory/${id}`), updatedData)
        )
      );
      setKeyProp(Math.random());
      alert("Class updated successfully!");
      setEditingClass(null);
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };

  // Function to delete class
  const deleteClass = async (session) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      // Remove from tutor
      await remove(
        ref(db, `tutors/${session.tutorId}/classHistory/${session.id}`)
      );

      // Remove from all students
      const studentIds = Array.isArray(session.studentId)
        ? session.studentId
        : [session.studentId];
      await Promise.all(
        studentIds.map((studentId) =>
          remove(ref(db, `users/${studentId}/classHistory/${session.id}`))
        )
      );
      setKeyProp(Math.random());
      alert("Class deleted successfully!");
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  async function openEditDialog() {
    setOnClose(!onclose)
    const unsubscribe = onValue(ref(db, "tutors"), (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({
        id,
        name: val.name
      }));
      setTeachers(list);
    });

    return () => unsubscribe();
  }

  const parseDuration = (durationStr) => {
    const [h = 0, m = 0, s = 0] = durationStr.split(":").map(Number);
    return (h * 3600 + m * 60 + s) * 1000;
  };

  const addNewClass = async () => {
    if (!selectedTeacher || !newClassDetails.duration || !newClassDetails.startTime)
      return alert("Please fill all required fields");
  
    const newId = uuidv4();
    const studentId = id;
  
    const fullDetails = {
      id: newId,
      status: "completed",
      studentId,
      studentName: userData?.name || "Student",
      tutorId: selectedTeacher.id,
      tutorName: selectedTeacher.name,
      duration: newClassDetails.duration,
      startTime: newClassDetails.startTime,
      endTime: newClassDetails.startTime + parseDuration(newClassDetails.duration),
      topicsCovered: topicsList,
    };
  
    await set(ref(db, `users/${studentId}/classHistory/${newId}`), fullDetails);
    await set(ref(db, `tutors/${selectedTeacher.id}/classHistory/${newId}`), fullDetails);
  
    setOnClose(false);
    setKeyProp(Math.random())
  };
  return (
    <div className="p-6">
      <div className="flex justify-between my-1">
        <h2 className="text-2xl font-semibold mb-4">Class History</h2>{" "}
        <button onClick={openEditDialog} className="p-2 bg-gray-300 rounded">
          Add new Class
        </button>
      </div>

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
                      <p>Class Id: {session.id}</p>
                      {session.edited && (
                        <p>
                          Last Edited By:{" "}
                          <span className="text-blue-600">
                            {session?.edited}
                          </span>
                        </p>
                      )}

                      {editingClass === session.id ? (
                        <div>
                          {/* Edit Form */}
                          <label className="block text-gray-500 text-sm">
                            Duration:
                            <input
                              type="text"
                              value={editedDetails.duration}
                              onChange={(e) =>
                                setEditedDetails({
                                  ...editedDetails,
                                  duration: e.target.value,
                                })
                              }
                              className="border p-2 w-full rounded"
                            />
                          </label>

                          <label className="block text-gray-500 text-sm mt-2">
                            Date:
                            <input
                              type="date"
                              value={
                                new Date(editedDetails.startTime)
                                  .toISOString()
                                  .split("T")[0]
                              }
                              onChange={(e) =>
                                setEditedDetails({
                                  ...editedDetails,
                                  startTime: new Date(e.target.value).getTime(),
                                })
                              }
                              className="border p-2 w-full rounded"
                            />
                          </label>

                          {/* Edit Topics */}
                          <div className="mt-4">
                            <SubtopicSearch func={setNewTopic} />
                            <div className="flex items-center gap-3">
                              <hr className="flex-1 border-2 border-gray-300" />
                              <p className="text-xl">Or</p>
                              <hr className="flex-1 border-2 border-gray-300" />
                            </div>

                            <div className="flex">
                              <input
                                type="text"
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                                placeholder="Enter topic"
                                className="border p-2 w-full rounded"
                              />
                              <button
                                onClick={addTopic}
                                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                              >
                                Add
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                              {topicsList.map((topic, index) => (
                                <div
                                  key={index}
                                  className="flex items-center bg-gray-200 px-3 py-1 rounded-full"
                                >
                                  {topic}
                                  <button
                                    onClick={() => removeTopic(topic)}
                                    className="ml-2 text-red-500 font-bold"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between mt-4">
                            <button
                              onClick={() => handleUpdateClass(session.id)}
                              className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingClass(null)}
                              className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between w-full">
                            <div className="text-white flex items-center my-2">
                              .
                              {session?.groupClass && (
                                <div className="text-blue-500 rounded">
                                  Group Class with:
                                  {Array.isArray(session?.studentName) &&
                                    session?.studentName?.length > 1 && (
                                      <div className="ml-2 text-black">
                                        {/* {console.log(class_.studentName)} */}
                                        <ul className="list-disc ml-4">
                                          {session?.studentName?.map(
                                            (name, index) => (
                                              <li key={index}>{name}</li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                            <button
                              className="justify-self-end text-md bg-blue-500 text-white p-2 rounded-lg"
                              onClick={() =>
                                navigate(`/tutors/${session.tutorId}`)
                              }
                            >
                              Know the Tutor
                            </button>
                          </div>
                          <p className="text-gray-500 text-sm">
                            Duration: {session.duration || "N/A"}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Date:{" "}
                            {new Date(session.startTime).toLocaleDateString()}
                          </p>

                          <p className="text-gray-500 text-sm mt-2">
                            Topics Covered:
                          </p>
                          <ul className="list-disc ml-4">
                            {session.topicsCovered?.length ? (
                              session.topicsCovered.map((topic, index) => (
                                <li key={index}>{topic}</li>
                              ))
                            ) : (
                              <li className="text-gray-400">
                                No topics covered
                              </li>
                            )}
                          </ul>

                          <div className="flex justify-between mt-4">
                            <button
                              onClick={() => handleEditClass(session)}
                              className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteClass(session)}
                              className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
{onclose && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex  justify-center items-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-h-[90vh] overflow-y-auto max-w-md relative">
      <h2 className="text-xl font-bold mb-1">Add New Class</h2>

      {/* Teacher Dropdown */}
      <input
        className="w-full border px-3 py-2 rounded mb-2"
        placeholder="Search Teacher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={teachers}
      />
      <div className="max-h-40 overflow-y-auto border rounded mb-4">
        {filteredTeachers.map((t) => (
          <div
            key={t.id}
            onClick={() => {
              setSelectedTeacher(t);
              setSearch(t.name);
            }}
            className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
              selectedTeacher?.id === t.id ? "bg-blue-200 font-medium" : ""
            }`}
          >
            {t.name}
          </div>
        ))}
      </div>

      {/* Duration Input */}
      <label className="block text-gray-500 text-sm">
        Duration (HH:MM:SS):
        <input
          type="text"
          value={newClassDetails.duration || ""}
          placeholder="00:00:00"
          onChange={(e) =>
            setNewClassDetails({
              ...newClassDetails,
              duration: e.target.value,
            })
          }
          className="border p-2 w-full rounded"
        />
      </label>

      {/* Date Input */}
      <label className="block text-gray-500 text-sm mt-2">
        Date:
        <input
          type="date"
          onChange={(e) =>
            setNewClassDetails({
              ...newClassDetails,
              startTime: new Date(e.target.value).getTime(),
            })
          }
          className="border p-2 w-full rounded"
        />
      </label>

      {/* Topics */}
      <div className="my-3">
        <SubtopicSearch func={setNewTopic} />
        <div className="flex items-center gap-3 my-2">
          <hr className="flex-1 border-2 border-gray-300" />
          <p className="text-xl">Or</p>
          <hr className="flex-1 border-2 border-gray-300" />
        </div>

        <div className="flex">
          <input
            type="text"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="Enter topic"
            className="border p-2 w-full rounded"
          />
          <button
            onClick={addTopic}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {topicsList.map((topic, i) => (
            <div
              key={i}
              className="flex items-center bg-gray-200 px-3 py-1 rounded-full"
            >
              {topic}
              <button
                onClick={() => removeTopic(topic)}
                className="ml-2 text-red-500 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setOnClose(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={addNewClass}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ClassTracking;
