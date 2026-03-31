const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    location: String,
    category: String,
    skillsRequired: [String],
    volunteersNeeded: Number,
    applyDeadline: Date,
    duration: String,

    status: {
      type: String,
      default: "open"
    },

    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // 🔥 IMPORTANT
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);