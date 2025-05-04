const express = require("express");
const {
  addReview,
  addFacultyReview,
  getReviewsForCourse,
  getReviewsForFaculty,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

// Review routes
router.post("/add", addReview); // POST /api/reviews/add
router.post("/faculty/add", addFacultyReview); // POST /api/reviews/add
router.get("/course/:courseId", getReviewsForCourse); // GET /api/reviews/course/:corseId
router.get("/faculty/:facultyId", getReviewsForFaculty); // GET /api/reviews/faculty/:facultyId
router.delete("/delete/:id", deleteReview); // DELETE /api/reviews/delete/:id

module.exports = router;
