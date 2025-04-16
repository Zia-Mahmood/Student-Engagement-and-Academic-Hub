const Course = require("../models/courseModel");

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to fetch courses" });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    return res.status(200).json(course);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to fetch course" });
  }
};

const addCourse = async (req, res) => {
  const { title, department, facultyId, syllabus } = req.body;

  if (!title || !department || !facultyId) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const newCourse = new Course({
      title,
      department,
      facultyId,
      syllabus,
    });

    const savedCourse = await newCourse.save();
    return res.status(201).json({ msg: "Course added successfully", savedCourse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to add course" });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCourse) {
      return res.status(404).json({ msg: "Course not found" });
    }
    return res.status(200).json({ msg: "Course updated successfully", updatedCourse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to update course" });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ msg: "Course not found" });
    }
    return res.status(200).json({ msg: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to delete course" });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
};
