import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageCircle,
  Settings,
  User
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const sidebarBtn = {
  display: "flex", alignItems: "center", gap: "12px",
  padding: "12px 16px", width: "100%", border: "none",
  borderRadius: "10px", background: "transparent",
  color: "#4b5563", fontSize: "14px", fontWeight: "500",
  cursor: "pointer", transition: "all 0.2s ease", textAlign: "left",
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const isActive = (path) => location.pathname === path;

  const activeStyle = {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    borderLeft: "3px solid #2563eb",
    paddingLeft: "13px",
  };

  const btn = (path) => ({ ...sidebarBtn, ...(isActive(path) ? activeStyle : {}) });

  const hover = (e) => {
    if (!isActive(e.currentTarget.dataset.path)) {
      e.currentTarget.style.backgroundColor = "#f3f4f6";
      e.currentTarget.style.color = "#2563eb";
    }
  };
  const unhover = (e) => {
    if (!isActive(e.currentTarget.dataset.path)) {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.color = "#4b5563";
    }
  };

  return (
    <div style={{
      width: "260px", background: "white", borderRight: "1px solid #e5e7eb",
      display: "flex", flexDirection: "column", height: "100vh",
      position: "fixed", left: 0, top: 0, zIndex: 100,
      boxShadow: "2px 0 8px -2px rgba(0,0,0,0.05)",
    }}>
      {/* Header */}
      <div style={{ padding: "24px 20px", borderBottom: "1px solid #e5e7eb", marginBottom: "8px" }}>
        <h3 style={{
          fontSize: "16px", fontWeight: "600", color: "#1f2937",
          margin: 0, display: "flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: "14px", fontWeight: "600",
          }}>
            V
          </div>
          {user.name || "Volunteer"}
        </h3>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "0 20px 16px" }} />

      <div style={{
        flex: 1, padding: "0 16px", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: "4px",
      }}>
        <button data-path="/volunteer-dashboard" style={btn("/volunteer-dashboard")}
          onClick={() => navigate("/volunteer-dashboard")}
          onMouseEnter={hover} onMouseLeave={unhover}>
          <LayoutDashboard size={18} /> Dashboard
        </button>

        <button data-path="/opportunities" style={btn("/opportunities")}
          onClick={() => navigate("/opportunities")}
          onMouseEnter={hover} onMouseLeave={unhover}>
          <Briefcase size={18} /> Opportunities
        </button>

        <button data-path="/my-applications" style={btn("/my-applications")}
          onClick={() => navigate("/my-applications")}
          onMouseEnter={hover} onMouseLeave={unhover}>
          <FileText size={18} /> My Applications
        </button>

        <button data-path="/volunteer-profile" style={btn("/volunteer-profile")}
          onClick={() => navigate("/volunteer-profile")}
          onMouseEnter={hover} onMouseLeave={unhover}>
          <User size={18} /> Profile
        </button>

        {/* ✅ Correct route for volunteer messages */}
        <button data-path="/messages" style={btn("/messages")}
          onClick={() => navigate("/messages")}
          onMouseEnter={hover} onMouseLeave={unhover}>
          <MessageCircle size={18} /> Messages
        </button>

        <button data-path="/settings" style={btn("/settings")}
          onClick={() => navigate("/settings")}
          onMouseEnter={hover} onMouseLeave={unhover}>
          <Settings size={18} /> Settings
        </button>
      </div>

      {/* User info at bottom */}
      <div style={{
        padding: "20px 16px", borderTop: "1px solid #e5e7eb",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          border: "1px solid #bfdbfe",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#2563eb", fontSize: "14px", fontWeight: "600",
        }}>
          {user.name?.charAt(0)?.toUpperCase() || "V"}
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{
            fontSize: "13px", fontWeight: "600", color: "#1f2937",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {user.name || "Volunteer"}
          </div>
          <div style={{ fontSize: "11px", color: "#6b7280", display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            Volunteer
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
