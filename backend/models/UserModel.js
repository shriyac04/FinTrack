const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true }, // Ensure this is defined
  password: { type: String, required: true },
  budget: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
