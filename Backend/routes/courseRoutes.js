const express = require("express");
const {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

// Course routes
router.get("/list", getAllCourses);                           
router.get("/:id", getCourseById);                            
router.post("/add", addCourse);                               
router.put("/update/:id", updateCourse);                      
router.delete("/delete/:id", deleteCourse);                   

module.exports = router;
