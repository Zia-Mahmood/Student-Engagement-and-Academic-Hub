const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    clubid: { type: String, required: true },
    collabclubs: [{ type: String }],
    datetimeperiod: {
        0: { type: Date, required: true },
        1: { type: Date, required: true },
    },
    status: { type: mongoose.Schema.Types.Mixed,required: true},
    location: [{ type: String }],
    for:[{ type: String }],
    poster: { type: String },
    budget: [{ type: String }],
    __typename: { type: String, default: 'EventType' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

eventSchema.virtual('club',{
    ref: 'Club',
    localField: 'clubid',
    foreignField: 'cid',
    justOne: true,
});

eventSchema.set('toObject', { virtuals: true });
eventSchema.set('toJSON', { virtuals: true });
eventSchema.pre('find', function() {
    this.populate('club');
});

module.exports = mongoose.model('Event', eventSchema);