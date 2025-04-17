// const express = require("express");
// const {
//   getAllCourses,
//   getCourseById,
//   addCourse,
//   updateCourse,
//   deleteCourse,
// } = require("../controllers/courseController");

// const router = express.Router();

// // Course routes
// router.get("/list", getAllCourses);
// router.get("/:id", getCourseById);
// router.post("/add", addCourse);
// router.put("/update/:id", updateCourse);
// router.delete("/delete/:id", deleteCourse);

// module.exports = router;

const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.get("/list", courseController.getAll);
router.get("/:id", courseController.getById);
router.post("/add", courseController.create);
router.put("/update/:id", courseController.update);
router.delete("/delete/:id", courseController.delete);

module.exports = router;
