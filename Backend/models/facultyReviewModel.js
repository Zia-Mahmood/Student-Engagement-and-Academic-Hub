const mongoose = require("mongoose");

const facultyReviewSchema = new mongoose.Schema({
  Faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FacultyReview", facultyReviewSchema);
