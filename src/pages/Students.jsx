import { useEffect, useState } from "react";
import { ref, get, remove, set } from "firebase/database";
import { db, auth } from "../firebase";
import { deleteUser } from "firebase/auth";
import StudentCard from "../components/StudentCard";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";

// import { supabase } from "../supabase";
import { toast } from "react-toastify";
function Students() {
  const [users, setUsers] = useState([]);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [loading, setLoading] = useState();
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [key, setKey] = useState("123");
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { name, email, phone, password } = formData;

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      // Save additional data in Realtime DB
      await set(ref(db, `users/${userId}`), {
        name,
        email,
        phone,
        createdAt: Date.now(),
        classHistory: {},
      });

      toast.success("Student added successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setFormData({ name: "", email: "", phone: "", password: "" });
      setIsAddingStudent(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add student", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log("123");
    } finally {
      setLoading(false);
      setKey(Math.random());
    }
  };

  return (
    <div className="">
      <div key={key} className="flex flex-col mx-4 md:mx-8 mt-10">
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
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tutors..."
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <div className="flex flex-wrap gap-4">
          {users.length > 0 ? (
            users
              .filter((tutor) =>
                tutor.name?.toLowerCase().includes(search.toLowerCase())
              )
              .map((student) => (
                <StudentCard
                  key={student.id}
                  id={student.id}
                  details={student}
                  setKeyProp={setKey}
                />
              ))
          ) : (
            <p>Loading students...</p>
          )}
        </div>
      </div>
      {isAddingStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative shadow-lg max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsAddingStudent(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">
              Add New Student
            </h2>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", name: "name", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Phone", name: "phone", type: "text" },
                  { label: "Password", name: "password", type: "password" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium mb-1">
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

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingStudent(false)}
                  className="px-4 py-2 border rounded w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded w-full sm:w-auto"
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
