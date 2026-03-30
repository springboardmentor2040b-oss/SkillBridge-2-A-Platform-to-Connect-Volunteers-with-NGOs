const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: { type: String, unique: true },

  password: String,

  role: {
    type: String,
    enum: ["volunteer", "ngo"],
    required: true
  },

  // 🔥 NEW
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  // 🔥 NEW (admin/member)
  ngoRole: {
    type: String,
    enum: ["admin", "member"],
    default: "member"
  },

  location: String,
  skills: [String],

  organizationName: String,
  description: String,
  website: String

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);