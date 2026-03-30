const express = require("express");
const router = express.Router();
const User = require("../models/User");

// TEST ROUTE
router.get("/", (req, res) => {
  res.json({ message: "User route working" });
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    res.json({ message: "User registered successfully", user });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;