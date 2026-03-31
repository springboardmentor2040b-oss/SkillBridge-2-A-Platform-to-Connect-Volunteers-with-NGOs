import React from "react";

// Avatar color based on name - same blue gradient used across site
const avatarColor = (name = "") => {
  const palette = ["#2563eb", "#7c3aed", "#0891b2", "#059669", "#d97706", "#dc2626", "#db2777"];
  return palette[name.charCodeAt(0) % palette.length];
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "now";
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d`;
    return new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric" });
  } catch { return ""; }
};

const ConversationList = ({ conversations, onSelect, selectedId, loading }) => {
  return (
    <div style={{
      width: "300px",
      minWidth: "300px",
      background: "white",
      borderRight: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f3f4f6" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1f2937", margin: "0 0 4px" }}>
          Conversations
        </h3>
        <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
          {loading ? "Loading..." : `${conversations.length} contact${conversations.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          /* Skeleton loaders matching site card style */
          [1, 2, 3].map((i) => (
            <div key={i} style={{ padding: "14px 20px", borderBottom: "1px solid #f9fafb", display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#f3f4f6", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: "13px", background: "#f3f4f6", borderRadius: "6px", marginBottom: "8px", width: "60%" }} />
                <div style={{ height: "11px", background: "#f9fafb", borderRadius: "6px", width: "80%" }} />
              </div>
            </div>
          ))
        ) : conversations.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              border: "1px solid #bfdbfe",
              margin: "0 auto 16px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#374151", margin: "0 0 6px" }}>No conversations yet</p>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, lineHeight: "1.6" }}>
              Conversations appear after an application is made
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = String(selectedId) === String(conv._id);
            const color = avatarColor(conv.name);
            const initial = (conv.name || "?").charAt(0).toUpperCase();

            return (
              <div
                key={conv._id}
                onClick={() => onSelect(conv)}
                style={{
                  padding: "12px 20px",
                  cursor: "pointer",
                  background: isSelected ? "#eff6ff" : "transparent",
                  borderLeft: `3px solid ${isSelected ? "#2563eb" : "transparent"}`,
                  borderBottom: "1px solid #f9fafb",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f9fafb"; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
              >
                {/* Avatar */}
                <div style={{
                  width: "42px", height: "42px", borderRadius: "12px",
                  background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px", fontWeight: "700", flexShrink: 0,
                  boxShadow: `0 4px 10px -4px ${color}88`,
                }}>
                  {initial}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                    <p style={{
                      fontSize: "13px", fontWeight: conv.unreadCount > 0 ? "700" : "600",
                      color: "#1f2937", margin: 0, overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {conv.name}
                    </p>
                    {conv.lastMessageAt && (
                      <span style={{ fontSize: "11px", color: "#9ca3af", flexShrink: 0, marginLeft: "6px" }}>
                        {timeAgo(conv.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{
                      fontSize: "12px",
                      color: conv.unreadCount > 0 ? "#4b5563" : "#9ca3af",
                      fontWeight: conv.unreadCount > 0 ? "500" : "400",
                      margin: 0, overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap", flex: 1,
                    }}>
                      {conv.lastMessage || "Start a conversation"}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span style={{
                        minWidth: "18px", height: "18px", padding: "0 5px",
                        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                        color: "#fff", borderRadius: "9px",
                        fontSize: "10px", fontWeight: "700",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginLeft: "6px",
                        boxShadow: "0 2px 6px rgba(37,99,235,0.4)",
                      }}>
                        {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
