import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../layouts/Navbar";
import NGOSidebar from "../../layouts/NGOSidebar";
import ConversationList from "../../components/ConversationList";
import ChatHeader from "../../components/ChatHeader";
import ChatWindow from "../../components/ChatWindow";
import MessageInput from "../../components/MessageInput";
import api from "../../utils/api";
import {
  initSocket,
  sendMessage as socketSend,
  onNewMessage, onMessageSent, onUnreadUpdate,
  offNewMessage, offMessageSent, offUnreadUpdate,
  markMessagesAsRead, getCurrentSocketUserId, disconnectSocket,
  onUserTyping, onUserStopTyping, offUserTyping, offUserStopTyping,
  sendTyping, sendStopTyping,
} from "../../utils/socket";
import { addNotification } from "../../utils/notificationUtils";

const Messages = () => {
  const [me] = useState(() => JSON.parse(localStorage.getItem("user")) || {});
  const [searchParams] = useSearchParams();
  const preselectId = searchParams.get("user");

  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // refs — never stale, never cause re-renders
  const selectedUserRef = useRef(null);
  const meRef = useRef(me);
  const typingTimeoutRef = useRef(null);
  const autoSelectedRef = useRef(false);

  const mapMsg = (m) => ({
    id: m._id || m.id,
    senderId: m.sender,
    text: m.text,
    time: m.createdAt ? new Date(m.createdAt).toLocaleString() : "",
  });

  // stable — empty deps
  const loadContacts = useCallback(async () => {
    try {
      const res = await api.get("/chat/contacts");
      setConversations(res.data || []);
      return res.data || [];
    } catch {
      return [];
    }
  }, []);

  // stable — empty deps, uses refs
  const loadThread = useCallback(async (userId) => {
    if (!userId || !meRef.current._id) return;
    setLoadingThread(true);
    try {
      const res = await api.get(`/chat/thread/${userId}`);
      const otherUser = res.data.otherUser;
      setSelectedUser(otherUser);
      selectedUserRef.current = otherUser;
      setMessages((res.data.messages || []).map(mapMsg));
      markMessagesAsRead(meRef.current._id, userId);
      api.put(`/chat/thread/${userId}/read`).catch(() => {});
      setConversations((prev) =>
        prev.map((c) =>
          String(c._id) === String(userId) ? { ...c, unreadCount: 0 } : c
        )
      );
    } catch (e) {
      console.error("loadThread error:", e);
    } finally {
      setLoadingThread(false);
    }
  }, []); // empty — truly stable

  // Init socket once
  useEffect(() => {
    if (!me._id) return;
    if (getCurrentSocketUserId() !== me._id) disconnectSocket();
    initSocket(me._id)
      .then(() => setSocketConnected(true))
      .catch(() => setSocketConnected(false));
  }, [me._id]);

  // Load contacts once on mount
  useEffect(() => {
    setLoadingContacts(true);
    loadContacts().finally(() => setLoadingContacts(false));
  }, [loadContacts]);

  // Auto-select first conversation — fires exactly ONCE via ref guard
  useEffect(() => {
    if (loadingContacts) return;
    if (autoSelectedRef.current) return;
    if (conversations.length === 0) return;
    autoSelectedRef.current = true;
    const target =
      (preselectId && conversations.find((c) => String(c._id) === preselectId))
      || conversations[0];
    if (target?._id) loadThread(target._id);
  }, [loadingContacts, conversations, preselectId, loadThread]);

  // Socket listeners — registered ONCE, use refs for fresh values
  useEffect(() => {
    const handleNewMessage = (data) => {
      const myId = meRef.current._id;
      if (!myId) return;
      if (String(data.recipientId) === String(selectedUserRef.current?._id)) {
        setMessages((prev) => [
          ...prev,
          {
            id: data._id,
            senderId: data.sender,
            text: data.text,
            time: data.createdAt ? new Date(data.createdAt).toLocaleString() : "",
          },
        ]);
        markMessagesAsRead(myId, String(data.sender));
        api.put(`/chat/thread/${data.sender}/read`).catch(() => {});
      } else {
        addNotification("New message from a volunteer", "message");
      }
      api.get("/chat/contacts").then((res) => {
        setConversations(res.data || []);
      }).catch(() => {});
    };

    const handleMessageSent = (data) => {
      setMessages((prev) =>
        prev.map((m) =>
          String(m.id).startsWith("tmp-")
            ? {
                id: data._id,
                senderId: data.sender,
                text: data.text,
                time: data.createdAt ? new Date(data.createdAt).toLocaleString() : "",
              }
            : m
        )
      );
    };

    const handleUnreadUpdate = (data) => {
      setConversations((prev) =>
        prev.map((c) =>
          String(c._id) === String(data.senderId)
            ? { ...c, unreadCount: data.unreadCount }
            : c
        )
      );
    };

    const handleTyping = ({ senderId }) => {
      if (String(senderId) === String(selectedUserRef.current?._id))
        setIsTyping(true);
    };
    const handleStopTyping = ({ senderId }) => {
      if (String(senderId) === String(selectedUserRef.current?._id))
        setIsTyping(false);
    };

    onNewMessage(handleNewMessage);
    onMessageSent(handleMessageSent);
    onUnreadUpdate(handleUnreadUpdate);
    onUserTyping(handleTyping);
    onUserStopTyping(handleStopTyping);

    return () => {
      offNewMessage();
      offMessageSent();
      offUnreadUpdate();
      offUserTyping();
      offUserStopTyping();
    };
  }, []); // empty — register once

  // Keep selectedUserRef in sync
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const sendMessage = () => {
    const text = message.trim();
    if (!text || !selectedUser?._id || !me._id || !socketConnected) return;
    setMessage("");
    const optimistic = {
      id: `tmp-${Date.now()}`,
      senderId: me._id,
      text,
      time: new Date().toLocaleString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    socketSend(me._id, selectedUser._id, text);
    setConversations((prev) =>
      prev.map((c) =>
        String(c._id) === String(selectedUser._id)
          ? { ...c, lastMessage: text, lastMessageAt: new Date().toISOString() }
          : c
      )
    );
  };

  const handleTyping = () => {
    if (!me._id || !selectedUser?._id) return;
    sendTyping(me._id, selectedUser._id);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(
      () => sendStopTyping(me._id, selectedUser._id),
      2000
    );
  };

  const handleStopTyping = () => {
    if (!me._id || !selectedUser?._id) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendStopTyping(me._id, selectedUser._id);
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
      minHeight: "100vh",
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <Navbar />
      <NGOSidebar />

      <div style={{
        marginLeft: "260px",
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        padding: "20px 24px",
        boxSizing: "border-box",
      }}>
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)",
          border: "1px solid #e5e7eb",
        }}>
          {/* Slim title bar */}
          <div style={{
            padding: "13px 24px",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            borderRadius: "20px 20px 0 0",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
          }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "10px",
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "white", margin: 0 }}>
                Messages
              </h2>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", margin: 0 }}>
                Chat with volunteers who applied to your opportunities
              </p>
            </div>
          </div>

          {/* Chat body */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            <ConversationList
              conversations={conversations}
              selectedId={selectedUser?._id}
              onSelect={(u) => {
                autoSelectedRef.current = true;
                loadThread(u._id);
              }}
              loading={loadingContacts}
            />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <ChatHeader user={selectedUser} isTyping={isTyping} />

              {loadingThread ? (
                <div style={{
                  flex: 1, display: "flex", alignItems: "center",
                  justifyContent: "center", background: "#f9fafb",
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      border: "3px solid #dbeafe", borderTopColor: "#2563eb",
                      animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
                    }} />
                    <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
                      Loading messages...
                    </p>
                  </div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : (
                <>
                  <ChatWindow messages={messages} currentUserId={me._id} />
                  <MessageInput
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                    socketConnected={socketConnected}
                    onTyping={handleTyping}
                    onStopTyping={handleStopTyping}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Messages;
