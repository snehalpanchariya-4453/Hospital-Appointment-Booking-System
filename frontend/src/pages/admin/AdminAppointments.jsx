import React, { useState, useEffect } from 'react';
import { appointmentService, doctorService } from '../../services/api';
import { Calendar, Search, Clock, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import Modal from '../../components/common/Modal';
import SlotPicker from '../../components/appointments/SlotPicker';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [search, setSearch] = useState('');
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

  const fetchData = async () => {
    try {
      const [aptRes, docRes] = await Promise.all([
        appointmentService.getAppointments(),
        doctorService.getDoctors(),
      ]);
      if (aptRes.data?.success) setAppointments(aptRes.data.data);
      if (docRes.data?.success) setDoctors(docRes.data.data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        fetchData();
      }
    } catch (err) {
      setRescheduleError(
        err.response?.data?.message || 'Failed to reschedule. Selected slot is already booked.'
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
        cancelReason || 'Cancelled by administration'
      );
      if (res.data?.success) {
        setCancelModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
    const matchesDoctor = !filterDoctor || apt.doctor?._id === filterDoctor;
    const matchesSearch =
      !search ||
      apt.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      apt.doctor?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      apt.reason?.toLowerCase().includes(search.toLowerCase()) ||
      apt.dateString?.includes(search);

    return matchesStatus && matchesDoctor && matchesSearch;
  });

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Loading all appointments..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Hospital Booking Master
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
          Manage All Hospital Appointments
        </h1>
        <p className="text-xs text-slate-500">
          Complete hospital ledger of patient bookings, doctor schedules, and clinical visits.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-brand-100 shadow-soft-pink grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient, doctor, reason, date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-brand-200 text-xs bg-brand-50/20"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-brand-200 text-xs bg-brand-50/20 font-medium text-slate-800"
          >
            <option value="">All Doctors</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.user?.name} ({d.specialization})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-brand-200 text-xs bg-brand-50/20 font-medium text-slate-800"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-brand-100 text-center space-y-3 max-w-md mx-auto shadow-sm">
          <Calendar className="w-12 h-12 text-brand-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No appointments found</h4>
          <p className="text-xs text-slate-400">
            No bookings match the selected filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((apt) => (
            <AppointmentCard
              key={apt._id}
              appointment={apt}
              role="admin"
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
        title="Admin Override: Reschedule Appointment"
        maxWidth="max-w-2xl"
      >
        {activeAppointment && (
          <div className="space-y-6">
            <div className="p-4 bg-brand-50/70 rounded-2xl border border-brand-100 text-xs">
              <p className="font-bold text-slate-800">
                Patient: {activeAppointment.patient?.name}
              </p>
              <p className="text-slate-600">
                Doctor: {activeAppointment.doctor?.user?.name}
              </p>
              <p className="text-slate-400 mt-1">
                Currently: {activeAppointment.dateString} at {activeAppointment.timeSlot}
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
                {rescheduleLoading ? 'Updating slot...' : 'Confirm Reschedule'}
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
              Cancel appointment between patient{' '}
              <strong>{activeAppointment.patient?.name}</strong> and{' '}
              <strong>{activeAppointment.doctor?.user?.name}</strong>?
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Cancellation Reason:
              </label>
              <textarea
                rows="3"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Administrative reason..."
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

export default AdminAppointments;
