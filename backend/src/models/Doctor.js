const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Please specify the department'],
    },
    specialization: {
      type: String,
      required: [true, 'Please provide doctor specialization'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Please provide doctor qualifications'],
      trim: true,
    },
    experienceYears: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: [0, 'Experience cannot be negative'],
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please specify consultation fee in dollars/currency'],
      min: [0, 'Fee cannot be negative'],
      default: 50,
    },
    bio: {
      type: String,
      default: '',
    },
    roomNumber: {
      type: String,
      default: 'OPD-101',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00', // 24-hr format HH:mm
      },
      end: {
        type: String,
        default: '17:00',
      },
      slotDurationMinutes: {
        type: Number,
        default: 30,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
