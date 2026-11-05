import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/api';
import { Clock, Calendar, CheckCircle2, AlertCircle, Save, Shield } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorAvailability = () => {
  const [profile, setProfile] = useState(null);
  const [workingDays, setWorkingDays] = useState([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [duration, setDuration] = useState(30);
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await doctorService.getMyProfile();
        if (res.data?.success) {
          const doc = res.data.data;
          setProfile(doc);
          setWorkingDays(doc.workingDays || []);
          if (doc.workingHours) {
            setStartTime(doc.workingHours.start || '09:00');
            setEndTime(doc.workingHours.end || '17:00');
            setDuration(doc.workingHours.slotDurationMinutes || 30);
          }
          setIsAvailable(doc.isAvailable !== false);
        }
      } catch (err) {
        console.error('Failed to load doctor profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleDayToggle = (day) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (workingDays.length === 0) {
      setErrorMsg('Please select at least one working day.');
      return;
    }

    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await doctorService.updateAvailability({
        isAvailable,
        workingDays,
        workingHours: {
          start: startTime,
          end: endTime,
          slotDurationMinutes: Number(duration),
        },
      });

      if (res.data?.success) {
        setSuccessMsg('Your schedule and slot duration have been successfully updated!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Loading availability schedule..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Practice Settings
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
          Manage Working Hours & Availability
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure which days and hours you accept patient bookings. Patients can only book slots within this window.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center shadow-xs">
          <CheckCircle2 className="w-5 h-5 mr-2.5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center shadow-xs">
          <AlertCircle className="w-5 h-5 mr-2.5 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-100 shadow-soft-pink space-y-8">
        {/* Availability Toggle */}
        <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Active Booking Status
            </h4>
            <p className="text-xs text-slate-500">
              Turn off if taking leave, attending conferences, or pausing new patient bookings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAvailable(!isAvailable)}
            className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                isAvailable ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Working Days */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
            <Calendar className="w-4 h-4 text-brand-500 mr-2" />
            Working Days of the Week
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {allDays.map((day) => {
              const checked = workingDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    checked
                      ? 'bg-brand-500 text-white border-brand-500 shadow-soft-pink ring-2 ring-brand-200'
                      : 'bg-brand-50/20 text-slate-600 border-brand-100 hover:border-brand-300'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Working Hours */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
            <Clock className="w-4 h-4 text-brand-500 mr-2" />
            Working Hours & Consultation Slot Duration
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="block text-xs text-slate-500 font-semibold mb-1">
                Start Time (HH:MM 24h)
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20 font-medium"
              />
            </div>

            <div>
              <span className="block text-xs text-slate-500 font-semibold mb-1">
                End Time (HH:MM 24h)
              </span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20 font-medium"
              />
            </div>

            <div>
              <span className="block text-xs text-slate-500 font-semibold mb-1">
                Slot Duration
              </span>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20 font-medium"
              >
                <option value={15}>15 Minutes</option>
                <option value={20}>20 Minutes</option>
                <option value={30}>30 Minutes (Standard)</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-brand-100 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Slots are dynamically calculated to ensure zero scheduling conflicts.
          </div>
          <button
            type="submit"
            disabled={saving}
            className="gradient-pink-btn px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-soft-pink flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Availability'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorAvailability;
