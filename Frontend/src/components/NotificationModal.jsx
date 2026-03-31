import React from "react";

const typeIcon = (type) => {
  switch (type) {
    case "message": return { icon: "💬", bg: "#eff6ff", color: "#2563eb" };
    case "application": return { icon: "📋", bg: "#f0fdf4", color: "#059669" };
    case "opportunity": return { icon: "🔔", bg: "#fefce8", color: "#d97706" };
    default: return { icon: "ℹ️", bg: "#f9fafb", color: "#6b7280" };
  }
};

const NotificationModal = ({ isOpen, onClose, notifications, onDeleteNotification, onClearAll }) => {
  if (!isOpen) return null;
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1999 }} />

      <div style={{
        position: "fixed", top: "70px", right: "20px",
        width: "380px", maxHeight: "520px",
        background: "white", borderRadius: "20px",
        boxShadow: "0 20px 40px -12px rgba(0,0,0,0.2)",
        border: "1px solid #e5e7eb", zIndex: 2000,
        overflow: "hidden", display: "flex", flexDirection: "column",
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" strokeLinecap="round" />
              <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
            </svg>
            <span style={{ fontWeight: "700", fontSize: "15px", color: "white" }}>Notifications</span>
            {unread > 0 && (
              <span style={{
                padding: "2px 8px", borderRadius: "10px",
                background: "rgba(255,255,255,0.25)", color: "white",
                fontSize: "11px", fontWeight: "700",
              }}>
                {unread} new
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {notifications.length > 0 && onClearAll && (
              <button onClick={onClearAll} style={{
                background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px", color: "white", fontSize: "11px", fontWeight: "600",
                padding: "4px 10px", cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              >
                Clear all
              </button>
            )}
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.15)", border: "none",
              width: "28px", height: "28px", borderRadius: "8px",
              color: "white", fontSize: "16px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            >
              ✕
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {notifications.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "16px",
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                border: "1px solid #bfdbfe", margin: "0 auto 14px",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px",
              }}>🔔</div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#374151", margin: "0 0 6px" }}>
                All caught up!
              </p>
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => {
              const { icon, bg, color } = typeIcon(n.type);
              return (
                <div key={n.id} style={{
                  padding: "12px 16px", borderBottom: "1px solid #f9fafb",
                  display: "flex", gap: "12px", alignItems: "flex-start",
                  background: n.read ? "transparent" : "#eff6ff",
                  transition: "background 0.15s ease",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = n.read ? "#f9fafb" : "#dbeafe"}
                  onMouseLeave={(e) => e.currentTarget.style.background = n.read ? "transparent" : "#eff6ff"}
                >
                  {/* Type icon */}
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "10px",
                    background: bg, border: `1px solid ${color}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "15px", flexShrink: 0,
                  }}>
                    {icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: "13px", color: "#1f2937",
                      fontWeight: n.read ? "400" : "600",
                      margin: "0 0 3px", lineHeight: "1.4",
                    }}>
                      {n.text}
                    </p>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>{n.time}</p>
                  </div>

                  {/* Unread dot */}
                  {!n.read && (
                    <div style={{
                      width: "8px", height: "8px", borderRadius: "50%",
                      background: "#2563eb", flexShrink: 0, marginTop: "4px",
                      boxShadow: "0 0 6px rgba(37,99,235,0.5)",
                    }} />
                  )}

                  {/* Delete */}
                  {onDeleteNotification && (
                    <button onClick={() => onDeleteNotification(n.id)} style={{
                      background: "none", border: "none", color: "#d1d5db",
                      fontSize: "14px", cursor: "pointer", padding: "0",
                      flexShrink: 0, transition: "color 0.15s",
                      display: "flex", alignItems: "center",
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#d1d5db"}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationModal;
