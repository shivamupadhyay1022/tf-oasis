import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard"
import Students from "./pages/Students";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import StudentProfile from "./pages/StudentProfile";
import './App.css'
import Tutors from './pages/Tutors';
import TutorProfile from './pages/TutorProfile';
import Kanban from './pages/Kanban';
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/tutors/:id" element={<TutorProfile />} />
          <Route path="/kanban" element={<Kanban />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
