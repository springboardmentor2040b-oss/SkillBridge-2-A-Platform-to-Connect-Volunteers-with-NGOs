const mongoose = require("mongoose");
const Opportunity = require("./models/Opportunity"); // adjust path
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for cleanup"))
  .catch(err => console.log(err));

// Function to delete expired opportunities
const deleteExpiredOpportunities = async () => {
  try {
    const result = await Opportunity.deleteMany({ expiryDate: { $lte: new Date() } });
    console.log(`Deleted ${result.deletedCount} expired opportunities`);
  } catch (error) {
    console.error("Error deleting expired opportunities:", error);
  }
};

// Run cleanup every 1 hour
setInterval(deleteExpiredOpportunities, 60 * 60 * 1000);