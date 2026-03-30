 const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  volunteerName: String,

  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  ngoName: String,

  opportunityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opportunity",
    required: true
  },

  opportunityTitle: String,

  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending"
  },

  appliedDate: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Application", applicationSchema);
