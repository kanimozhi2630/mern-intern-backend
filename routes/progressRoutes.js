const express = require('express');
const router = express.Router();
const {
  getStudentProgress,
  updateStudentProgress,
  getStudentsByDepartment,
  getDepartments
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my-progress', protect, authorize('student'), getStudentProgress);
router.get('/student/:studentId', protect, authorize('staff'), getStudentProgress);
router.put('/student/:studentId', protect, authorize('staff'), updateStudentProgress);
router.get('/students', protect, authorize('staff'), getStudentsByDepartment);
router.get('/departments', getDepartments);

module.exports = router;
