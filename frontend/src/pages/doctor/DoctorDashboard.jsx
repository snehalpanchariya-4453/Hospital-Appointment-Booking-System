import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doctorService, appointmentService } from '../../services/api';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Stethoscope,
  AlertCircle,
  FileText,
  Activity,
  ArrowRight,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/dashboard/StatCard';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import Modal from '../../components/common/Modal';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Notes Modal
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchData = async () => {
    try {
      const [profRes, aptRes] = await Promise.all([
        doctorService.getMyProfile(),
        appointmentService.getAppointments(),
      ]);

      if (profRes.data?.success) setProfile(profRes.data.data);
      if (aptRes.data?.success) setAppointments(aptRes.data.data);
    } catch (err) {
      console.error('Failed to load doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const todayAppointments = appointments.filter((a) => a.dateString === todayStr);
  const pendingAppointments = appointments.filter((a) => a.status === 'Pending');
  const confirmedAppointments = appointments.filter((a) => a.status === 'Confirmed');
  const completedAppointments = appointments.filter((a) => a.status === 'Completed');

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await appointmentService.updateStatus(id, { status });
      if (res.data?.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update appointment status:', err);
    }
  };

  const handleOpenNotes = (apt) => {
    setActiveAppointment(apt);
    setDoctorNotes(apt.doctorNotes || '');
    setPrescription(apt.prescription || '');
    setNotesModalOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!activeAppointment) return;
    setSavingNotes(true);
    try {
      const res = await appointmentService.updateStatus(activeAppointment._id, {
        doctorNotes,
        prescription,
      });
      if (res.data?.success) {
        setNotesModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!profile) return;
    try {
      const newAvail = !profile.isAvailable;
      const res = await doctorService.updateAvailability({
        isAvailable: newAvail,
      });
      if (res.data?.success) {
        setProfile({ ...profile, isAvailable: newAvail });
      }
    } catch (err) {
      console.error('Toggle availability failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Loading doctor dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-brand-100/80 via-white to-blue-50 p-8 rounded-3xl border border-brand-200 shadow-soft-pink flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Doctor Schedule & OPD
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Room {profile?.roomNumber || 'OPD-101'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            Hello, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {profile?.specialization} • Department of {profile?.department?.name || 'Medicine'}
          </p>
        </div>

        {/* Quick availability toggle button */}
        <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-brand-200 shadow-2xs">
          <div className="text-right">
            <span className="block text-[11px] font-bold text-slate-400 uppercase">
              Accepting Patients
            </span>
            <span
              className={`text-xs font-extrabold ${
                profile?.isAvailable ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {profile?.isAvailable ? 'ONLINE / AVAILABLE' : 'OFFLINE / PAUSED'}
            </span>
          </div>
          <button
            onClick={handleToggleAvailability}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              profile?.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                profile?.isAvailable ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon={Calendar}
          color="pink"
          subtitle="Scheduled for today"
        />
        <StatCard
          title="Pending Requests"
          value={pendingAppointments.length}
          icon={Clock}
          color="amber"
          subtitle="Awaiting confirmation"
        />
        <StatCard
          title="Confirmed"
          value={confirmedAppointments.length}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Confirmed bookings"
        />
        <StatCard
          title="Completed Total"
          value={completedAppointments.length}
          icon={Users}
          color="blue"
          subtitle="Consulted patients"
        />
      </div>

      {/* Today's Schedule */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Today's Patients Queue ({todayAppointments.length})
            </h2>
            <p className="text-xs text-slate-500">
              Appointments scheduled for {todayStr}
            </p>
          </div>
          <Link
            to="/doctor/appointments"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center"
          >
            <span>All Appointments ({appointments.length})</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-brand-100 text-center space-y-3 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No appointments for today</h4>
            <p className="text-xs text-slate-400">
              You are all caught up for today! Check upcoming days in your schedule.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayAppointments.map((apt) => (
              <AppointmentCard
                key={apt._id}
                appointment={apt}
                role="doctor"
                onUpdateStatus={handleUpdateStatus}
                onViewNotes={handleOpenNotes}
                onCancel={(a) => handleUpdateStatus(a._id, 'Cancelled')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Notes & Prescription Modal */}
      <Modal
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        title="Doctor Consultation & Notes"
        maxWidth="max-w-lg"
      >
        {activeAppointment && (
          <div className="space-y-4">
            <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100 text-xs">
              <p className="font-bold text-slate-800">
                Patient: {activeAppointment.patient?.name}
              </p>
              <p className="text-slate-500">
                Reason: {activeAppointment.reason}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Clinical Diagnosis & Observations:
              </label>
              <textarea
                rows="3"
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Doctor clinical findings, diagnosis, vitals..."
                className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Prescription (Rx) & Medications:
              </label>
              <textarea
                rows="3"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Medication names, dosage, duration (e.g. Paracetamol 500mg TDS x 5 days)..."
                className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
              ></textarea>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setNotesModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                disabled={savingNotes}
                onClick={handleSaveNotes}
                className="gradient-pink-btn px-6 py-2 text-xs font-bold rounded-xl shadow-soft-pink"
              >
                {savingNotes ? 'Saving...' : 'Save Consultation Record'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
