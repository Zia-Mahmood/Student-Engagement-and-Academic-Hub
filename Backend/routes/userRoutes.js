const express = require('express');
const { addUser, login, logout,isAuth } = require('../controllers/userController');
const router = express.Router();


router.post('/addUser', addUser);
router.post('/login', login);
router.get('/logout', logout);
router.get('/isAuth',isAuth);

module.exports = router;