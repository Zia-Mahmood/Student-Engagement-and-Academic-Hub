// const express = require("express");
// const {
//   getAllFaculty,
//   getFacultyById,
//   addFaculty,
//   updateFaculty,
//   deleteFaculty,
// } = require("../controllers/facultyController");

// const router = express.Router();

// // Faculty routes
// router.get("/list", getAllFaculty);
// router.get("/:id", getFacultyById);
// router.post("/add", addFaculty);
// router.put("/update/:id", updateFaculty);
// router.delete("/delete/:id", deleteFaculty);

// module.exports = router;

const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");

router.get("/list", facultyController.getAll);
router.get("/:id", facultyController.getById);
router.post("/add", facultyController.create);
router.put("/update/:id", facultyController.update);
router.delete("/delete/:id", facultyController.delete);

module.exports = router;
