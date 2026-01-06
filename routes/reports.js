const express = require('express');
const router = express.Router();
const Report = require('../models/report');
const Technician = require('../models/technician'); // Added Technician model

// Create a new report
router.post('/', async (req, res) => {
  try {
    const reportData = req.body;
    const report = new Report(reportData);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    console.error('Error submitting report:', err);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// Get reports (optionally filter by studentId or assignedTechnicianId)
router.get('/', async (req, res) => {
  try {
    const { studentId, assignedTechnicianId } = req.query;
    let filter = {};
    if (studentId) filter.studentId = studentId;
    if (assignedTechnicianId) filter.assignedTechnicianId = assignedTechnicianId;
    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Update a report (by technician)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log(`Updating report ${id} with data:`, updateData);
    
    // If status is being updated to resolved, set the updatedAt time
    if (updateData.status === 'resolved') {
      updateData.updatedAt = Date.now();
    }
    
    // If assignedTechnicianId is being updated, get technician info
    if (updateData.assignedTechnicianId) {
      const technician = await Technician.findOne({ email: updateData.assignedTechnicianId });
      if (technician) {
        updateData.technicianName = technician.name;
        updateData.technicianDesignation = technician.designation;
      }
    }
    
    const updatedReport = await Report.findByIdAndUpdate(id, updateData, { new: true });
    console.log(`Updated report result:`, updatedReport);
    res.json(updatedReport);
  } catch (err) {
    console.error('Error updating report:', err);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

module.exports = router;