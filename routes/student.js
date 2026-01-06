const express = require('express');
const router = express.Router();
const Report = require('../models/report');

// Create a new report (unassigned initially)
router.post('/reports', async (req, res) => {
  try {
    const { title, block, floor, room, location, category, priority, description, studentId } = req.body;
    const newReport = new Report({ title, block, floor, room, location, category, priority, description, studentId });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reports by studentId
router.get('/reports/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const reports = await Report.find({ studentId });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;