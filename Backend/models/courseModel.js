const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    faculty: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }],
    resources: [{ type: String }],
});

module.exports = mongoose.model('Course', courseSchema);
