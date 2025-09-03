import { useEffect, useState, useRef } from "react";
import {
  LogOut,
  Menu,
  Sun,
  Moon,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../theme/ThemeProvider";
const getDecodedUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    return null;
  }
};

export default function Navbar({ sidebarOpen, setSidebarOpen, onLogout }) {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const decoded = getDecodedUser();
    if (decoded) {
      setUser(decoded);
    }
  }, []);

  const { mode: themeMode, setMode } = useThemeMode();

  const toggleTheme = () => {
    const nextMode = themeMode === "dark" ? "light" : "dark";
    setMode(nextMode);
    localStorage.setItem("theme", nextMode);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
   
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-1 shadow fixed top-0 left-0 right-0 z-50 transition-colors duration-200">
     {/* Left: Sidebar Toggle & Logo */}
<div className="flex items-center gap-3">
  <button
    aria-label="Toggle sidebar"
    className="lg:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    onClick={() => setSidebarOpen(!sidebarOpen)}
  >
    <Menu size={20} />
  </button>

  <img
    src={themeMode === "dark" ? "/darkLogo.png" : "/logo.png"}
    alt="Logo"
    className="w-32 object-contain cursor-pointer"
    onClick={() => navigate("/")}
  />
</div>

    
      {/* Right: Notification, Theme Toggle & Profile */}
      <div className="flex items-center gap-4 relative">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title={
            themeMode === "dark"
              ? "Switch to Light Mode"
              : themeMode === "light"
              ? "Switch to Dark Mode"
              : "Following System Theme"
          }
        >
          {themeMode === "dark" ? (
            <Sun size={20} className="text-yellow-500" />
          ) : (
            <Moon size={20} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>

{/* Profile */}
{user ? (
  <div
    className="flex items-center gap-3 cursor-pointer select-none relative"
    ref={profileRef}
    onClick={() => setShowProfile(!showProfile)}
    aria-expanded={showProfile}
    aria-haspopup="true"
  >
    <img
      src={user.avatar || "/user.png"}
      alt="User Avatar"
      className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-700"
    />

    <span className="hidden md:block font-medium text-gray-700 dark:text-gray-200">
      {user.name || user.email || "User"}
    </span>

    {showProfile && (
      <div className="absolute right-0 mt-32 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-300 dark:border-gray-700 p-4 text-gray-900 dark:text-gray-100 z-50">
        <div className="flex flex-col items-center mb-3">
          <img
            src={user.avatar || "/user.png"}
            alt="User Avatar"
            className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-700 mb-2"
          />
          <h3 className="text-lg font-semibold">{user.name || "User"}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
            {user.email || "No email"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-2 py-1.5 text-sm rounded-md bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                     transition-all duration-200 text-white font-medium flex items-center justify-center gap-1 shadow-sm hover:shadow-md"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    )}
  </div>
) : (
  <span className="text-sm text-gray-500 dark:text-gray-400">
    Not logged in
  </span>
)}

      </div>
    </nav>
  );
}
