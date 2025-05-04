const { isNull } = require("util");
const Users = require("../models/userModel");
const Club = require("../models/clubModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const addUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  if (!username || !password) {
    return res.status(400).json({ msg: "Missing details" });
  }

  const user = await Users.findOne({ username });
  if (user) {
    return res.status(400).json({ msg: "User already exist" });
  }

  const newUser = new Users({ name: username, passwordHash: password });
  // hasing the password
  bcrypt.hash(password, 7, async (err, hash) => {
    if (err)
      return res.status(400).json({ msg: "error while saving the password" });

    newUser.passwordHash = hash;
    const savedUserRes = await newUser.save();

    if (savedUserRes)
      return res.status(200).json({ msg: "User is successfully saved" });
  });
};

const login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  let lastLogin = new Date();
  if (!email || !password) {
    res.status(400).json({ msg: "Something missing" });
  }
  console.log(lastLogin, Users);

  try {
    const user = await Users.findOne({ email: email }); // finding user in db
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    console.log(user);

    // comparing the password with the saved hash-password
    const matchPassword = await bcrypt.compare(password, user.passwordHash);
    console.log(matchPassword);

    if (matchPassword) {
      // Update lastLogin
      await Users.updateOne({ email }, { lastLogin });
      console.log("Last login time updated");

      // Creating user session to keep user logged in also on refresh
      const userSession = {
        _id: user._id,
        email: user.email,
        position: user.position,
        name: user.name,
      };
      req.session.user = userSession; // attach user session to session object from express-session
      req.session.save();

      return res
        .status(200)
        .json({ msg: "You have logged in successfully", userSession });
    } else {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const logout = async (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) return res.status(500).send("Unable to Logout!");
      else {
        console.log("user logged out");
        return res.status(200).json({ msg: "Logout Successfull..." });
      }
    });
  }
};

const isAuth = async (req, res) => {
  if (req.session.user) {
    return res.json(req.session.user);
  } else {
    return res.status(401).json("unauthorize");
  }
};

const getClubMembers = async (req,res) => {
  const { clubId } = req.params;   // this is the `cid` field on Club

  try {
    // 1. Find the Club by its cid
    const club = await Club.findOne({ cid: clubId }).select('_id cid name');
    if (!club) {
      return res.status(404).json({ message: `Club '${clubId}' not found` });
    }

    // 2. Find users who have at least one membership for this club
    //    We query on memberships.club === club._id
    const users = await Users.find({ 'memberships.club': club._id })
      .select('name email memberships')   // pick only fields we need
      .lean();                            // get plain JS objects
    console.log(users.length);
    // 3. For each user, filter their memberships down to this club
    const result = users.map(user => {
      // Filter memberships for this club
      const clubMemberships = user.memberships
        .filter(m => m.club.toString() === club._id.toString())
        .map(m => ({
          role:      m.role,
          startDate: m.startDate,
          endDate:   m.endDate || null,
        }));

      return {
        userId:       user._id,
        name:         user.name,
        email:        user.email,
        memberships:  clubMemberships,
      };
    });

    return res.status(200).json({
      message: 'Club members fetched successfully',
      members: result,
    });
  } catch (err) {
    console.error('Error in getClubMembers:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  addUser,
  login,
  logout,
  isAuth,
  getClubMembers,
};
