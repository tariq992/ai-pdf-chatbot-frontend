import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-200">
      {/* Sidebar */}

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1">
        {/* Fixed Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onLogout={handleLogout}
          />
        </div>

        {/* Scrollable main section */}
        <main
          className={`flex-1 pt-[35px] overflow-y-auto p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-200`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
