const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// ✅ routes
app.use("/api/users", userRoutes);
app.use("/api/opportunities", opportunityRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});