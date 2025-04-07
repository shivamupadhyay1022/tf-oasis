import { useEffect, useState } from "react";
import { ref, get, remove } from "firebase/database";
import { db, auth } from "../firebase";
import { deleteUser } from "firebase/auth";
import StudentCard from "../components/StudentCard";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

// import { supabase } from "../supabase";
import { toast } from "react-toastify";
function Students() {
  const [users, setUsers] = useState([]);
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  const navigate = useNavigate(); 
  // Fetch all students from Firebase
  const fetchUsers = async () => {
    const usersRef = ref(db, "users/");
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const usersArray = Object.keys(data).map((userId) => ({
        id: userId,
        ...data[userId],
      }));
      setUsers(usersArray);
    }
  };

  // Delete User from Auth & Realtime db
  const handleDelete = async (userId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmation) return;

    // Delete from Firebase Realtime db
    await remove(ref(db, `users/${userId}`));

    // Delete from Firebase Authentication (if user is authenticated)
    const userToDelete = auth.currentUser;
    if (userToDelete) {
      await deleteUser(userToDelete);
    }

    // Remove from local state
    setUsers(users.filter((user) => user.id !== userId));
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  return (

    <div className="">
    <div className="flex flex-col mx-4 md:mx-8 mt-10">
      <div className="flex flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="mt-2 text-muted-foreground text-gray-400 font-semibold">
            Welcome back, here's your overview.
          </p>
        </div>
        <button
          onClick={() => setIsAddingStudent(true)}
          className="text-white bg-indigo-400 max-h-10 p-2 rounded-lg"
        >
          Add student
        </button>
      </div>
      {/* <div className="flex flex-wrap gap-4">
        {sampleStudents.length > 0 ? (
          sampleStudents.map((student) => (
            <StudentCard key={student.id} details={student} />
          ))
        ) : (
          <p>Loading students...</p>
        )}
      </div> */}
      <div className="flex flex-wrap gap-4">
        {users.length > 0 ? (
          users.map((student) => (
            <StudentCard key={student.id} details={student} />
          ))
        ) : (
          <p>Loading students...</p>
        )}
      </div>
    </div>
    {isAddingStudent && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
        <div className="bg-white p-4 sm:p-6 rounded-lg w-[90%] max-w-sm sm:max-w-lg relative shadow-lg max-h-[90vh] overflow-y-auto">
          {/* Close Button (Cross Icon) */}
          <button
            onClick={() => setIsAddingStudent(false)}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
          >
            ✖
          </button>

          <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">
            Add New Student
          </h2>

          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone", name: "phone", type: "text" },
                { label: "Class", name: "class", type: "text" },
                { label: "School", name: "school", type: "text" },
                { label: "Board", name: "board", type: "text" },
                { label: "Father's Name", name: "father_name", type: "text" },
                {
                  label: "Parent Contact",
                  name: "parent_contact",
                  type: "text",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsAddingStudent(false)}
                className="px-4 py-2 border rounded w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
  );
}

export default Students;
