import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/api';
import { Calendar, Search, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import Modal from '../../components/common/Modal';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filterTab, setFilterTab] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Notes Modal state
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

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

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await appointmentService.updateStatus(id, { status });
      if (res.data?.success) {
        fetchAppointments();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
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
        fetchAppointments();
      }
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesTab =
      filterTab === 'All' ||
      (filterTab === 'Upcoming' && (apt.status === 'Confirmed' || apt.status === 'Pending')) ||
      (filterTab === 'Completed' && apt.status === 'Completed') ||
      (filterTab === 'Cancelled' && apt.status === 'Cancelled');

    const matchesSearch =
      !search ||
      apt.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      apt.reason?.toLowerCase().includes(search.toLowerCase()) ||
      apt.dateString?.includes(search);

    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Loading appointment schedule..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Patient Consultations
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
          Doctor Schedule & Patient List
        </h1>
        <p className="text-xs text-slate-500">
          Review booked appointments, confirm slots, mark visits as completed, and record prescriptions.
        </p>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 border-b border-brand-100 pb-2 w-full sm:w-auto overflow-x-auto">
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
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient, reason, date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-brand-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
      </div>

      {/* Appointments Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-brand-100 text-center space-y-3 max-w-md mx-auto shadow-sm">
          <Calendar className="w-12 h-12 text-brand-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No appointments found</h4>
          <p className="text-xs text-slate-400">
            No consultations matching your current filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((apt) => (
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

      {/* Notes Modal */}
      <Modal
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        title="Consultation Record & Prescription"
        maxWidth="max-w-lg"
      >
        {activeAppointment && (
          <div className="space-y-4">
            <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100 text-xs">
              <p className="font-bold text-slate-800">
                Patient: {activeAppointment.patient?.name}
              </p>
              <p className="text-slate-500">
                Date: {activeAppointment.dateString} at {activeAppointment.timeSlot}
              </p>
              <p className="text-slate-500">
                Chief Complaint: {activeAppointment.reason}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Clinical Diagnosis:
              </label>
              <textarea
                rows="3"
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Enter diagnosis, findings, follow-up advice..."
                className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Prescription (Rx):
              </label>
              <textarea
                rows="3"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Medication names, dosage, schedule..."
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
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorAppointments;
