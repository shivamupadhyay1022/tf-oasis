import React, { useEffect, useState } from "react";
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { db, auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Org = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", access: "" });
  const [editId, setEditId] = useState(null);
  const [usersList, setUsersList] = useState({});

  useEffect(() => {
    const usersRef = ref(db, "allowedUsers");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setUsersList(data);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update existing user in Realtime Database
        const updatedData = { ...formData };
        delete updatedData.password; // Don't store password in database
        await update(ref(db, `allowedUsers/${editId}`), updatedData);
      } else {
        // Create new user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const newUserRef = push(ref(db, "allowedUsers"));
        await set(newUserRef, {
          name: formData.name,
          email: formData.email,
          access: formData.access
        });
      }

      setFormData({ name: "", email: "", password: "", access: "" });
      setEditId(null);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error creating/updating user:", error);
      alert(error.message);
    }
  };

  const handleEdit = (id, user) => {
    setFormData({ name: user.name, email: user.email, password: "", access: user.access });
    setEditId(id);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    await remove(ref(db, `allowedUsers/${id}`));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Organization Access Control</h1>
        <button
          onClick={() => {
            setFormData({ name: "", email: "", password: "", access: "" });
            setEditId(null);
            setOpenDialog(true);
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add New User
        </button>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(usersList).map(([id, user]) => (
          <div key={id} className="bg-white shadow rounded-lg p-5 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Access: {user.access}
              </span>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => handleEdit(id, user)} className="text-green-600 hover:text-green-800">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M4 21h4l10-10-4-4L4 17v4zM14.7 5.3l4 4 2-2-4-4-2 2z" fill="currentColor" />
                </svg>
              </button>
              <button onClick={() => handleDelete(id)} className="text-red-600 hover:text-red-800">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M3 6h18M9 6v12m6-12v12M4 6l1 14a2 2 0 002 2h10a2 2 0 002-2l1-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {editId ? "Edit User" : "Add New User"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                  required
                  disabled={!!editId} // disable email field during edit
                />
              </div>
              {!editId && (
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-gray-700 text-sm mb-1">Access Level</label>
                <input
                  type="text"
                  name="access"
                  value={formData.access}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenDialog(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editId ? "Update User" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Org;
