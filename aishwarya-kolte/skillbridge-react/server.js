const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

console.log("opportunityRoutes:", typeof opportunityRoutes);
console.log("applicationRoutes:", typeof applicationRoutes);
console.log("userRoutes:", typeof userRoutes);
console.log("notificationRoutes:", typeof notificationRoutes);
console.log("messageRoutes:", typeof messageRoutes);

app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/skillbridge")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.listen(5000, () => {
console.log("Server running on port 5000");
});