const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");

/* ================= APPLY ================= */
exports.apply = async (req, res) => {
  try {
    const { opportunity, message } = req.body;

    const opp = await Opportunity.findById(opportunity);

    if (!opp) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (opp.status !== "open") {
      return res.status(400).json({ message: "Opportunity is closed" });
    }

    if (opp.applyDeadline && new Date() > new Date(opp.applyDeadline)) {
      return res.status(400).json({
        message: "Application deadline has passed",
      });
    }

    const existing = await Application.findOne({
      opportunity,
      volunteer: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        message: "You already applied"
      });
    }

    const application = await Application.create({
      opportunity,
      volunteer: req.user._id,
      message,
      status: "pending",

      // 🔥 IMPORTANT
      organizationId: opp.organizationId || opp.ngo
    });

    res.status(201).json(application);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= VOLUNTEER ================= */
exports.myApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      volunteer: req.user._id,
    })
      .populate({
        path: "opportunity",
        populate: { path: "ngo", select: "name" }
      })
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= NGO (ALL SHARED) ================= */
exports.getAllApplicantsForNGO = async (req, res) => {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find({
      organizationId: req.user.organizationId
    })
      .populate({
        path: "opportunity",
        select: "title location"
      })
      .populate("volunteer", "name email skills")
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= SPECIFIC OPPORTUNITY ================= */
exports.getApplicants = async (req, res) => {
  try {
    const applications = await Application.find({
      opportunity: req.params.opportunityId,
      organizationId: req.user.organizationId
    })
      .populate("volunteer", "name email skills")
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= UPDATE STATUS ================= */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 🔥 FIXED
    if (
      application.organizationId.toString() !==
      req.user.organizationId.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    res.json(application);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= UNDO ================= */
exports.undoApplication = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    const application = await Application.findOneAndDelete({
      opportunity: opportunityId,
      volunteer: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json({ message: "Withdrawn" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};