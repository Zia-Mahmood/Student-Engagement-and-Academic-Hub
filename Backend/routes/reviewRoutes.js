const express = require("express");
const {
  addReview,
  getReviewsForCourse,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

// Review routes
router.post("/add", addReview);                                  // POST /api/reviews/add
router.get("/course/:courseId", getReviewsForCourse);            // GET /api/reviews/course/:courseId
router.delete("/delete/:id", deleteReview);                      // DELETE /api/reviews/delete/:id

module.exports = router;
