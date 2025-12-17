const mongoose = require('mongoose');

const studentProgressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  attendance: {
    totalClasses: { type: Number, default: 0 },
    attendedClasses: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 }
  },
  marks: [{
    subject: String,
    marks: Number,
    maxMarks: Number,
    examType: String,
    date: Date
  }],
  suggestions: [{
    message: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }],
  overallPerformance: String
}, { timestamps: true });

module.exports = mongoose.model('StudentProgress', studentProgressSchema);
