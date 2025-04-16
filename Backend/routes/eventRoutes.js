const express = require('express');

const {
    getClubEvents
} = require("../controllers/eventController");

const router = express.Router();


router.get('/getClubEvents/:clubId',getClubEvents)

module.exports = router;