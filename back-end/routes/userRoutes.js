const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const { addMember, getMembers } = require("../controllers/ngoController");
const { getOrganization } = require("../controllers/ngoController");
// 🔥 ADD MEMBERS
router.post("/ngo/add-member", protect, addMember);
router.get("/ngo/organization", protect, getOrganization);

// 🔥 GET MEMBERS
router.get("/ngo/members", protect, getMembers);
/* GET CURRENT USER */
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

/* UPDATE PROFILE (WORKS FOR BOTH ROLES) */
router.put("/profile", protect, async (req, res) => {
  try {
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;