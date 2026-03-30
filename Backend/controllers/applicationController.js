const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");
const User = require("../models/User");

// Apply for an opportunity
exports.applyForOpportunity = async (req, res) => {
  try {
    const { volunteerId, opportunityId } = req.body;

    // Check if already applied
    const existingApplication = await Application.findOne({
      volunteerId,
      opportunityId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this opportunity"
      });
    }

    // Get volunteer details
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // Get opportunity details
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Get NGO details
    const ngo = await User.findById(opportunity.ngo_id);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    // Create application
    const application = new Application({
      volunteerId,
      volunteerName: volunteer.name,
      ngoId: opportunity.ngo_id,
      ngoName: ngo.name,
      opportunityId,
      opportunityTitle: opportunity.title,
      status: "Pending",
      appliedDate: new Date()
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get applications for NGO
exports.getApplicationsForNGO = async (req, res) => {
  try {
    const { ngoId } = req.params;

    const applications = await Application.find({ ngoId }).sort({ appliedDate: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get applications for Volunteer
exports.getApplicationsForVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.params;

    const applications = await Application.find({ volunteerId }).sort({ appliedDate: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept application
exports.acceptApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByIdAndUpdate(
      id,
      { status: "Accepted" },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Application accepted",
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject application
exports.rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByIdAndUpdate(
      id,
      { status: "Rejected" },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Application rejected",
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};