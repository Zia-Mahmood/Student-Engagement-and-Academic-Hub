const Review = require("../models/reviewModel");

const addReview = async (req, res) => {
  const { reviewer, content, courseId, facultyId } = req.body;

  if (!reviewer || !content || (!courseId && !facultyId)) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const newReview = new Review({
      reviewer,
      content,
      courseId,
      facultyId,
    });

    const savedReview = await newReview.save();
    return res.status(201).json({ msg: "Review added successfully", savedReview });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to add review" });
  }
};

const getReviewsForCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const reviews = await Review.find({ courseId });
    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to fetch reviews" });
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ msg: "Review not found" });
    }
    return res.status(200).json({ msg: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to delete review" });
  }
};

module.exports = {
  addReview,
  getReviewsForCourse,
  deleteReview,
};
