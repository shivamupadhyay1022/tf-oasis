import React, { useEffect, useState } from "react";
import { ref, onValue, set, remove, push, update } from "firebase/database";
import { db } from "../firebase";
import { useAuth } from "../components/AuthContext";

const Notifications = () => {
  const { currentUser } = useAuth();
  const username = currentUser.email.split("@")[0];

  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ message: "", priority: "moderate" });
  const [page, setPage] = useState(0);

  useEffect(() => {
    onValue(ref(db, "users"), (snapshot) => {
      const data = snapshot.val() || {};
      const userList = Object.entries(data).map(([id, details]) => ({
        id,
        name: details.name,
        email: details.email,
      }));
      setUsers(userList);
    });

    onValue(ref(db, "tutors"), (snapshot) => {
      const data = snapshot.val() || {};
      const tutorList = Object.entries(data).map(([id, details]) => ({
        id,
        name: details.name,
        email: details.email,
      }));
      setTutors(tutorList);
    });

    onValue(ref(db, "notifications"), (snapshot) => {
      const data = snapshot.val() || {};
      const notifs = Object.entries(data)
        .map(([id, details]) => ({ id, ...details }))
        .sort((a, b) => b.time - a.time);
      setNotifications(notifs);
    });
  }, []);

  const toggleSelect = (item) => {
    console.log(item)
    if (selected.some((s) => s.id === item.id)) {
      setSelected(selected.filter((s) => s.id !== item.id));
    } else {
      setSelected([...selected, item]);
    }
  };

  const handleSelectAll = () => {
    const all = [...users, ...tutors];
    setSelected(all);
  };

  const handleSend = async () => {
    const notifId = push(ref(db, "notifications")).key;
    const notifData = {
      ...form,
      time: Date.now(),
      sender: username,
      sent: selected.map((sel) => ({ name: sel.name, id: sel.id })),
    };

    await set(ref(db, `notifications/${notifId}`), notifData);

    const updates = {};
    selected.forEach((sel) => {
      const path =
        tutors.find((tutor) => tutor.id === sel.id) !== undefined
          ? `tutors/${sel.id}/notifications/${notifId}`
          : `users/${sel.id}/notifications/${notifId}`;
      updates[path] = notifData;
    });

    await update(ref(db), updates);

    setOpenDialog(false);
    setForm({ message: "", priority: "moderate" });
    setSelected([]);
  };

  const handleDelete = async (notifId) => {
    await remove(ref(db, `notifications/${notifId}`));

    const updates = {};
    [...users, ...tutors].forEach((sel) => {
      updates[`users/${sel.id}/notifications/${notifId}`] = null;
      updates[`tutors/${sel.id}/notifications/${notifId}`] = null;
    });

    await update(ref(db), updates);
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex justify-center space-x-6 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "tutors" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setActiveTab("tutors")}
        >
          Tutors
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleSelectAll}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Select All Users
        </button>
        <button
          onClick={() => setOpenDialog(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Notify
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {(activeTab === "users" ? users : tutors).map((item) => (
          <div
          key={item.id}
          onClick={() => toggleSelect(item)}
          className={`flex items-center justify-between p-4 rounded-md border ${selected.some((s) => s.id === item.id) ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        >
          <div>
            <h4 className="font-semibold">{item.name || "No Name"}</h4>
            <p className="text-sm text-gray-600">{item.email || "No Email"}</p>
          </div>
          <input
            type="checkbox"
            checked={selected.some((s) => s.id === item.id)}
          />
        </div>
        ))}
      </div>

      {/* Past Notifications */}
      <h2 className="text-xl font-semibold mb-4">Past Notifications</h2>
      <div className="space-y-3 mb-4">
        {notifications.slice(page * 10, page * 10 + 10).map((notif) => (
          <div key={notif.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{notif.message}</p>
              <p className="text-gray-600 text-sm">
                {new Date(notif.time).toLocaleString()} • {notif.priority.toUpperCase()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(notif.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          ← Prev
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Next →
        </button>
      </div>

      {/* Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96 space-y-4">
            <h2 className="text-xl font-semibold">Send Notification</h2>
            <textarea
              className="w-full border rounded p-2"
              rows="3"
              placeholder="Your message..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <select
              className="w-full border rounded p-2"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="urgent">Urgent</option>
              <option value="moderate">Moderate</option>
              <option value="promotional">Promotional</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={() => setOpenDialog(false)}
                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
