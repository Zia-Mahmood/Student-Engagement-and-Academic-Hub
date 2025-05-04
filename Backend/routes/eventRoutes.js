const express = require('express');

const {
    getClubEvents,
    getOngoingEvents,
    getUpcomingEvents,
    getEvents,
    getEventsByMonth
} = require("../controllers/eventController");

const router = express.Router();


router.get('/getClubEvents/:clubId',getClubEvents)
router.get('/getOngoingEvents',getOngoingEvents)
router.get('/getUpcomingEvents',getUpcomingEvents)
router.get('/events',getEvents)
router.get("/by-month", getEventsByMonth);


module.exports = router;