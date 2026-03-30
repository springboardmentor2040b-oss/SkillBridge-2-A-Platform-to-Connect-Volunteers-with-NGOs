 const express = require("express");
const router = express.Router();
const Application = require("../models/Application");


// Volunteer Apply
router.post("/apply", async (req, res) => {

  try {

    const application = new Application(req.body);

    await application.save();

    res.json(application);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});


// Get Applications by Opportunity (NGO side)
router.get("/opportunity/:id", async (req, res) => {

  try {

    const applications = await Application.find({
      opportunityId: req.params.id
    });

    res.json(applications);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

});


// Update Application Status (Accept / Reject)
router.put("/update-status/:id", async (req, res) => {

  try {

    const { status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

});
module.exports = router;