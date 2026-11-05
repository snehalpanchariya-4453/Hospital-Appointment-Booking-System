const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  bookAppointment,
  getAppointments,
  getAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  rescheduleAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.get('/available-slots', getAvailableSlots);

router
  .route('/')
  .get(protect, getAppointments)
  .post(protect, bookAppointment);

router
  .route('/:id')
  .get(protect, getAppointment);

router.put('/:id/status', protect, authorize('doctor', 'admin'), updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);
router.put('/:id/reschedule', protect, authorize('patient', 'admin'), rescheduleAppointment);

module.exports = router;
