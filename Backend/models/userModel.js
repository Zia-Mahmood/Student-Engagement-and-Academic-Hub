const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  //_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  // role: { type: String, enum: ['admin', 'user'], required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  position: {
    type: String,
    enum: ["admin", "coordinator", "member", "faculty"],
    required: true,
  },
  memberships: [
    {
      role: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
        required: true,
      },
    },
  ],
  batch: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
