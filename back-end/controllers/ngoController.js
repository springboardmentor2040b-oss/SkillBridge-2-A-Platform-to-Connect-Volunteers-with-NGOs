const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= REGISTER NGO ================= */
exports.registerNGO = async (req, res) => {
  try {
    const { organizationName, email, password, location, description, website } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);

    const ngo = await User.create({
      name: organizationName,
      organizationName,
      email,
      password: hashed,
      role: "ngo",
      location,
      description,
      website,
      ngoRole: "admin" // 🔥 admin
    });

    ngo.organizationId = ngo._id;
    await ngo.save();

    res.json({
      _id: ngo._id,
      name: ngo.name,
      email: ngo.email,
      role: ngo.role
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= LOGIN NGO ================= */
exports.loginNGO = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "ngo" });
    if (!user) return res.status(400).json({ message: "NGO not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= ADD MEMBER ================= */
exports.addMember = async (req, res) => {
  try {
    // 🔥 ONLY ADMIN
    if (req.user.ngoRole !== "admin") {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);

    const member = await User.create({
      name,
      email,
      password: hashed,
      role: "ngo",
      organizationId: req.user.organizationId,
      ngoRole: "member"
    });

    res.json(member);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= GET MEMBERS ================= */
exports.getMembers = async (req, res) => {
  try {
    const members = await User.find({
      organizationId: req.user.organizationId,
      role: "ngo"
    }).select("-password");

    res.json(members);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getOrganization = async (req, res) => {
  try {
    const orgId = req.user.organizationId;

    const org = await User.findById(orgId).select("-password");

    res.json(org);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};