import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../../services/api';
import { Calendar, PlusCircle, Filter, AlertCircle, Clock } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import Modal from '../../components/common/Modal';
import SlotPicker from '../../components/appointments/SlotPicker';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterTab, setFilterTab] = useState('All'); // All, Upcoming, Completed, Cancelled
  const [loading, setLoading] = useState(true);

  // Reschedule state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');

  // Cancel state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getAppointments();
      if (res.data?.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter logic
  const filteredAppointments = appointments.filter((apt) => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Upcoming') return apt.status === 'Confirmed' || apt.status === 'Pending';
    if (filterTab === 'Completed') return apt.status === 'Completed';
    if (filterTab === 'Cancelled') return apt.status === 'Cancelled';
    return true;
  });

  const handleOpenReschedule = (apt) => {
    setActiveAppointment(apt);
    setNewDate(apt.dateString);
    setNewSlot(apt.timeSlot);
    setRescheduleError('');
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = async () => {
    if (!newDate || !newSlot) {
      setRescheduleError('Please choose both a new date and an available slot');
      return;
    }

    setRescheduleLoading(true);
    setRescheduleError('');
    try {
      const res = await appointmentService.rescheduleAppointment(activeAppointment._id, {
        newDate,
        newDateString: newDate,
        newTimeSlot: newSlot,
        reason: activeAppointment.reason,
      });

      if (res.data?.success) {
        setRescheduleModalOpen(false);
        fetchAppointments();
      }
    } catch (err) {
      setRescheduleError(
        err.response?.data?.message || 'Failed to reschedule. Selected slot may be booked.'
      );
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleOpenCancel = (apt) => {
    setActiveAppointment(apt);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    setCancelLoading(true);
    try {
      const res = await appointmentService.cancelAppointment(
        activeAppointment._id,
        cancelReason || 'Cancelled by patient'
      );
      if (res.data?.success) {
        setCancelModalOpen(false);
        fetchAppointments();
      }
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Loading your appointments..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header and CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Booking History
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            My Appointments
          </h1>
          <p className="text-xs text-slate-500">
            Manage your consultations, reschedule dates, or view past prescriptions
          </p>
        </div>

        <Link
          to="/patient/book"
          className="gradient-pink-btn px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-soft-pink flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book Appointment</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-brand-100 pb-2 overflow-x-auto">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              filterTab === tab
                ? 'bg-gradient-to-r from-brand-500 to-brand-400 text-white shadow-soft-pink'
                : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50'
            }`}
          >
            {tab}
            <span className="ml-1.5 opacity-75">
              (
              {tab === 'All'
                ? appointments.length
                : tab === 'Upcoming'
                ? appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Pending').length
                : tab === 'Completed'
                ? appointments.filter((a) => a.status === 'Completed').length
                : appointments.filter((a) => a.status === 'Cancelled').length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Grid of Appointments */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-brand-100 text-center space-y-3 max-w-md mx-auto shadow-sm">
          <Calendar className="w-12 h-12 text-brand-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No {filterTab.toLowerCase()} appointments found</h4>
          <p className="text-xs text-slate-400">
            {filterTab === 'All'
              ? 'You have not booked any appointments yet.'
              : `You have no appointments with status "${filterTab}".`}
          </p>
          <Link
            to="/patient/book"
            className="gradient-pink-btn px-5 py-2.5 rounded-xl text-xs font-bold inline-block"
          >
            Book Appointment
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((apt) => (
            <AppointmentCard
              key={apt._id}
              appointment={apt}
              role="patient"
              onReschedule={handleOpenReschedule}
              onCancel={handleOpenCancel}
            />
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      <Modal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule Appointment"
        maxWidth="max-w-2xl"
      >
        {activeAppointment && (
          <div className="space-y-6">
            <div className="p-4 bg-brand-50/70 rounded-2xl border border-brand-100 text-xs">
              <p className="font-bold text-slate-800">
                Doctor: {activeAppointment.doctor?.user?.name}
              </p>
              <p className="text-slate-500">
                Current Time: {activeAppointment.dateString} at {activeAppointment.timeSlot}
              </p>
            </div>

            {rescheduleError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{rescheduleError}</span>
              </div>
            )}

            <SlotPicker
              doctorId={activeAppointment.doctor?._id}
              selectedDate={newDate}
              onDateChange={setNewDate}
              selectedSlot={newSlot}
              onSlotSelect={setNewSlot}
            />

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                disabled={rescheduleLoading || !newSlot}
                onClick={handleConfirmReschedule}
                className="gradient-pink-btn px-6 py-2 text-xs font-bold rounded-xl shadow-soft-pink disabled:opacity-50"
              >
                {rescheduleLoading ? 'Updating...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Appointment"
        maxWidth="max-w-md"
      >
        {activeAppointment && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel your appointment with{' '}
              <strong>{activeAppointment.doctor?.user?.name}</strong> on{' '}
              <strong>{activeAppointment.dateString}</strong> at{' '}
              <strong>{activeAppointment.timeSlot}</strong>?
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Reason (optional):
              </label>
              <textarea
                rows="3"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
              ></textarea>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Keep
              </button>
              <button
                type="button"
                disabled={cancelLoading}
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                {cancelLoading ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyAppointments;
