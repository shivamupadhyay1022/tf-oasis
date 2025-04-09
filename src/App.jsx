import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./components/AuthContext";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentProfile from "./pages/StudentProfile";
import Tutors from "./pages/Tutors";
import TutorProfile from "./pages/TutorProfile";
import Kanban from "./pages/Kanban";
import Org from "./pages/Org";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Notifications from "./pages/Notifications";

function App() {
  const { currentUser, access } = useAuth();

  return (
    <div>
      {currentUser && <Navbar />}
      <Routes>
        {!currentUser ? (
          <>
            <Route path="*" element={<Navigate to="/signin" replace />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot" element={<ForgotPassword />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/tutors" element={<Tutors />} />
            <Route path="/tutors/:id" element={<TutorProfile />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/notify" element={<Notifications />} />
            {access === "admin" && <Route path="/org" element={<Org />} />}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
