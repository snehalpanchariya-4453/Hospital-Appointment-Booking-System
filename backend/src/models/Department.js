const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide department name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide department description'],
    },
    icon: {
      type: String,
      default: 'Activity', // Lucide icon name: Heart, Brain, Baby, Activity, Bone, Stethoscope, Eye, Sparkles
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Department', departmentSchema);
