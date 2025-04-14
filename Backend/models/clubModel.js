const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    //_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    cid: { type: String, required: true,unique: true },
    name: { type: String, required: true,unique: true },
    moto: { type: String },
    description: { type: String},
    contact: {
        mail: { type: String },
        facebook: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
        discord: { type: String },
        whatsapp: { type: String }
    },
    logo: { type: String },
    banner: { type: String },
    __typename: { type: String, default: 'SimpleClubType' },
});

module.exports = mongoose.model('Club', clubSchema);