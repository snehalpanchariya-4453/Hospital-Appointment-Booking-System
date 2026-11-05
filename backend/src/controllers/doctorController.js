const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Department = require('../models/Department');

// @desc    Get all doctors with search, filters (department, specialization, availability)
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res, next) => {
  try {
    const { department, specialization, search, isAvailable } = req.query;

    const query = {};

    if (department) {
      query.department = department;
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    let doctors = await Doctor.find(query)
      .populate('user', 'name email phone avatar status')
      .populate('department', 'name icon');

    // Filter by name/search if provided
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      doctors = doctors.filter(
        (doc) =>
          (doc.user && searchRegex.test(doc.user.name)) ||
          searchRegex.test(doc.specialization) ||
          (doc.department && searchRegex.test(doc.department.name))
      );
    }

    // Only return active doctors unless requested by admin
    const activeDoctors = doctors.filter(
      (doc) => doc.user && doc.user.status === 'active'
    );

    res.status(200).json({
      success: true,
      count: activeDoctors.length,
      data: activeDoctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor profile
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone gender dateOfBirth address avatar status')
      .populate('department', 'name description icon');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in doctor profile
// @route   GET /api/doctors/profile/me
// @access  Private (Doctor)
exports.getMyDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id })
      .populate('user', 'name email phone avatar address gender')
      .populate('department', 'name icon');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found for this account',
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile (for Doctor or Admin)
// @route   PUT /api/doctors/:id
// @access  Private (Doctor or Admin)
exports.updateDoctor = async (req, res, next) => {
  try {
    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Authorization: Doctor can only update their own profile; Admin can update any
    if (req.user.role === 'doctor' && doctor.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update another doctor’s profile',
      });
    }

    const {
      specialization,
      qualification,
      experienceYears,
      consultationFee,
      bio,
      roomNumber,
      isAvailable,
      workingDays,
      workingHours,
      department,
      name,
      phone,
    } = req.body;

    // If name or phone passed, update linked User record
    if (name || phone !== undefined) {
      const userUpdate = {};
      if (name) userUpdate.name = name;
      if (phone !== undefined) userUpdate.phone = phone;
      await User.findByIdAndUpdate(doctor.user, userUpdate);
    }

    // Update doctor fields
    if (specialization) doctor.specialization = specialization;
    if (qualification) doctor.qualification = qualification;
    if (experienceYears !== undefined) doctor.experienceYears = experienceYears;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (bio !== undefined) doctor.bio = bio;
    if (roomNumber !== undefined) doctor.roomNumber = roomNumber;
    if (isAvailable !== undefined) doctor.isAvailable = isAvailable;
    if (workingDays) doctor.workingDays = workingDays;
    if (workingHours) doctor.workingHours = { ...doctor.workingHours, ...workingHours };
    if (department && req.user.role === 'admin') doctor.department = department;

    await doctor.save();

    const updated = await Doctor.findById(doctor._id)
      .populate('user', 'name email phone avatar')
      .populate('department', 'name icon');

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manage doctor availability (working days, hours, isAvailable)
// @route   PUT /api/doctors/availability/update
// @access  Private (Doctor)
exports.updateAvailability = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    const { isAvailable, workingDays, workingHours } = req.body;

    if (isAvailable !== undefined) doctor.isAvailable = isAvailable;
    if (workingDays) doctor.workingDays = workingDays;
    if (workingHours) {
      doctor.workingHours = {
        start: workingHours.start || doctor.workingHours.start,
        end: workingHours.end || doctor.workingHours.end,
        slotDurationMinutes: workingHours.slotDurationMinutes || doctor.workingHours.slotDurationMinutes,
      };
    }

    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};
