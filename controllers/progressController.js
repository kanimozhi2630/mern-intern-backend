const StudentProgress = require('../models/StudentProgress');
const User = require('../models/User');

exports.getStudentProgress = async (req, res) => {
  try {
    const studentId = req.user.role === 'student' ? req.user._id : req.params.studentId;
    const progress = await StudentProgress.findOne({ studentId }).populate('studentId', 'name email');
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress data not found' });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStudentProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { attendance, marks, suggestions, overallPerformance } = req.body;

    let progress = await StudentProgress.findOne({ studentId });

    if (!progress) {
      const student = await User.findById(studentId);
      progress = new StudentProgress({
        studentId,
        department: req.user.department
      });
    }

    if (attendance) {
      progress.attendance = {
        ...progress.attendance,
        ...attendance,
        percentage: ((attendance.attendedClasses || progress.attendance.attendedClasses) / 
                    (attendance.totalClasses || progress.attendance.totalClasses) * 100).toFixed(2)
      };
    }

    if (marks) {
      progress.marks.push(...marks);
    }

    if (suggestions) {
      progress.suggestions.push({
        message: suggestions,
        addedBy: req.user._id
      });
    }

    if (overallPerformance) {
      progress.overallPerformance = overallPerformance;
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentsByDepartment = async (req, res) => {
  try {
    const students = await User.find({ 
      role: 'student'
    }).select('-password');

    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const progress = await StudentProgress.findOne({ 
          studentId: student._id,
          department: req.user.department 
        });
        return {
          ...student.toObject(),
          hasProgress: !!progress,
          lastLogin: student.lastLogin,
          lastLogout: student.lastLogout
        };
      })
    );

    res.json(studentsWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await User.distinct('department', { role: 'staff' });
    res.json(departments.filter(d => d));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
