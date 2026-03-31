const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Application = require("../models/Application");
const Message = require("../models/Message");
const User = require("../models/User");

const uniqById = (arr) => {
  const map = new Map();
  for (const u of arr) { if (u?._id) map.set(String(u._id), u); }
  return Array.from(map.values());
};

/* GET CONTACTS */
router.get("/contacts", protect, async (req, res) => {
  try {
    const me = req.user;
    let raw = [];

    if (me.role === "volunteer") {
      const apps = await Application.find({ volunteer: me._id })
        .populate({ path: "opportunity", select: "ngo", populate: { path: "ngo", select: "name organizationName role" } })
        .lean();
      raw = uniqById(apps.map((a) => a.opportunity?.ngo).filter(Boolean));
    } else if (me.role === "ngo") {
      const apps = await Application.find()
        .populate({ path: "opportunity", select: "ngo", match: { ngo: me._id } })
        .populate({ path: "volunteer", select: "name role" })
        .lean();
      raw = uniqById(apps.filter((a) => a.opportunity).map((a) => a.volunteer).filter(Boolean));
    }

    const contacts = await Promise.all(
      raw.map(async (u) => {
        const last = await Message.findOne({ participants: { $all: [me._id, u._id] } })
          .sort({ createdAt: -1 }).lean();
        const unreadCount = await Message.countDocuments({
          participants: { $all: [me._id, u._id] },
          sender: u._id,
          readBy: { $ne: me._id },
        });
        return {
          _id: u._id,
          name: u.organizationName || u.name || "User",
          role: u.role,
          lastMessage: last?.text || "",
          lastMessageAt: last?.createdAt || null,
          unreadCount,
        };
      })
    );

    contacts.sort((a, b) => {
      const tA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const tB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return tB - tA;
    });

    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET THREAD */
router.get("/thread/:otherUserId", protect, async (req, res) => {
  try {
    const other = await User.findById(req.params.otherUserId)
      .select("name organizationName role").lean();
    if (!other) return res.status(404).json({ message: "User not found" });

    const msgs = await Message.find({ participants: { $all: [req.user._id, other._id] } })
      .sort({ createdAt: 1 }).lean();

    res.json({
      otherUser: { _id: other._id, name: other.organizationName || other.name || "User", role: other.role },
      messages: msgs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* MARK AS READ */
router.put("/thread/:otherUserId/read", protect, async (req, res) => {
  try {
    const result = await Message.updateMany(
      { participants: { $all: [req.user._id, req.params.otherUserId] }, sender: req.params.otherUserId, readBy: { $ne: req.user._id } },
      { $push: { readBy: req.user._id } }
    );
    res.json({ updated: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* TOTAL UNREAD COUNT */
router.get("/unread/count", protect, async (req, res) => {
  try {
    const total = await Message.countDocuments({
      participants: req.user._id,
      sender: { $ne: req.user._id },
      readBy: { $ne: req.user._id },
    });
    res.json({ unreadMessages: total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
