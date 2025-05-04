const mongoose = require("mongoose");
const Club = require("../models/clubModel");


const getAllClubs = async (req,res) => {
    try{
        const clubs = await Club.find({__typename:"SimpleClubType"});
        
        if(!clubs || clubs.length==0){
            return res.status(404).json({ message: "No clubs found" });
        }

        // Return all clubs
        res.status(200).json({
        message: "Clubs fetched successfully",
        clubs,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const getAllStudentBody = async (req,res) => {
  try{
      const clubs = await Club.find({__typename:"StudentBodyClubType"});
      
      if(!clubs || clubs.length==0){
          return res.status(404).json({ message: "No clubs found" });
      }

      // Return all clubs
      res.status(200).json({
      message: "Clubs fetched successfully",
      clubs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClub = async (req,res) => {
    console.log(req.params)
    try{
      const club = await Club.findOne({cid:req.params.clubId});
      if (!club){
        return res.status(404).json({ message: "No club found" });
      }
      res.status(200).json({
        message: "Club fetched successfully",
        club,
      })
    }catch (error) {
      res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getAllClubs,
    getAllStudentBody,
    getClub,
}