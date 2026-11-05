const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required'],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor reference is required'],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    dateString: {
      type: String,
      required: [true, 'Appointment date string is required (YYYY-MM-DD)'],
      trim: true,
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required (e.g. 09:30 AM)'],
      trim: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason for appointment is required'],
      trim: true,
    },
    symptoms: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Pending',
    },
    doctorNotes: {
      type: String,
      default: '',
    },
    prescription: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledBy: {
      type: String,
      enum: ['patient', 'doctor', 'admin', 'system', null],
      default: null,
    },
    previousAppointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    rescheduledTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
    fee: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double booking at the MongoDB database level:
// Enforce unique combination of doctor, dateString, and timeSlot for all active (non-cancelled) appointments
appointmentSchema.index(
  { doctor: 1, dateString: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: 'Cancelled' } },
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
