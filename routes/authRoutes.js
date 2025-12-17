const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, createStudent } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.post('/create-student', protect, authorize('staff'), createStudent);

module.exports = router;
