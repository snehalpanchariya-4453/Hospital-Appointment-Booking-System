import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/api';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Heart,
  FileText,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/dashboard/StatCard';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import Modal from '../../components/common/Modal';
import SlotPicker from '../../components/appointments/SlotPicker';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals for Reschedule / Cancel
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');

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
      console.error('Failed to load patient appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  );
  const completedAppointments = appointments.filter((a) => a.status === 'Completed');
  const nextAppointment = upcomingAppointments[0];

  const handleOpenReschedule = (apt) => {
    setActiveAppointment(apt);
    setNewDate(apt.dateString);
    setNewSlot(apt.timeSlot);
    setRescheduleError('');
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = async () => {
    if (!newDate || !newSlot) {
      setRescheduleError('Please select both a date and an available slot');
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
        err.response?.data?.message || 'Failed to reschedule. Please choose another slot.'
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
      console.error('Failed to cancel:', err);
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Loading your health portal..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-100/80 via-white to-brand-50 p-8 rounded-3xl border border-brand-200 shadow-soft-pink flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-white px-3 py-1 rounded-full border border-brand-100 shadow-2xs">
            Patient Portal
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track your appointments, doctor consultations, and medical prescriptions.
          </p>
        </div>

        <Link
          to="/patient/book"
          className="gradient-pink-btn px-6 py-3.5 rounded-2xl font-bold text-sm shadow-soft-pink flex items-center space-x-2 flex-shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Book New Appointment</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length}
          icon={Calendar}
          color="pink"
          subtitle="Scheduled visits"
        />
        <StatCard
          title="Completed Consultations"
          value={completedAppointments.length}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Past visits"
        />
        <StatCard
          title="Registered Blood Group"
          value={user?.bloodGroup || 'Not Set'}
          icon={Heart}
          color="blue"
          subtitle="Patient Profile"
        />
      </div>

      {/* Next Appointment Spotlight */}
      {nextAppointment && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-brand-200 shadow-soft-pink">
          <div className="flex items-center justify-between pb-4 border-b border-brand-100">
            <div className="flex items-center space-x-2 text-brand-600 font-bold text-sm">
              <Calendar className="w-4 h-4" />
              <span>Next Upcoming Consultation</span>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              {nextAppointment.status}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 flex items-start space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-sm">
                {nextAppointment.doctor?.user?.name ? nextAppointment.doctor.user.name.charAt(0) : 'D'}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">
                  {nextAppointment.doctor?.user?.name}
                </h3>
                <p className="text-xs font-bold text-brand-600">
                  {nextAppointment.doctor?.specialization || 'Specialist'}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-brand-400" />
                    {nextAppointment.dateString}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-brand-400" />
                    {nextAppointment.timeSlot}
                  </span>
                  <span>Room: {nextAppointment.doctor?.roomNumber || 'OPD'}</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 bg-brand-50/50 p-2.5 rounded-xl border border-brand-100">
                  <span className="font-bold">Reason:</span> {nextAppointment.reason}
                </p>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2.5 justify-end">
              <button
                onClick={() => handleOpenReschedule(nextAppointment)}
                className="px-4 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-xl text-xs border border-brand-200 transition-colors"
              >
                Reschedule Date / Slot
              </button>
              <button
                onClick={() => handleOpenCancel(nextAppointment)}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs border border-rose-200 transition-colors"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointments List Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Recent Appointments
            </h2>
            <p className="text-xs text-slate-500">
              Complete history of your medical consultations
            </p>
          </div>
          <Link
            to="/patient/appointments"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center"
          >
            <span>View All ({appointments.length})</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-brand-100 text-center space-y-4 max-w-md mx-auto shadow-sm">
            <Calendar className="w-12 h-12 text-brand-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No appointments yet</h4>
            <p className="text-xs text-slate-500">
              You haven't scheduled any doctor consultations yet. Book your first appointment today!
            </p>
            <Link
              to="/patient/book"
              className="gradient-pink-btn px-6 py-2.5 rounded-xl font-bold text-xs inline-block shadow-soft-pink"
            >
              Book First Appointment
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.slice(0, 6).map((apt) => (
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
      </div>

      {/* Reschedule Modal with Double-Booking Protected SlotPicker */}
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
                className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Nevermind
              </button>
              <button
                type="button"
                disabled={rescheduleLoading || !newSlot}
                onClick={handleConfirmReschedule}
                className="gradient-pink-btn px-6 py-2.5 text-xs font-bold rounded-xl shadow-soft-pink disabled:opacity-50"
              >
                {rescheduleLoading ? 'Updating slot...' : 'Confirm New Slot'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Appointment"
        maxWidth="max-w-md"
      >
        {activeAppointment && (
          <div className="space-y-5">
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel your appointment with{' '}
              <strong>{activeAppointment.doctor?.user?.name}</strong> on{' '}
              <strong>{activeAppointment.dateString}</strong> at{' '}
              <strong>{activeAppointment.timeSlot}</strong>?
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Reason for cancellation (optional):
              </label>
              <textarea
                rows="3"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule conflict, feeling better..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 text-xs bg-brand-50/20 focus:outline-none focus:ring-2 focus:ring-brand-400"
              ></textarea>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                disabled={cancelLoading}
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PatientDashboard;
