const Project = require("../models/researchProjectModel");

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
    const {
      facultyId,
      title,
      description,
      status,
      collaborators = [],
      startDate,
    } = req.body;
  
    if (!facultyId || !title || !description) {
      return res.status(400).json({ msg: "Missing required fields" });
    }
  
    try {
      const newProject = new Project({
        faculty: facultyId, 
        title,
        description,
        status: status || "ongoing",
        collaborators,
        startDate,
      });
  
      const savedProject = await newProject.save();
  
      await savedProject.populate("faculty");
  
      return res.status(201).json(savedProject);
    } catch (error) {
      console.error("Error adding project:", error);
      return res.status(500).json({ msg: "Failed to add project" });
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
