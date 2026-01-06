const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'technician', 'admin'], required: true },  // Add 'admin' role
});
module.exports = mongoose.model('User', UserSchema);