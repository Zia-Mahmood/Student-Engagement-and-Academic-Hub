// middleware/clubMiddleware.js

const Club = require("../models/clubModel");
const mongoose = require("mongoose");

// Ensure that the club with given ID exists
async function clubExists(req, res, next) {
  const clubId = req.params.clubId || req.body.clubId;
  if (!clubId || !mongoose.isValidObjectId(clubId)) {
    return res.status(400).json({ msg: "Invalid or missing club ID." });
  }

  try {
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ msg: "Club not found." });
    }
    // Attach club document to request for downstream handlers
    req.club = club;
    next();
  } catch (err) {
    console.error("clubExists error:", err);
    res.status(500).json({ msg: "Server error while checking club." });
  }
}

// Ensure the logged‐in user is a member of this club
function requireMembership(req, res, next) {
  const userSession = req.session.user;
  if (!userSession) {
    return res.status(401).json({ msg: "Unauthorized." });
  }
  // Assuming you have loaded req.club in clubExists
  const membership = req.session.user.memberships?.find(m => 
    String(m.club) === String(req.club._id) &&
    (!m.endDate || new Date(m.endDate) > new Date())
  );
  if (!membership) {
    return res.status(403).json({ msg: "Forbidden: You are not a member of this club." });
  }
  next();
}

module.exports = {
  clubExists,
  requireMembership,
};
