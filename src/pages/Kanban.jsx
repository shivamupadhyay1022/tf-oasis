import { useEffect, useState } from "react";
import { db } from "../firebase"; // Import Firebase config
import { ref, onValue } from "firebase/database";
import Column from "../components/Column";

const Kanban = () => {
  const [cards, setCards] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
            phone: data[key].phone
          }))
        );
      }
    });
  }, []);

  return (
    <div className={`py-8 px-4 md:px-16 w-full justify-between bg-gray-50 text-gray-900 ${isMobile ? "flex flex-col gap-6" : "flex gap-3 overflow-scroll"}`}>
      {["pending", "in_progress", "waiting_reply", "add_to_db"].map((status) => (
        <Column key={status} title={status} column={status} cards={cards} setCards={setCards} isMobile={isMobile} />
      ))}
    </div>
  );
};

export default Kanban;
