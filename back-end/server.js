const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");
const Message = require("./models/Message");

const applicationRoutes = require("./routes/applicationRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

connectDB();

/* userId -> socket.id */
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("user-join", (userId) => {
    connectedUsers.set(String(userId), socket.id);
    socket.join(String(userId));
    console.log(`User ${userId} joined`);
  });

  socket.on("send-message", async (data) => {
    try {
      const { senderId, recipientId, text } = data;
      if (!senderId || !recipientId || !text?.trim()) return;

      const msg = await Message.create({
        participants: [senderId, recipientId],
        sender: senderId,
        text: text.trim(),
      });

      const payload = { _id: msg._id, sender: msg.sender, text: msg.text, createdAt: msg.createdAt };

      io.to(String(recipientId)).emit("new-message", { ...payload, recipientId: senderId });
      socket.emit("message-sent", payload);

      const unreadCount = await Message.countDocuments({
        participants: { $all: [senderId, recipientId] },
        sender: senderId,
        readBy: { $ne: recipientId },
      });
      io.to(String(recipientId)).emit("unread-update", { senderId, unreadCount });
    } catch (err) {
      console.error("send-message error:", err);
      socket.emit("message-error", { error: err.message });
    }
  });

  socket.on("mark-as-read", async ({ userId, otherUserId }) => {
    try {
      await Message.updateMany(
        { participants: { $all: [userId, otherUserId] }, sender: otherUserId, readBy: { $ne: userId } },
        { $push: { readBy: userId } }
      );
      io.to(String(otherUserId)).emit("messages-read", { readBy: userId });
    } catch (err) {
      console.error("mark-as-read error:", err);
    }
  });

  socket.on("user-typing", ({ senderId, recipientId }) => {
    io.to(String(recipientId)).emit("user-typing", { senderId });
  });
  socket.on("user-stop-typing", ({ senderId, recipientId }) => {
    io.to(String(recipientId)).emit("user-stop-typing", { senderId });
  });

  socket.on("disconnect", () => {
    for (const [uid, sid] of connectedUsers.entries()) {
      if (sid === socket.id) { connectedUsers.delete(uid); break; }
    }
  });
});

app.use("/api/application", applicationRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/opportunity", opportunityRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

server.listen(5000, () => console.log("Server running on port 5000"));
