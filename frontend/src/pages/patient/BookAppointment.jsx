import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { departmentService, doctorService, appointmentService } from '../../services/api';
import {
  Calendar,
  Clock,
  User,
  Heart,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SlotPicker from '../../components/appointments/SlotPicker';
import Modal from '../../components/common/Modal';
import { handleImageError } from '../../utils/avatar';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctor');

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(preselectedDoctorId || '');

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState('');

  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Fetch departments and doctors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          departmentService.getDepartments({ status: 'active' }),
          doctorService.getDoctors({ isAvailable: true }),
        ]);

        if (deptRes.data?.success) setDepartments(deptRes.data.data);
        if (docRes.data?.success) {
          setDoctors(docRes.data.data);

          // If a preselected doctor was given, also set their department
          if (preselectedDoctorId) {
            const found = docRes.data.data.find((d) => d._id === preselectedDoctorId);
            if (found && found.department) {
              setSelectedDept(found.department._id || found.department);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load booking dependencies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [preselectedDoctorId]);

  // Filter doctors by selected department if chosen
  const filteredDoctors = selectedDept
    ? doctors.filter((doc) => doc.department && (doc.department._id === selectedDept || doc.department === selectedDept))
    : doctors;

  // Currently selected doctor object
  const currentDoctor = doctors.find((doc) => doc._id === selectedDoctorId);

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedDoctorId) {
      setErrorMessage('Please select a doctor for your consultation.');
      return;
    }
    if (!selectedDate) {
      setErrorMessage('Please choose an appointment date.');
      return;
    }
    if (!selectedSlot) {
      setErrorMessage('Please pick an available time slot.');
      return;
    }
    if (!reason.trim()) {
      setErrorMessage('Please state the primary reason for your visit.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await appointmentService.bookAppointment({
        doctorId: selectedDoctorId,
        appointmentDate: selectedDate,
        dateString: selectedDate,
        timeSlot: selectedSlot,
        reason: reason.trim(),
        symptoms: symptoms.trim(),
      });

      if (res.data?.success) {
        setBookedAppointment(res.data.data);
        setSuccessModalOpen(true);
      }
    } catch (err) {
      console.error('Booking error:', err);
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to book appointment. The slot may have just been taken (double booking prevented).'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Loading booking engine..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
          Online Appointment System
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Book Your Medical Appointment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Select your specialist, date, and verified real-time slot with double-booking prevention.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center shadow-xs">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitBooking} className="space-y-8">
        {/* Step 1: Department & Doctor */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-100 shadow-soft-pink space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-brand-50">
            <div className="w-7 h-7 rounded-lg bg-brand-500 text-white font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Select Department & Doctor
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Hospital Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setSelectedDoctorId('');
                  setSelectedSlot('');
                }}
                className="w-full px-4 py-3 rounded-2xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm font-medium bg-brand-50/20"
              >
                <option value="">All Clinical Departments</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Choose Doctor *
              </label>
              <select
                required
                value={selectedDoctorId}
                onChange={(e) => {
                  setSelectedDoctorId(e.target.value);
                  setSelectedSlot('');
                }}
                className="w-full px-4 py-3 rounded-2xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm font-medium bg-brand-50/20"
              >
                <option value="">Select an available doctor...</option>
                {filteredDoctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.user?.name} — {doc.specialization} (${doc.consultationFee})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Doctor Summary */}
          {currentDoctor && (
            <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-100 flex-shrink-0">
                  <img
                    src={
                      currentDoctor.user?.avatar ||
                      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
                    }
                    alt={currentDoctor.user?.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{currentDoctor.user?.name}</h4>
                  <p className="text-brand-600 font-semibold">{currentDoctor.specialization}</p>
                  <p className="text-slate-400">
                    Room: {currentDoctor.roomNumber} • Experience: {currentDoctor.experienceYears} Years
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Consultation Fee</span>
                <span className="text-lg font-extrabold text-brand-600">
                  ${currentDoctor.consultationFee}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Date & Available Slots */}
        {selectedDoctorId ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 px-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Pick Date & Slot (Double-Booking Protected)
              </h3>
            </div>

            <SlotPicker
              doctorId={selectedDoctorId}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              selectedSlot={selectedSlot}
              onSlotSelect={setSelectedSlot}
            />
          </div>
        ) : (
          <div className="p-8 bg-white rounded-3xl border border-brand-100 text-center text-xs text-slate-400">
            Please select a doctor first to load real-time availability slots.
          </div>
        )}

        {/* Step 3: Medical Notes */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-100 shadow-soft-pink space-y-5">
          <div className="flex items-center space-x-2 pb-4 border-b border-brand-50">
            <div className="w-7 h-7 rounded-lg bg-brand-500 text-white font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Reason for Visit & Symptoms
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Primary Reason for Appointment *
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Annual cardiac review, rash checkup, persistent headache..."
              className="w-full px-4 py-3 rounded-2xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm bg-brand-50/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Current Symptoms or Notes (Optional)
            </label>
            <textarea
              rows="3"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe any symptoms, duration, current medications, or notes for the doctor..."
              className="w-full px-4 py-3 rounded-2xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm bg-brand-50/20"
            ></textarea>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-soft-pink flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <p className="flex items-center font-bold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-500 mr-1.5" />
              Guaranteed No Double-Booking
            </p>
            <p>Your selected slot is locked exclusively for your consultation.</p>
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedDoctorId || !selectedSlot}
            className="gradient-pink-btn w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm shadow-soft-pink flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Confirming Appointment...' : 'Confirm & Book Appointment'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Booking Confirmation Receipt Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          navigate('/patient/appointments');
        }}
        title="Appointment Confirmed!"
        maxWidth="max-w-md"
      >
        {bookedAppointment && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">
                You're Scheduled!
              </h4>
              <p className="text-xs text-slate-500">
                A confirmation has been recorded in the hospital management database.
              </p>
            </div>

            <div className="p-4 bg-brand-50/80 rounded-2xl border border-brand-100 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Doctor:</span>
                <span className="font-bold text-slate-800">
                  {bookedAppointment.doctor?.user?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Department:</span>
                <span className="font-bold text-brand-600">
                  {bookedAppointment.doctor?.department?.name || 'Department'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Date & Time:</span>
                <span className="font-bold text-slate-800">
                  {bookedAppointment.dateString} at {bookedAppointment.timeSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Location:</span>
                <span className="font-bold text-slate-800">
                  Room {bookedAppointment.doctor?.roomNumber || 'OPD-101'}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-brand-200">
                <span className="text-slate-500 font-semibold">Consultation Fee:</span>
                <span className="font-bold text-brand-700">${bookedAppointment.fee}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  setSuccessModalOpen(false);
                  navigate('/patient/appointments');
                }}
                className="gradient-pink-btn w-full py-3 rounded-xl font-bold text-xs"
              >
                View My Appointments
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookAppointment;
