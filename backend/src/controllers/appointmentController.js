const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { generateTimeSlots, getDayName } = require('../utils/slotGenerator');

// @desc    Get available time slots for a doctor on a specific date
// @route   GET /api/appointments/available-slots
// @access  Public (or Patient)
exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctorId and date (YYYY-MM-DD)',
      });
    }

    const doctor = await Doctor.findById(doctorId).populate('user', 'name');
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    if (!doctor.isAvailable) {
      return res.status(200).json({
        success: true,
        isWorkingDay: false,
        message: `${doctor.user.name} is currently marked as unavailable for bookings.`,
        slots: [],
      });
    }

    // Determine day of the week for the chosen date
    const dayName = getDayName(date);
    const isWorkingDay = doctor.workingDays.includes(dayName);

    if (!isWorkingDay) {
      return res.status(200).json({
        success: true,
        isWorkingDay: false,
        dayName,
        message: `Doctor is not available on ${dayName}s. Available days: ${doctor.workingDays.join(', ')}`,
        slots: [],
      });
    }

    // Generate base slots from doctor's working hours
    const { start = '09:00', end = '17:00', slotDurationMinutes = 30 } =
      doctor.workingHours || {};

    const allSlots = generateTimeSlots(start, end, slotDurationMinutes);

    // Query all existing active (non-cancelled) appointments for this doctor on this date
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      dateString: date,
      status: { $ne: 'Cancelled' },
    }).select('timeSlot');

    const bookedSlotSet = new Set(bookedAppointments.map((a) => a.timeSlot));

    // Return slots with availability flag
    const slotsWithAvailability = allSlots.map((slot) => ({
      timeSlot: slot,
      isBooked: bookedSlotSet.has(slot),
    }));

    res.status(200).json({
      success: true,
      doctor: {
        id: doctor._id,
        name: doctor.user.name,
        specialization: doctor.specialization,
        consultationFee: doctor.consultationFee,
      },
      date,
      dayName,
      isWorkingDay: true,
      totalSlots: slotsWithAvailability.length,
      availableSlotsCount: slotsWithAvailability.filter((s) => !s.isBooked).length,
      slots: slotsWithAvailability,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book a new appointment (Strict double-booking prevention)
// @route   POST /api/appointments
// @access  Private (Patient or Admin)
exports.bookAppointment = async (req, res, next) => {
  try {
    const {
      doctorId,
      appointmentDate,
      dateString,
      timeSlot,
      reason,
      symptoms,
      patientId, // if booked by admin for a patient
    } = req.body;

    if (!doctorId || !appointmentDate || !dateString || !timeSlot || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctorId, appointmentDate, dateString, timeSlot, and reason',
      });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId).populate('user', 'name');
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Determine target patient
    let targetPatientId = req.user.id;
    if (req.user.role === 'admin' && patientId) {
      targetPatientId = patientId;
    }

    // Double booking verification #1: Check if slot is already occupied
    const existingBooking = await Appointment.findOne({
      doctor: doctorId,
      dateString,
      timeSlot,
      status: { $ne: 'Cancelled' },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: `This slot (${timeSlot}) is already booked for Dr. ${doctor.user.name} on ${dateString}. Please choose a different slot.`,
      });
    }

    // Optional check: Avoid same patient booking multiple appointments for same doctor on same day
    const patientSameDayBooking = await Appointment.findOne({
      patient: targetPatientId,
      doctor: doctorId,
      dateString,
      status: { $ne: 'Cancelled' },
    });

    if (patientSameDayBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have an appointment with this doctor on this date.',
      });
    }

    const appointment = await Appointment.create({
      patient: targetPatientId,
      doctor: doctorId,
      department: doctor.department,
      appointmentDate: new Date(appointmentDate),
      dateString,
      timeSlot,
      reason,
      symptoms: symptoms || '',
      fee: doctor.consultationFee,
      status: 'Confirmed', // Auto-confirm on book or 'Pending'
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone avatar')
      .populate({
        path: 'doctor',
        populate: [
          { path: 'user', select: 'name email phone avatar' },
          { path: 'department', select: 'name icon' },
        ],
      });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments (Patient gets own, Doctor gets their schedule, Admin gets all)
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    const { status, date, doctorId, patientId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (date) query.dateString = date;

    if (req.user.role === 'patient') {
      // Patient only sees their own appointments
      query.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      // Doctor only sees appointments booked for them
      const doctorProfile = await Doctor.findOne({ user: req.user.id });
      if (!doctorProfile) {
        return res.status(404).json({
          success: false,
          message: 'Doctor profile not found for this account',
        });
      }
      query.doctor = doctorProfile._id;
    } else if (req.user.role === 'admin') {
      // Admin can filter by doctor or patient
      if (doctorId) query.doctor = doctorId;
      if (patientId) query.patient = patientId;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone gender dateOfBirth bloodGroup avatar')
      .populate({
        path: 'doctor',
        populate: [
          { path: 'user', select: 'name email phone avatar' },
          { path: 'department', select: 'name icon' },
        ],
      })
      .sort({ appointmentDate: -1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone gender dateOfBirth bloodGroup address avatar')
      .populate({
        path: 'doctor',
        populate: [
          { path: 'user', select: 'name email phone avatar' },
          { path: 'department', select: 'name icon' },
        ],
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Role-based authorization
    if (
      req.user.role === 'patient' &&
      appointment.patient._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment',
      });
    }

    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user.id });
      if (
        !doctorProfile ||
        appointment.doctor._id.toString() !== doctorProfile._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this appointment',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status / notes (Doctor or Admin)
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor, Admin)
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, doctorNotes, prescription, paymentStatus } = req.body;

    const appointment = await Appointment.findById(req.params.id).populate('doctor');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check doctor authorization
    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user.id });
      if (
        !doctorProfile ||
        appointment.doctor._id.toString() !== doctorProfile._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this appointment',
        });
      }
    }

    if (status) appointment.status = status;
    if (doctorNotes !== undefined) appointment.doctorNotes = doctorNotes;
    if (prescription !== undefined) appointment.prescription = prescription;
    if (paymentStatus !== undefined) appointment.paymentStatus = paymentStatus;

    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone avatar')
      .populate({
        path: 'doctor',
        populate: [
          { path: 'user', select: 'name email phone avatar' },
          { path: 'department', select: 'name icon' },
        ],
      });

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment (Patient, Doctor, Admin)
// @route   PUT /api/appointments/:id/cancel
// @access  Private
exports.cancelAppointment = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (appointment.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This appointment is already cancelled',
      });
    }

    if (appointment.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed appointments cannot be cancelled',
      });
    }

    // Check authorization
    if (req.user.role === 'patient') {
      if (appointment.patient.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this appointment',
        });
      }
    } else if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user.id });
      if (
        !doctorProfile ||
        appointment.doctor.toString() !== doctorProfile._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this appointment',
        });
      }
    }

    appointment.status = 'Cancelled';
    appointment.cancellationReason = cancellationReason || 'Cancelled by user';
    appointment.cancelledBy = req.user.role;

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully. The slot is now available for other bookings.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule appointment (Patient, Admin)
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (Patient, Admin)
exports.rescheduleAppointment = async (req, res, next) => {
  try {
    const { newDate, newDateString, newTimeSlot, reason } = req.body;

    if (!newDate || !newDateString || !newTimeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide newDate, newDateString, and newTimeSlot',
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reschedule this appointment',
      });
    }

    if (appointment.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reschedule an already completed appointment',
      });
    }

    // Double booking check for the new slot
    const slotConflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      doctor: appointment.doctor,
      dateString: newDateString,
      timeSlot: newTimeSlot,
      status: { $ne: 'Cancelled' },
    });

    if (slotConflict) {
      return res.status(409).json({
        success: false,
        message: `The selected slot (${newTimeSlot}) on ${newDateString} is already booked. Please choose another slot.`,
      });
    }

    // Update appointment
    appointment.appointmentDate = new Date(newDate);
    appointment.dateString = newDateString;
    appointment.timeSlot = newTimeSlot;
    appointment.status = 'Confirmed';
    if (reason) {
      appointment.reason = reason;
    }

    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone avatar')
      .populate({
        path: 'doctor',
        populate: [
          { path: 'user', select: 'name email phone avatar' },
          { path: 'department', select: 'name icon' },
        ],
      });

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
