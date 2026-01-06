const express = require('express');
const router = express.Router();
const Report = require('../models/report');
const Technician = require('../models/technician'); // Added Technician model

// Get all technicians
router.get('/all', async (req, res) => {
  try {
    const technicians = await Technician.find({});
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all pending (unassigned) reports
router.get('/reports/pending', async (req, res) => {
  try {
    const pendingReports = await Report.find({ status: 'pending', assignedTechnicianId: null });
    res.json(pendingReports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all reports assigned to a technician
router.get('/reports/:technicianId', async (req, res) => {
  try {
    const { technicianId } = req.params;
    const reports = await Report.find({ assignedTechnicianId: technicianId });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get work history for a technician (resolved reports)
router.get('/reports/history/:technicianId', async (req, res) => {
  try {
    const { technicianId } = req.params;
    const reports = await Report.find({ 
      assignedTechnicianId: technicianId, 
      status: 'resolved' 
    }).sort({ updatedAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Technician assigns themselves to a report and optionally updates status
router.put('/reports/:reportId/assign', async (req, res) => {
  try {
    const { reportId } = req.params;
    const { technicianId, status } = req.body; // technicianId is the one claiming the report
    
    // Get technician details
    const technician = await Technician.findOne({ email: technicianId });
    
    const updateData = { 
      assignedTechnicianId: technicianId, 
      status: status || 'in-progress'
    };
    
    // Add technician name and designation if technician exists
    if (technician) {
      updateData.technicianName = technician.name;
      updateData.technicianDesignation = technician.designation;
    }
    
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      updateData,
      { new: true }
    );
    res.json(updatedReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update report status (e.g., mark resolved)
router.put('/reports/:reportId/status', async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;
    console.log(`Updating report ${reportId} status to: ${status}`);
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    console.log(`Updated report:`, updatedReport);
    res.json(updatedReport);
  } catch (err) {
    console.error('Error updating report status:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get technician profile
router.get('/profile/:technicianId', async (req, res) => {
  try {
    const { technicianId } = req.params;
    const technician = await Technician.findOne({ email: technicianId });
    if (!technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }
    res.json(technician);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update technician profile
router.put('/profile/:technicianId', async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { name, designation } = req.body;
    
    // Find and update technician
    let technician = await Technician.findOne({ email: technicianId });
    if (!technician) {
      // Create new technician if not exists
      technician = new Technician({
        email: technicianId,
        name: name,
        designation: designation
      });
    } else {
      // Update existing technician
      technician.name = name;
      technician.designation = designation;
    }
    
    await technician.save();
    
    // Update all reports assigned to this technician with new name and designation
    await Report.updateMany(
      { assignedTechnicianId: technicianId },
      { 
        technicianName: name,
        technicianDesignation: designation
      }
    );
    
    res.json(technician);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;