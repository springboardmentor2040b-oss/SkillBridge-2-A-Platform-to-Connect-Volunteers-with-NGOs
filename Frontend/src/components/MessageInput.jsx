import React from "react";

const MessageInput = ({ message, setMessage, sendMessage, socketConnected = true, onTyping, onStopTyping }) => {
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey && socketConnected) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      padding: "14px 20px",
      background: "white",
      borderTop: "1px solid #e5e7eb",
    }}>
      {/* Connecting banner */}
      {!socketConnected && (
        <div style={{
          marginBottom: "10px", padding: "8px 14px",
          background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
          border: "1px solid #fbbf24", borderRadius: "10px",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "12px", fontWeight: "500", color: "#92400e" }}>
            Connecting to chat server...
          </span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
        <input
          type="text"
          placeholder={socketConnected ? "Type a message… (Enter to send)" : "Connecting..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKey}
          disabled={!socketConnected}
          style={{
            flex: 1,
            padding: "11px 16px",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            fontSize: "14px",
            color: "#1f2937",
            background: socketConnected ? "white" : "#f9fafb",
            outline: "none",
            transition: "all 0.2s ease",
            cursor: socketConnected ? "text" : "not-allowed",
            opacity: socketConnected ? 1 : 0.6,
            resize: "none",
          }}
          onFocus={(e) => {
            if (socketConnected) {
              e.target.style.borderColor = "#2563eb";
              e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
            }
            if (onTyping) onTyping();
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e5e7eb";
            e.target.style.boxShadow = "none";
            if (onStopTyping) onStopTyping();
          }}
        />

        {/* Send button — same gradient blue as site CTA buttons */}
        <button
          onClick={sendMessage}
          disabled={!socketConnected || !message.trim()}
          style={{
            width: "44px", height: "44px", borderRadius: "14px",
            background: socketConnected && message.trim()
              ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
              : "#e5e7eb",
            border: "none", cursor: socketConnected && message.trim() ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.2s ease",
            boxShadow: socketConnected && message.trim()
              ? "0 8px 16px -8px rgba(37,99,235,0.5)"
              : "none",
          }}
          onMouseEnter={(e) => {
            if (socketConnected && message.trim()) {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 12px 20px -8px rgba(37,99,235,0.6)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = socketConnected && message.trim()
              ? "0 8px 16px -8px rgba(37,99,235,0.5)" : "none";
          }}
          title={socketConnected ? "Send message (Enter)" : "Connecting..."}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke={socketConnected && message.trim() ? "white" : "#9ca3af"}
            strokeWidth="2.2">
            <line x1="22" y1="2" x2="11" y2="13" strokeLinecap="round" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
