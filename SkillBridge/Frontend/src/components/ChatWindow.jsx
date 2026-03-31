import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const formatDateLabel = (dateStr) => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
  } catch { return null; }
};

const ChatWindow = ({ messages, currentUserId }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages with date separators
  const renderWithDates = () => {
    const rendered = [];
    let lastDate = null;

    messages.forEach((msg, idx) => {
      const raw = msg.time || "";
      // Try to extract date string for grouping
      let dateLabel = null;
      try {
        // message.time is a locale string — extract just the date part
        const d = new Date(raw);
        if (!isNaN(d.getTime())) {
          const label = formatDateLabel(d.toISOString());
          if (label !== lastDate) {
            lastDate = label;
            dateLabel = label;
          }
        }
      } catch { }

      if (dateLabel) {
        rendered.push(
          <div key={`date-${idx}`} style={{
            display: "flex", alignItems: "center", gap: "12px",
            margin: "16px 0 10px",
          }}>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            <span style={{
              fontSize: "11px", fontWeight: "600", color: "#9ca3af",
              padding: "3px 10px", background: "#f3f4f6", borderRadius: "10px",
              border: "1px solid #e5e7eb", whiteSpace: "nowrap",
            }}>
              {dateLabel}
            </span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          </div>
        );
      }

      rendered.push(
        <MessageBubble key={msg.id} message={msg} currentUserId={currentUserId} />
      );
    });

    return rendered;
  };

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: "20px 24px",
      background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
      display: "flex", flexDirection: "column", gap: "6px",
    }}>
      {messages.length === 0 ? (
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "40px 20px",
        }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "20px",
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            border: "1px solid #bfdbfe",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "16px",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p style={{ fontSize: "15px", fontWeight: "600", color: "#374151", margin: "0 0 6px" }}>
            No messages yet
          </p>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
            Send a message to start the conversation
          </p>
        </div>
      ) : (
        renderWithDates()
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
