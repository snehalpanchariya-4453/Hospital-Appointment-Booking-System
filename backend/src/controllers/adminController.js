const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Department = require('../models/Department');
const Appointment = require('../models/Appointment');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalPatients,
      totalDoctors,
      totalDepartments,
      totalAppointments,
      todayAppointments,
      statusCounts,
      recentAppointments,
    ] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      Doctor.countDocuments(),
      Department.countDocuments({ status: 'active' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ dateString: today }),
      Appointment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Appointment.find()
        .populate('patient', 'name email phone avatar')
        .populate({
          path: 'doctor',
          populate: [
            { path: 'user', select: 'name email avatar' },
            { path: 'department', select: 'name' },
          ],
        })
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    // Format status breakdown
    const statusBreakdown = {
      Pending: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
      Rescheduled: 0,
    };

    statusCounts.forEach((sc) => {
      if (sc._id) {
        statusBreakdown[sc._id] = sc.count;
      }
    });

    // Compute estimated revenue
    const revenueAggregate = await Appointment.aggregate([
      { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
      { $group: { _id: null, total: { $sum: '$fee' } } },
    ]);
    const totalRevenue = revenueAggregate.length > 0 ? revenueAggregate[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalDepartments,
        totalAppointments,
        todayAppointments,
        totalRevenue,
        statusBreakdown,
        recentAppointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Private (Admin)
exports.getPatients = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const query = { role: 'patient' };

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const patients = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (active/inactive) or delete patient
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate admin accounts',
      });
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account is now ${user.status}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new doctor account (User + Doctor profile)
// @route   POST /api/admin/doctors
// @access  Private (Admin)
exports.createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      departmentId,
      specialization,
      qualification,
      experienceYears,
      consultationFee,
      roomNumber,
      bio,
      workingDays,
      workingHours,
    } = req.body;

    if (!name || !email || !password || !departmentId || !specialization || !qualification) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, department, specialization and qualification',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Check department exists
    const dept = await Department.findById(departmentId);
    if (!dept) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    // Create User with role 'doctor'
    const user = await User.create({
      name,
      email,
      password,
      role: 'doctor',
      phone: phone || '',
    });

    // Create Doctor Profile
    const doctor = await Doctor.create({
      user: user._id,
      department: departmentId,
      specialization,
      qualification,
      experienceYears: Number(experienceYears) || 0,
      consultationFee: Number(consultationFee) || 50,
      roomNumber: roomNumber || 'OPD-101',
      bio: bio || '',
      workingDays: workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: workingHours || {
        start: '09:00',
        end: '17:00',
        slotDurationMinutes: 30,
      },
    });

    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate('user', 'name email phone avatar')
      .populate('department', 'name icon');

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully!',
      data: populatedDoctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete doctor and user account
// @route   DELETE /api/admin/doctors/:id
// @access  Private (Admin)
exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Remove doctor and associated user
    await User.findByIdAndDelete(doctor.user);
    await Doctor.findByIdAndDelete(doctor._id);

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
