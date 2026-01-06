const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  gpa: Number,
  studentId: String
});
module.exports = mongoose.model('Student', studentSchema);
