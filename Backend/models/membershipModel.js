const mongoose = require('mongoose')

const membershipSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    club: {type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true},
    role: {type: String, required: true},
    appliedAt: {type: Date, default: Date.now},
    status: { type: String, enum:['pending','approved','rejected'], default:'pending' }
});

module.exports = mongoose.model('Membership',membershipSchema);