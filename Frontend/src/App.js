import React from "react";
import {
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import CreateOpportunity from "./components/CreateOpportunity";
import ViewOpportunities from "./components/ViewOpportunities";
import Applications from "./components/Applications";
import Messages from "./components/Messages";

function App() {

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

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
          path="/applications"
          element={<Applications />}
        />

        <Route path="/messages" element={<Messages />} />

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