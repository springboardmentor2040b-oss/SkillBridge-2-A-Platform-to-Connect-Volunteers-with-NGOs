const Opportunity = require("../models/Opportunity");

/* helper */
const computeStatus = (opp) => {
  if (opp.applyDeadline && new Date(opp.applyDeadline) < new Date()) {
    return "closed";
  }
  return "open";
};

/* CREATE */
exports.createOpportunity = async (req, res) => {
  try {
    if (req.user.role !== "ngo")
      return res.status(403).json({ message: "Access denied" });

    const opportunity = await Opportunity.create({
      ...req.body,
      status: "open",
      ngo: req.user._id,
      organizationId: req.user.organizationId
    });

    res.json(opportunity);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* GET ALL */
exports.getOpportunities = async (req, res) => {
  try {
    const { skill, location, duration } = req.query;

    let filter = {};

    if (location) filter.location = { $regex: location, $options: "i" };
    if (duration) filter.duration = duration;

    let opportunities = await Opportunity.find(filter).populate("ngo", "name");

    opportunities = opportunities.map((o) => {
      const obj = o.toObject();
      obj.status = computeStatus(o);
      return obj;
    });

    opportunities = opportunities.filter(o => o.status === "open");

    if (skill) {
      opportunities = opportunities.filter(o =>
        o.skillsRequired?.some(s =>
          s.toLowerCase().includes(skill.toLowerCase())
        )
      );
    }

    res.json(opportunities);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* MY OPPORTUNITIES (FIXED FOR OLD + NEW DATA) */
exports.getMyOpportunities = async (req, res) => {
  try {
    let opportunities = await Opportunity.find({
      $or: [
        { organizationId: req.user.organizationId },
        { ngo: req.user._id } // fallback for old data
      ]
    });

    opportunities = opportunities.map((o) => {
      const obj = o.toObject();
      obj.status = computeStatus(o);
      return obj;
    });

    res.json(opportunities);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* UPDATE */
exports.updateOpportunity = async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);

    if (!opp) return res.status(404).json({ message: "Not found" });

    if (opp.organizationId?.toString() !== req.user.organizationId.toString())
      return res.status(403).json({ message: "Not authorized" });

    Object.assign(opp, req.body);
    await opp.save();

    res.json(opp);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* DELETE */
exports.deleteOpportunity = async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);

    if (!opp) return res.status(404).json({ message: "Not found" });

    if (opp.organizationId?.toString() !== req.user.organizationId.toString())
      return res.status(403).json({ message: "Not authorized" });

    await opp.deleteOne();

    res.json({ message: "Deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};