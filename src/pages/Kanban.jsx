import { useEffect, useState } from "react";
import { db } from "../firebase"; // Import Firebase config
import { ref, onValue, push } from "firebase/database";
import Column from "../components/Column";

const Kanban = () => {
  const [cards, setCards] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuery, setNewQuery] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    status: "pending",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const queriesRef = ref(db, "queries/");
    onValue(queriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCards(
          Object.keys(data).map((key) => ({
            id: key,
            name: data[key].name,
            email: data[key].email,
            message: data[key].message,
            status: data[key].status,
            phone: data[key].phone,
          }))
        );
      }
    });
  }, []);

  const handleAddQuery = () => {
    if (!newQuery.name || !newQuery.email || !newQuery.phone || !newQuery.message) {
      alert("Please fill in all fields");
      return;
    }
  
    const queriesRef = ref(db, "queries/");
    push(queriesRef, newQuery)
      .then(() => {
        setIsDialogOpen(false);
        setNewQuery({
          name: '',
          email: '',
          phone: '',
          message: '',
          status: 'pending'
        });
      })
      .catch((error) => {
        console.error("Error adding query:", error);
      });
  };

  return (
    <div  >
            <div className="flex justify-end mx-4 mt-4">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add New Query
        </button>
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Add New Query
              </h2>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newQuery.name}
                  onChange={(e) =>
                    setNewQuery({ ...newQuery, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter name"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newQuery.email}
                  onChange={(e) =>
                    setNewQuery({ ...newQuery, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter email"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={newQuery.phone}
                  onChange={(e) =>
                    setNewQuery({ ...newQuery, phone: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter phone"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={newQuery.message}
                  onChange={(e) =>
                    setNewQuery({ ...newQuery, message: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter message"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuery}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    <div
      className={`py-8 px-4 md:px-16 w-full justify-between bg-gray-50 text-gray-900 ${
        isMobile ? "flex flex-col gap-6" : "flex gap-3 overflow-scroll"
      }`}
    >

      {["pending", "in_progress", "waiting_reply", "add_to_db"].map(
        (status) => (
          <Column
            key={status}
            title={status}
            column={status}
            cards={cards}
            setCards={setCards}
            isMobile={isMobile}
          />
        )
      )}
    </div>
    </div>
  );
};

export default Kanban;
