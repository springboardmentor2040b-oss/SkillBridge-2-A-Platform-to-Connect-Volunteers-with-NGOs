import React from "react";

const avatarColor = (name = "") => {
  const palette = ["#2563eb", "#7c3aed", "#0891b2", "#059669", "#d97706", "#dc2626", "#db2777"];
  return palette[name.charCodeAt(0) % palette.length];
};

const ChatHeader = ({ user, isTyping }) => {
  if (!user?.name) {
    return (
      <div style={{
        display: "flex", alignItems: "center", padding: "16px 24px",
        background: "white", borderBottom: "1px solid #e5e7eb", minHeight: "72px",
      }}>
        <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>Select a conversation to start messaging</p>
      </div>
    );
  }

  const color = avatarColor(user.name);
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 24px", background: "white",
      borderBottom: "1px solid #e5e7eb", minHeight: "72px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Avatar */}
        <div style={{
          width: "44px", height: "44px", borderRadius: "14px",
          background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
          color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px", fontWeight: "700", flexShrink: 0,
          boxShadow: `0 8px 16px -8px ${color}88`,
        }}>
          {initial}
        </div>

        <div>
          <p style={{ fontSize: "15px", fontWeight: "700", color: "#1f2937", margin: "0 0 3px" }}>
            {user.name}
          </p>
          {isTyping ? (
            <p style={{ fontSize: "12px", color: "#2563eb", margin: 0, fontStyle: "italic" }}>
              typing...
            </p>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{
                width: "7px", height: "7px", borderRadius: "50%",
                background: "#10b981", boxShadow: "0 0 6px rgba(16,185,129,0.6)",
              }} />
              <p style={{ fontSize: "12px", color: "#10b981", margin: 0, fontWeight: "500" }}>Online</p>
            </div>
          )}
        </div>
      </div>

      {/* Role badge — same style as Navbar role badge */}
      {user.role && (
        <span style={{
          padding: "5px 14px",
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          borderRadius: "30px", fontSize: "12px", fontWeight: "700",
          color: "#2563eb", border: "1px solid #bfdbfe",
          boxShadow: "0 4px 10px -4px rgba(37,99,235,0.2)",
        }}>
          {user.role === "ngo" ? "NGO" : "Volunteer"}
        </span>
      )}
    </div>
  );
};

export default ChatHeader;
