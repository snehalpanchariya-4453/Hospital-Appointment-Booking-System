const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctor,
  getMyDoctorProfile,
  updateDoctor,
  updateAvailability,
} = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.get('/', getDoctors);
router.get('/profile/me', protect, authorize('doctor'), getMyDoctorProfile);
router.put('/availability/update', protect, authorize('doctor'), updateAvailability);
router.get('/:id', getDoctor);
router.put('/:id', protect, authorize('doctor', 'admin'), updateDoctor);

module.exports = router;
