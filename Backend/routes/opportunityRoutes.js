const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");

// GET opportunities
router.get("/", async (req, res) => {
  const opportunities = await Opportunity.find();
  res.json(opportunities);
});

// CREATE opportunity
router.post("/create", async (req, res) => {
  const opportunity = new Opportunity(req.body);
  await opportunity.save();
  res.json(opportunity);
});

// UPDATE opportunity
router.put("/:id", async (req, res) => {
  const updatedOpportunity = await Opportunity.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedOpportunity);
});

// DELETE opportunity
router.delete("/:id", async (req, res) => {
  const deletedOpportunity = await Opportunity.findByIdAndDelete(req.params.id);
  res.json(deletedOpportunity);
});

module.exports = router;