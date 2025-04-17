const Project = require("../models/researchProjectModel");
const Faculty = require("../models/facultyModel");

const getAllProjects = async (req, res) => {
    try {
      const projects = await Project.find().populate("faculty"); 
      return res.status(200).json(projects);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Failed to fetch projects" });
    }
  };

const getProjectsByFacultyId = async (req, res) => {
  const { facultyId } = req.params;

  try {
    const projects = await Project.find({ facultyId });
    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to fetch projects" });
  }
};

const addProject = async (req, res) => {
    try {
  
      const {
        title,
        description,
        status,
        startDate,
        collaborators,
        facultyId,
        facultyName
      } = req.body;
  
      let resolvedFacultyId = facultyId;
  
      if (!facultyId && facultyName) {
        const faculty = await Faculty.findOne({ name: facultyName });
        if (!faculty) {
          console.error("Faculty not found:", facultyName);
          return res.status(400).json({ error: "Faculty not found by name" });
        }
        resolvedFacultyId = faculty._id;
      }
  
      if (!resolvedFacultyId) {
        console.error("Missing facultyId");
        return res.status(400).json({ error: "Faculty ID is required" });
      }
  
      const newProject = new Project({
        title,
        description,
        status,
        faculty: resolvedFacultyId,
        collaborators,
        startDate,
      });
  
      const savedProject = await newProject.save();
      const populated = await savedProject.populate("faculty");
      res.status(201).json(populated);
    } catch (err) {
      console.error("Error in addProject:", err);
      res.status(500).json({ error: "Failed to add project" });
    }
  };
  
  

const updateProject = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProject) {
      return res.status(404).json({ msg: "Project not found" });
    }
    return res.status(200).json({ msg: "Project updated successfully", updatedProject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to update project" });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ msg: "Project not found" });
    }
    return res.status(200).json({ msg: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to delete project" });
  }
};

module.exports = {
  getAllProjects,
  getProjectsByFacultyId,
  addProject,
  updateProject,
  deleteProject,
};
