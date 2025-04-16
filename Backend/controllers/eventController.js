const mongoose = require('mongoose');
const Event = require("../models/eventModel");

const getClubEvents = async (req, res) => {
    console.log(req.params)
    try {
        const events = await Event.find({ clubid: req.params.clubId }).sort({ 'datetimeperiod.0': -1 }).limit(4);

        if (!events || events.length == 0) {
            return res.status(404).json({ message: "No events found" });
        }

        // Return all clubs
        res.status(200).json({
            message: "Events fetched successfully",
            events,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getClubEvents,
}