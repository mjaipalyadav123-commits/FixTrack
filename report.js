const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: String,
  block: String,
  floor: String,
  room: String,
  location: String,
  category: { 
    type: String, 
    enum: ['IT', 'Electrical', 'Plumbing', 'Maintenance'], 
    default: 'Maintenance' 
  },
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'], 
    default: 'Medium' 
  },
  description: String,
  studentId: { type: String, required: true },
  assignedTechnicianId: { type: String },
  technicianName: { type: String }, // Added technician name
  technicianDesignation: { type: String }, // Added technician designation
  status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
  resolvedViewed: { type: Boolean, default: false }, // Track if resolved report has been viewed
  resolvedViewedAt: { type: Date }, // Track when resolved report was viewed
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now } // Track when report was last updated
});

// Middleware to update the updatedAt field before saving
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check if model is already compiled and export it
module.exports =
  mongoose.models.Report || mongoose.model('Report', reportSchema);