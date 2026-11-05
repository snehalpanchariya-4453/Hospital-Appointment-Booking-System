const Department = require('../models/Department');
const Doctor = require('../models/Doctor');

// @desc    Get all departments (with doctor count)
// @route   GET /api/departments
// @access  Public
exports.getDepartments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const departments = await Department.find(query).sort({ name: 1 });

    // Aggregate doctor count per department
    const doctorCounts = await Doctor.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    doctorCounts.forEach((dc) => {
      countMap[dc._id.toString()] = dc.count;
    });

    const departmentsWithCount = departments.map((dept) => ({
      ...dept.toObject(),
      doctorCount: countMap[dept._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      count: departmentsWithCount.length,
      data: departmentsWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single department with its doctors
// @route   GET /api/departments/:id
// @access  Public
exports.getDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    const doctors = await Doctor.find({ department: department._id })
      .populate('user', 'name email phone avatar')
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      data: {
        department,
        doctors,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (Admin)
exports.createDepartment = async (req, res, next) => {
  try {
    const { name, description, icon, image, status } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide department name and description',
      });
    }

    const department = await Department.create({
      name,
      description,
      icon: icon || 'Activity',
      image: image || '',
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
exports.updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
exports.deleteDepartment = async (req, res, next) => {
  try {
    const doctorCount = await Doctor.countDocuments({ department: req.params.id });

    if (doctorCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete department: ${doctorCount} doctor(s) are currently assigned to it. Please reassign them first.`,
      });
    }

    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
