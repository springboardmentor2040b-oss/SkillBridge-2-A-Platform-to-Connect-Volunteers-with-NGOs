const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

/* Send message */

router.post("/send", async (req, res) => {

  try {

    const { senderId, receiverId, senderRole, message } = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      senderRole,
      message
    });

    await newMessage.save();

    res.json(newMessage);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }

});


/* Get chat between two users */

router.get("/:user1/:user2", async (req, res) => {

  try {

    const messages = await Message.find({
      $or: [
        { senderId: req.params.user1, receiverId: req.params.user2 },
        { senderId: req.params.user2, receiverId: req.params.user1 }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;