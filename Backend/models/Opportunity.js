const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  required_skills: [String],
  duration: String,
  location: String,
  status: {
    type: String,
    default: "open"
  },
  ngo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Opportunity", opportunitySchema);