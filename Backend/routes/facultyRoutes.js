const express = require("express");
const {
  getAllFaculty,
  getFacultyById,
  addFaculty,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/facultyController");

const router = express.Router();

// Faculty routes
router.get("/list", getAllFaculty);                             
router.get("/:id", getFacultyById);                          
router.post("/add", addFaculty);                                
router.put("/update/:id", updateFaculty);                       
router.delete("/delete/:id", deleteFaculty);                    

module.exports = router;
