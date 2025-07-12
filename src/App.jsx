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
import ForgotPassword from "./pages/ForgotPassword";
import Notifications from "./pages/Notifications";
import Share from "./pages/Share";
import SharePoster from "./pages/SharePosters";
import Unauthorized from "./pages/Unauthorized"; // Import the new component
import { ToastContainer } from "react-toastify";

function App() {
  const { isAuthorized, access } = useAuth();

  if (isAuthorized === "pending") {
    return <div>Loading...</div>; // Or a global spinner
  }

  return (
    <div>
      {isAuthorized === "authorized" && <Navbar />}
      <ToastContainer />
      <Routes>
        {isAuthorized !== "authorized" ? (
          <>
            <Route path="/signin" element={<Signin />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            {/* If logged in but not authorized, show the Unauthorized page */}
            {isAuthorized === "unauthorized" && (
              <Route path="/unauthorized" element={<Unauthorized />} />
            )}
            {/* Redirect any other path to the correct page based on auth status */}
            <Route
              path="*"
              element={<Navigate to={isAuthorized === "unauthorized" ? "/unauthorized" : "/signin"} replace />}
            />
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
            <Route path="/share" element={<Share />} />
            <Route path="/share-poster" element={<SharePoster />} />
            {access === "admin" && <Route path="/org" element={<Org />} />}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
