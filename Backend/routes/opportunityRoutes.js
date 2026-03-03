const express = require("express");
const router = express.Router();

const {
  createOpportunity,
  getOpportunities,
  updateOpportunity,   // ✅ ADD THIS
  deleteOpportunity
} = require("../controllers/opportunityController");

// ✅ CREATE
router.post("/create", createOpportunity);

// ✅ GET ALL
router.get("/", getOpportunities);

// ✅ UPDATE (ONLY NGO SHOULD BE ALLOWED IN CONTROLLER OR MIDDLEWARE)
router.put("/:id", updateOpportunity);   // ✅ ADD THIS

// ✅ DELETE
router.delete("/:id", deleteOpportunity);

module.exports = router;