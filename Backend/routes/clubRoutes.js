const express = require("express");
const {
    getAllClubs,
    getAllStudentBody,
    getClub,
} = require("../controllers/clubController");
const router = express.Router();

router.get("/getAllClubs",getAllClubs)
router.get("/getAllStudentBody",getAllStudentBody)
router.get("/getClub/:clubId",getClub)

module.exports = router;