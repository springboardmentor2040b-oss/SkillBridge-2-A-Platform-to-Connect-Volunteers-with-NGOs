import React from "react";

const MessageBubble = ({ message, currentUserId }) => {
  const senderId = message?.senderId || message?.sender?._id || message?.sender || "";
  const isMine = String(senderId) === String(currentUserId);
  const isPending = String(message.id || "").startsWith("tmp-");

  return (
    <div style={{
      display: "flex",
      justifyContent: isMine ? "flex-end" : "flex-start",
      marginBottom: "2px",
    }}>
      <div style={{
        maxWidth: "68%",
        padding: "10px 14px",
        borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        background: isMine
          ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
          : "white",
        color: isMine ? "#fff" : "#1f2937",
        boxShadow: isMine
          ? "0 4px 12px -4px rgba(37,99,235,0.45)"
          : "0 2px 8px -2px rgba(0,0,0,0.10)",
        border: isMine ? "none" : "1px solid #e5e7eb",
        opacity: isPending ? 0.65 : 1,
        transition: "opacity 0.2s ease",
      }}>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", wordBreak: "break-word" }}>
          {message.text}
        </p>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          gap: "4px", marginTop: "4px",
        }}>
          <span style={{
            fontSize: "10px",
            opacity: isMine ? 0.75 : 1,
            color: isMine ? "#fff" : "#9ca3af",
          }}>
            {message.time}
          </span>
          {isMine && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isPending ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)"} strokeWidth="2.5">
              {isPending
                ? <circle cx="12" cy="12" r="4" />
                : <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              }
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
