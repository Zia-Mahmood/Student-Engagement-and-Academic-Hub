const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String },
  bio: { type: String },
  officeHours: { type: String },
  approachInstructions: { type: String },
  isResearcher: { type: Boolean, default: false },
  interests: [{ type: String }],
  // profileImage: { type: String },
});

module.exports = mongoose.model("Faculty", facultySchema);
