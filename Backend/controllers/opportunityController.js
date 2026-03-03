const Opportunity = require("../models/Opportunity");

// ✅ CREATE OPPORTUNITY
exports.createOpportunity = async (req, res) => {
  try {
    const { title, description, required_skills, duration, location, ngo_id, expiryDays } = req.body;

    if (!title || !description || !required_skills || required_skills.length === 0) {
      return res.status(400).json({
        message: "Title, description and required skills are mandatory"
      });
    }

    if (!ngo_id) {
      return res.status(400).json({
        message: "NGO ID is required"
      });
    }

    // Set expiryDate: default 7 days if expiryDays not provided
    const expiryDate = expiryDays
      ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const newOpportunity = await Opportunity.create({
      title,
      description,
      required_skills,
      duration,
      location,
      ngo_id,
      expiryDate
    });

    res.status(201).json({
      message: "Opportunity created successfully",
      opportunity: newOpportunity
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL OPPORTUNITIES
exports.getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("ngo_id", "name email");

    res.status(200).json(opportunities);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE OPPORTUNITY
exports.updateOpportunity = async (req, res) => {
  try {
    const { title, description, duration, location, required_skills } = req.body;

    // Always include fields, even if empty
    const updateData = {
      title: title ?? "",
      description: description ?? "",
      duration: duration ?? "",
      location: location ?? "",
      required_skills: Array.isArray(required_skills) ? required_skills : []
    };

    const updated = await Opportunity.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Return the full updated opportunity
    res.status(200).json(updated);

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE OPPORTUNITY
exports.deleteOpportunity = async (req, res) => {
  try {
    const deleted = await Opportunity.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};