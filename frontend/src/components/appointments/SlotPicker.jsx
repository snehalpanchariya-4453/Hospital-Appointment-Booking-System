import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/api';
import { Clock, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const SlotPicker = ({ doctorId, selectedDate, onDateChange, selectedSlot, onSlotSelect }) => {
  const [loading, setLoading] = useState(false);
  const [slotsData, setSlotsData] = useState(null);
  const [error, setError] = useState(null);

  // Default to today if no date passed
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!doctorId || !selectedDate) return;

    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await appointmentService.getAvailableSlots(doctorId, selectedDate);
        if (res.data && res.data.success) {
          setSlotsData(res.data);
          // If current selected slot is booked on new date, unselect it
          const matchingSlot = res.data.slots.find((s) => s.timeSlot === selectedSlot);
          if (matchingSlot && matchingSlot.isBooked) {
            onSlotSelect('');
          }
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
        setError(err.response?.data?.message || 'Failed to load slots for this date');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [doctorId, selectedDate]);

  return (
    <div className="space-y-5 bg-white p-6 rounded-2xl border border-brand-100 shadow-soft-pink">
      {/* Date Picker Header */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
          <Calendar className="w-4 h-4 text-brand-500 mr-2" />
          Choose Appointment Date
        </label>
        <input
          type="date"
          min={todayStr}
          value={selectedDate || todayStr}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-brand-50/20 text-slate-800 font-medium"
        />
      </div>

      {/* Slots Section */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
          <span className="flex items-center">
            <Clock className="w-4 h-4 text-brand-500 mr-2" />
            Select Available Time Slot
          </span>
          {slotsData && slotsData.isWorkingDay && (
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
              {slotsData.availableSlotsCount} of {slotsData.totalSlots} Slots Free
            </span>
          )}
        </label>

        {loading ? (
          <div className="py-6">
            <LoadingSpinner size="small" message="Checking live slot availability..." />
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : slotsData && !slotsData.isWorkingDay ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Doctor Not Available on {slotsData.dayName}s</p>
              <p className="text-xs mt-1 text-amber-700">{slotsData.message}</p>
            </div>
          </div>
        ) : slotsData && slotsData.slots && slotsData.slots.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {slotsData.slots.map((slotItem) => {
              const isSelected = selectedSlot === slotItem.timeSlot;
              const isBooked = slotItem.isBooked;

              if (isBooked) {
                return (
                  <button
                    key={slotItem.timeSlot}
                    type="button"
                    disabled
                    className="p-3 text-xs font-semibold rounded-xl bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex flex-col items-center justify-center opacity-60"
                    title="This slot is already booked. Double booking prevented."
                  >
                    <span className="line-through">{slotItem.timeSlot}</span>
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mt-0.5">
                      Booked
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={slotItem.timeSlot}
                  type="button"
                  onClick={() => onSlotSelect(slotItem.timeSlot)}
                  className={`p-3 text-xs font-semibold rounded-xl border transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-500 to-brand-400 text-white border-brand-500 shadow-soft-pink scale-102 ring-2 ring-brand-300'
                      : 'bg-white text-slate-700 border-brand-100 hover:border-brand-300 hover:bg-brand-50/40'
                  }`}
                >
                  <span className="font-bold">{slotItem.timeSlot}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-white' : 'text-emerald-600'} flex items-center mt-0.5`}>
                    <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                    Available
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">
            Select a doctor and date to view available appointment slots.
          </p>
        )}
      </div>
    </div>
  );
};

export default SlotPicker;
