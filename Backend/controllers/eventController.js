const mongoose = require('mongoose');
const Event = require("../models/eventModel");
const dayjs = require("dayjs");

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


const getEvents = async (req, res) => {
    // page number, default to 1
    console.log(req.query)
    const page = req.query.page ? Math.max(1, parseInt(req.query.page)) : 1;
    const limit = req.query.limit ? Math.max(1, parseInt(req.query.limit)) : 24;

    console.log(`Fetching events for page ${page} with limit ${limit} `);

    try {

        const events = await Event.find()
            .sort({ 'datetimeperiod.0': -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // total count for the client to know when to stop
        const total = await Event.countDocuments();

        res.status(200).json({
            page,
            limit,
            total,
            events,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const getOngoingEvents = async (req, res) => {
    try {
        const today = dayjs();
        // Start of day (00:00)
        const startOfDay = today.startOf('day');
        // End of day (23:59)
        const endOfDay = today.endOf('day').subtract(1, 'minute');
        const events = await Event.find({ 'datetimeperiod.0': { "$lte":endOfDay },'datetimeperiod.1':{"$gte": startOfDay}}).sort({ 'datetimeperiod.0': -1 });

        res.status(200).json({ events });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const getUpcomingEvents = async (req, res) => {
    try {
        const now = dayjs();

        const events = await Event.find({ 'datetimeperiod.0': { "$gt": now } }).sort({ 'datetimeperiod.0': -1 });
        res.status(200).json({ events });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const getEventsByMonth = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ error: "Month and year required" });
        }

        const startDate = dayjs(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = dayjs(startDate).endOf("month").toDate();
        console.log(startDate, endDate)

        const events = await Event.find({ 'datetimeperiod': { "$gte": startDate,"$lt": endDate } });

        res.status(200).json(events);
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    getClubEvents,
    getOngoingEvents,
    getUpcomingEvents,
    getEvents,
    getEventsByMonth,
}