const User = require('../models/User');
const Doctor = require('../models/Doctor');

// Helper to send token response
const sendTokenResponse = async (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  let doctorProfile = null;

  if (user.role === 'doctor') {
    doctorProfile = await Doctor.findOne({ user: user._id }).populate('department', 'name');
  }

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      bloodGroup: user.bloodGroup,
      avatar: user.avatar,
      doctorProfile: doctorProfile
        ? {
            id: doctorProfile._id,
            department: doctorProfile.department,
            specialization: doctorProfile.specialization,
            qualification: doctorProfile.qualification,
            experienceYears: doctorProfile.experienceYears,
            consultationFee: doctorProfile.consultationFee,
            roomNumber: doctorProfile.roomNumber,
            workingDays: doctorProfile.workingDays,
            workingHours: doctorProfile.workingHours,
            isAvailable: doctorProfile.isAvailable,
          }
        : null,
    },
  });
};

// @desc    Register a new patient
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, gender, dateOfBirth, address, bloodGroup } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // New registrations from public form are always patients
    const user = await User.create({
      name,
      email,
      password,
      role: 'patient',
      phone: phone || '',
      gender: gender || 'prefer_not_to_say',
      dateOfBirth: dateOfBirth || null,
      address: address || '',
      bloodGroup: bloodGroup || '',
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Patient, Doctor, Admin)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    // Check for user with password included
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administration.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let doctorProfile = null;

    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id }).populate('department', 'name');
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        bloodGroup: user.bloodGroup,
        avatar: user.avatar,
        doctorProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, gender, dateOfBirth, address, bloodGroup, avatar } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (gender) fieldsToUpdate.gender = gender;
    if (dateOfBirth) fieldsToUpdate.dateOfBirth = dateOfBirth;
    if (address !== undefined) fieldsToUpdate.address = address;
    if (bloodGroup !== undefined) fieldsToUpdate.bloodGroup = bloodGroup;
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};
