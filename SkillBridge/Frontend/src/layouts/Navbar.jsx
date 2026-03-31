import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NotificationModal from "../components/NotificationModal";
import {
  getNotifications,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
  markNotificationAsRead,
} from "../utils/notificationUtils";

const SkillBridgeLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="20" cy="20" r="6" stroke="white" strokeWidth="2" fill="none" />
    <path d="M20 8V12M20 28V32M32 20H28M12 20H8M28.5 11.5L25.5 14.5M14.5 25.5L11.5 28.5M28.5 28.5L25.5 25.5M14.5 14.5L11.5 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  /* Refresh notifications from localStorage */
  const refreshNotifications = () => {
    const list = getNotifications();
    setNotifications(list);
    setUnreadCount(getUnreadCount());
  };

  useEffect(() => {
    refreshNotifications();
    /* Poll every 5s so new socket-generated notifications appear in real time */
    const interval = setInterval(refreshNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  /* When modal opens: mark all as read + refresh */
  useEffect(() => {
    if (showNotifications) {
      // Mark every unread notification as read
      const list = getNotifications();
      list.forEach((n) => { if (!n.read) markNotificationAsRead(n.id); });
      refreshNotifications();
    }
  }, [showNotifications]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("notifications");
    navigate("/login");
  };

  const handleDeleteNotification = (id) => {
    deleteNotification(id);
    refreshNotifications();
  };

  const handleClearAll = () => {
    clearAllNotifications();
    refreshNotifications();
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(229,231,235,0.5)",
      padding: "14px 28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 4px 20px -8px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>

      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex", alignItems: "center", gap: "12px",
          fontSize: "20px", fontWeight: "800", color: "#1f2937",
          cursor: "pointer", transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        <div style={{
          width: "40px", height: "40px", borderRadius: "12px",
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 16px -8px rgba(37,99,235,0.4)",
          transition: "all 0.3s ease",
        }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "rotate(5deg) scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "rotate(0deg) scale(1)"}
        >
          <SkillBridgeLogo size={24} />
        </div>
        <span style={{
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          SkillBridge
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

        {/* Role Badge */}
        <span style={{
          padding: "6px 16px",
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          borderRadius: "30px", fontSize: "13px", fontWeight: "700",
          color: "#2563eb", display: "flex", alignItems: "center", gap: "8px",
          border: "1px solid #bfdbfe",
          boxShadow: "0 4px 10px -4px rgba(37,99,235,0.2)",
          transition: "all 0.2s ease",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 6px 14px -4px rgba(37,99,235,0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 10px -4px rgba(37,99,235,0.2)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#2563eb">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          {user.role === "ngo" ? "NGO Account" : "Volunteer Account"}
        </span>

        {/* 🔔 Notification Bell */}
        <div
          onClick={() => setShowNotifications((v) => !v)}
          style={{
            position: "relative", cursor: "pointer",
            padding: "8px", borderRadius: "10px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2.2">
            <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>

          {/* Live unread badge */}
          {unreadCount > 0 && (
            <span style={{
              position: "absolute", top: "4px", right: "4px",
              minWidth: "16px", height: "16px", padding: "0 4px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "white", fontSize: "9px", fontWeight: "700",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 6px rgba(239,68,68,0.5)",
              border: "2px solid white",
            }}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>

        {/* Avatar */}
        {user.name && (
          <div style={{
            width: "38px", height: "38px", borderRadius: "12px",
            background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", fontWeight: "700", color: "#2563eb",
            border: "2px solid #e5e7eb", transition: "all 0.2s ease", cursor: "default",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            background: "transparent", border: "2px solid #e5e7eb",
            borderRadius: "30px", color: "#4b5563",
            fontSize: "14px", fontWeight: "600", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px",
            transition: "all 0.2s ease", boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f3f4f6";
            e.currentTarget.style.borderColor = "#2563eb";
            e.currentTarget.style.color = "#2563eb";
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 8px 16px -6px rgba(37,99,235,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "#e5e7eb";
            e.currentTarget.style.color = "#4b5563";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" />
          </svg>
          Logout
        </button>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onDeleteNotification={handleDeleteNotification}
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default Navbar;
