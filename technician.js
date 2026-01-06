const mongoose = require('mongoose');
const technicianSchema = new mongoose.Schema({
  name: String,
  email: String,
  designation: String, // Added designation field
  technicianId: String,
  tasks: [String]
});

// Add a method to update technician profile
technicianSchema.methods.updateProfile = function(name, designation) {
  this.name = name;
  this.designation = designation;
  return this.save();
};

module.exports = mongoose.model('Technician', technicianSchema);