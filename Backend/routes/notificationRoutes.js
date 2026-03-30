const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");


// Get notifications for a user

router.get("/:userId", async (req, res) => {

  try {

    const notifications = await Notification.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});


// Mark notification as read

router.put("/read/:id", async (req, res) => {

  try {

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.json(notification);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

module.exports = router;
