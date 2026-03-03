import React from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import CreateOpportunity from "./components/CreateOpportunity";
import ViewOpportunities from "./components/ViewOpportunities";

function App() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600">
          Skill Bridge
        </h1>

        {/* Center Menu */}
        <div className="space-x-8 font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>

          <Link to="/opportunities" className="hover:text-blue-600">
            Opportunities
          </Link>

          <Link to="/about" className="hover:text-blue-600">
            About
          </Link>

          <Link to="/contact" className="hover:text-blue-600">
            Contact
          </Link>
        </div>

        {/* Right Side */}
        <div className="space-x-3">

          {!user ? (
            <>
              <Link to="/login">
                <button className="px-4 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition">
                  Login
                </button>
              </Link>

              <Link to="/register">
                <button className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  Register
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard">
                <button className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                  Dashboard
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-1 border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>

      {/* ROUTES */}
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <div className="flex justify-center items-center min-h-[80vh]">
              <Login />
            </div>
          }
        />

        <Route
          path="/register"
          element={
            <div className="flex justify-center items-center min-h-[80vh]">
              <Register />
            </div>
          }
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/create-opportunity"
          element={<CreateOpportunity />}
        />

        <Route
          path="/view-opportunities"
          element={<ViewOpportunities />}
        />

        <Route
          path="/opportunities"
          element={<ViewOpportunities />}
        />

        <Route
          path="/about"
          element={
            <div className="text-center mt-20 text-2xl">
              About Page
            </div>
          }
        />

        <Route
          path="/contact"
          element={
            <div className="text-center mt-20 text-2xl">
              Contact Page
            </div>
          }
        />

      </Routes>

    </div>
  );
}

export default App;