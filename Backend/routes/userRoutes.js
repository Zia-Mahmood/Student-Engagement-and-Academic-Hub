const express = require("express");
const { requireAuth, requireRole } = require('../middlewares/userMiddleware');
const {
  addUser,
  login,
  logout,
  isAuth,
  getClubMembers
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", requireRole("admin","cooordinator"), addUser);
router.post("/login", login);
router.get("/logout", requireAuth, logout);
router.get("/isAuth", isAuth);
router.get("/getClubMembers/:clubId",getClubMembers);

module.exports = router;
