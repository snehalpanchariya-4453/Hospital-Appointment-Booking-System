const express = require('express');
const router = express.Router();
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router
  .route('/')
  .get(getDepartments)
  .post(protect, authorize('admin'), createDepartment);

router
  .route('/:id')
  .get(getDepartment)
  .put(protect, authorize('admin'), updateDepartment)
  .delete(protect, authorize('admin'), deleteDepartment);

module.exports = router;
