const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPatients,
  toggleUserStatus,
  createDoctor,
  deleteDoctor,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// All admin routes require admin privileges
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/patients', getPatients);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.post('/doctors', createDoctor);
router.delete('/doctors/:id', deleteDoctor);

module.exports = router;
