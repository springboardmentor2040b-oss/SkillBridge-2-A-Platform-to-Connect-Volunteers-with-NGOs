import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import NGODashboard from "./pages/NGODashboard";
import NGOTeam from "./pages/NGOTeam";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import CreateOpportunity from "./pages/CreateOpportunity";
import EditOpportunity from "./pages/EditOpportunity";
import ProfileEdit from "./pages/ProfileEdit";
import BrowseOpportunities from "./pages/BrowseOpportunities";
import MessagesPage from "./pages/MessagesPage";
import VolunteersPage from "./pages/VolunteersPage";
import NGORecentApplications from "./pages/NGORecentApplications";
import NGOOpportunitiesPage from "./pages/NGOOpportunitiesPage";
import NotificationsPage from "./pages/NotificationsPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected NGO Routes */}
          <Route
            path="/ngo-dashboard"
            element={
              <ProtectedRoute requireNGO>
                <NGODashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo-team"
            element={
              <ProtectedRoute requireNGO>
                <NGOTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-opportunity"
            element={
              <ProtectedRoute requireNGO>
                <CreateOpportunity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/volunteers"
            element={
              <ProtectedRoute requireNGO>
                <VolunteersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo-recent-applications"
            element={
              <ProtectedRoute requireNGO>
                <NGORecentApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo-opportunities"
            element={
              <ProtectedRoute requireNGO>
                <NGOOpportunitiesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-opportunity/:id"
            element={
              <ProtectedRoute requireNGO>
                <EditOpportunity />
              </ProtectedRoute>
            }
          />

          {/* Protected Volunteer Routes */}
          <Route
            path="/volunteer-dashboard"
            element={
              <ProtectedRoute role="volunteer">
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/opportunities"
            element={
              <ProtectedRoute role="volunteer">
                <BrowseOpportunities />
              </ProtectedRoute>
            }
          />

          {/* Common Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
