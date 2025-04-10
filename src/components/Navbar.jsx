import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext, AuthProvider } from "./AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { access } = useContext(AuthContext);

  // Toggle mobile menu
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-xl font-bold flex items-center">
            <span className="text-blue-500 text-2xl mr-2">🎓</span> TF Oasis
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          {["Dashboard", "Students", "Tutors", "Kanban","Share"]
            .concat(
              access === "admin" || access === "manager"
                ? ["Org", "Notify"]
                : []
            )
            .map((item) => (
              <li key={item}>
                <NavLink
                  to={`/${item.toLowerCase().replace(" ", "-")}`}
                  className={({ isActive }) =>
                    `hover:text-blue-500 ${
                      isActive
                        ? "text-blue-500 border-b-2 border-blue-500 pb-1"
                        : "text-gray-700"
                    }`
                  }
                >
                  {item}
                </NavLink>
              </li>
              
            ))}
                        <li>
              <button
                onClick={() => {
                  signOut(auth)
                    .then(() => {
                      toast.success("Signed Out Successfully", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                      navigate("/");
                    })
                    .catch((error) => {
                      toast.error(error.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                    });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
              </button>
            </li>
        </ul>

        {/* Mobile Menu Button (SVG Heroicons) */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {menuOpen ? (
            // XMarkIcon (Close Button)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Bars3Icon (Hamburger Menu)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md absolute w-full left-0 top-[60px]">
          <ul className="flex flex-col items-center space-y-4 py-4">
            {["Dashboard", "Students", "Tutors", "Kanban","Share"]
              .concat(
                access === "admin" || access === "manager"
                  ? ["Org", "Notify"]
                  : []
              )
              .map((item) => (
                <li key={item}>
                  <NavLink
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    className={({ isActive }) =>
                      `block py-2 text-lg ${
                        isActive
                          ? "text-blue-500 border-b-2 border-blue-500"
                          : "text-gray-700"
                      }`
                    }
                    onClick={() => setMenuOpen(false)} // Close menu on click
                  >
                    {item}
                  </NavLink>
                </li>
              ))}
            <li>
              <button
                onClick={() => {
                  signOut(auth)
                    .then(() => {
                      toast.success("Signed Out Successfully", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                      navigate("/");
                    })
                    .catch((error) => {
                      toast.error(error.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                    });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
