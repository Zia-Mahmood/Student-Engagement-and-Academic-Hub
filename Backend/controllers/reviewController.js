const Review = require("../models/courseReviewModel");
const FReview = require("../models/facultyReviewModel");

const addFacultyReview = async (req, res) => {
  const { reviewer, comment, rating, Faculty } = req.body;

  if (!reviewer || !comment || !rating || !Faculty) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const newReview = new FReview({
      reviewer,
      comment,
      rating,
      Faculty,
    });

    const savedReview = await newReview.save();
    return res
      .status(201)
      .json({ msg: "Review added successfully", savedReview });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to add review" });
  }
};

const addReview = async (req, res) => {
  const { reviewer, comment, rating, course } = req.body;

  if (!reviewer || !comment || !rating || !course) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const newReview = new Review({
      reviewer,
      comment,
      rating,
      course,
    });

    const savedReview = await newReview.save();
    return res
      .status(201)
      .json({ msg: "Review added successfully", savedReview });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to add review" });
  }
};

const getReviewsForCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const reviews = await Review.find({ course: courseId }).populate(
      "reviewer",
      "name"
    );
    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to fetch reviews" });
  }
};

const getReviewsForFaculty = async (req, res) => {
  const { facultyId } = req.params;

  try {
    const reviews = await FReview.find({ Faculty: facultyId }).populate(
      "reviewer",
      "name"
    );
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
  addFacultyReview,
  getReviewsForCourse,
  getReviewsForFaculty,
  deleteReview,
};
