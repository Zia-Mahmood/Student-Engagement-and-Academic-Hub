const mongoose = require('mongoose');

const researchProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['ongoing', 'completed'], required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    collaborators: [{ type: String }], 
    startDate: { type: Date },
});

module.exports = mongoose.model('ResearchProject', researchProjectSchema);
