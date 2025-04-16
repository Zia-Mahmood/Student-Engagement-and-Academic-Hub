const Faculty = require("../models/facultyModel");

const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find();
    return res.status(200).json(faculty);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to fetch faculty data" });
  }
};

const getFacultyById = async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return res.status(404).json({ msg: "Faculty not found" });
    }
    return res.status(200).json(faculty);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to fetch faculty data" });
  }
};

const getResearchFaculty = async (req, res) => {
    try {
      const researchFaculty = await Faculty.find({ isResearchActive: true });
      return res.status(200).json(researchFaculty);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Failed to fetch research-active faculty" });
    }
  };

const addFaculty = async (req, res) => {
  const { name, department, researchInterests, isResearchActive, profileImage } = req.body;

  if (!name || !department) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const newFaculty = new Faculty({
      name,
      department,
      researchInterests,
      isResearchActive,
      profileImage
    });
    
    const savedFaculty = await newFaculty.save();
    return res.status(201).json({ msg: "Faculty added successfully", savedFaculty });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to add faculty" });
  }
};

const updateFaculty = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedFaculty) {
      return res.status(404).json({ msg: "Faculty not found" });
    }
    return res.status(200).json({ msg: "Faculty updated successfully", updatedFaculty });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to update faculty" });
  }
};

const deleteFaculty = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFaculty = await Faculty.findByIdAndDelete(id);
    if (!deletedFaculty) {
      return res.status(404).json({ msg: "Faculty not found" });
    }
    return res.status(200).json({ msg: "Faculty deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to delete faculty" });
  }
};

module.exports = {
  getAllFaculty,
  getFacultyById,
  addFaculty,
  updateFaculty,
  deleteFaculty,
};
