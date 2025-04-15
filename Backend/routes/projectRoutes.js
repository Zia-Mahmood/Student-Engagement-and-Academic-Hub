const express = require("express");
const {
  getProjectsByFaculty,
  addProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

// Project routes
router.get("/faculty/:facultyId", getProjectsByFaculty);        
router.post("/add", addProject);                                
router.put("/update/:id", updateProject);                       
router.delete("/delete/:id", deleteProject);                    

module.exports = router;
