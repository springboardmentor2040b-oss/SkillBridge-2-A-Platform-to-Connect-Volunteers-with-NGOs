 import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import NotificationPanel from './NotificationPanel';
import axios from "axios";

const Navbar = () => {

  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userRole = user ? user.role.toLowerCase() : null;

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch real notifications
  useEffect(() => {

    if (!user || !user._id) return;

    axios
      .get(`http://localhost:5000/api/notifications/${user._id}`)
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => console.log(err));

  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  if (!user) {
    return (
      <nav className="bg-white shadow-md px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">SkillBridge</h1>

        <div className="space-x-3">

          <Link to="/login">
            <button className="px-4 py-1 border border-blue-600 text-blue-600 rounded-md">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="px-4 py-1 bg-blue-600 text-white rounded-md">
              Register
            </button>
          </Link>

        </div>
      </nav>
    );
  }

  return (

    <nav className="bg-white shadow-md px-4 py-4 flex justify-between items-center relative">

      {/* Logo */}

      <div className="text-2xl font-bold text-blue-600">
        <Link to="/dashboard">SkillBridge</Link>
      </div>

      {/* Navigation */}

      <div className="hidden md:flex space-x-8 font-medium text-gray-700">

        <Link to="/dashboard">Dashboard</Link>

        <Link to="/opportunities">Opportunities</Link>

        <Link to="/applications">Applications</Link>

        <Link to="/messages">Messages</Link>

      </div>

      {/* Right Section */}

      <div className="flex items-center space-x-4">

        {/* Notification Bell */}

        <button
          onClick={toggleNotifications}
          className="relative text-gray-600 hover:text-blue-600"
        >
          <FaBell size={20} />

          {notifications.filter(n => !n.read).length > 0 && (

            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">

              {notifications.filter(n => !n.read).length}

            </span>

          )}

        </button>

        {/* Role Badge */}

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium
          ${
            userRole === "ngo"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {userRole === "ngo" ? "NGO" : "Volunteer"}
        </span>

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="px-4 py-1 border border-red-600 text-red-600 rounded-md"
        >
          Logout
        </button>

      </div>

      {/* Notification Panel */}

      {showNotifications && (

        <NotificationPanel
          notifications={notifications}
          setNotifications={setNotifications}
          onClose={() => setShowNotifications(false)}
        />

      )}

    </nav>

  );
};

export default Navbar;
