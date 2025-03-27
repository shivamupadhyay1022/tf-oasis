import { useEffect, useState } from "react";
import { ref, get, remove } from "firebase/database";
import { deleteUser } from "firebase/auth";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import TutorCard from "../components/TutorCard";

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const navigate = useNavigate()
  // Fetch All Tutors from Firebase
  const fetchTutors = async () => {
    const tutorsRef = ref(db, "tutors/");
    const snapshot = await get(tutorsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const tutorsArray = Object.keys(data).map((tutorId) => ({
        id: tutorId,
        ...data[tutorId],
      }));
      setTutors(tutorsArray);
    }
  };

  // Delete Tutor from Auth & Realtime db
  const handleDelete = async (tutorId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this tutor?"
    );
    if (!confirmation) return;

    // Delete from Firebase Realtime db
    await remove(ref(db, `tutors/${tutorId}`));

    // Delete from Firebase Authentication (if authenticated)
    const tutorToDelete = auth.currentUser;
    if (tutorToDelete) {
      await deleteUser(tutorToDelete);
    }

    // Remove from local state
    setTutors(tutors.filter((tutor) => tutor.id !== tutorId));
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  return (
    <div className=" bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold p-8">Manage Tutors</h1>

      <div className="grid p-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-3">
      {tutors.length > 0 ? (
          tutors.map((student) => (
            <TutorCard key={student.id} details={student} />
          ))
        ) : (
          <p>Loading students...</p>
        )}
      </div>
    </div>
  );
}
