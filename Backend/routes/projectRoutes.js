const express = require("express");
const {
  getAllProjects,
  getProjectsByFacultyId,
  addProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

// Project routes
router.get("/all", getAllProjects);
router.get("/faculty/:facultyId", getProjectsByFacultyId);        
router.post("/add", addProject);                                
router.put("/update/:id", updateProject);                       
router.delete("/delete/:id", deleteProject);                    

module.exports = router;
