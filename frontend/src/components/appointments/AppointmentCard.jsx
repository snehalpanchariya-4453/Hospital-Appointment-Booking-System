import React from 'react';
import { Calendar, Clock, MapPin, User, Stethoscope, FileText, AlertTriangle } from 'lucide-react';

const AppointmentCard = ({
  appointment,
  role = 'patient',
  onReschedule,
  onCancel,
  onUpdateStatus,
  onViewNotes,
}) => {
  const {
    _id,
    patient,
    doctor,
    department,
    dateString,
    timeSlot,
    reason,
    symptoms,
    status,
    fee,
    doctorNotes,
    prescription,
    cancellationReason,
  } = appointment;

  const statusStyles = {
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Completed: 'bg-blue-100 text-blue-800 border-blue-200',
    Cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
    Rescheduled: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const isPast = new Date(dateString) < new Date(new Date().toISOString().split('T')[0]);

  return (
    <div className="bg-white rounded-2xl border border-brand-100 p-5 shadow-soft-pink hover:border-brand-200 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Date/Time & Status */}
        <div className="flex items-start justify-between pb-3 border-b border-brand-50">
          <div className="space-y-1">
            <div className="flex items-center text-xs font-bold text-slate-700 space-x-3">
              <span className="flex items-center text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                {dateString}
              </span>
              <span className="flex items-center text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {timeSlot}
              </span>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              statusStyles[status] || 'bg-slate-100 text-slate-700'
            }`}
          >
            {status}
          </span>
        </div>

        {/* Doctor & Patient Info */}
        <div className="py-4 space-y-3">
          {role === 'patient' ? (
            /* Patient views Doctor info */
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {doctor?.user?.name ? doctor.user.name.charAt(0) : 'D'}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">
                  {doctor?.user?.name || 'Assigned Specialist'}
                </h4>
                <p className="text-xs text-brand-500 font-semibold">
                  {doctor?.specialization || department?.name || 'Department Specialist'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Room: {doctor?.roomNumber || 'OPD'}
                </p>
              </div>
            </div>
          ) : (
            /* Doctor / Admin views Patient info */
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {patient?.name ? patient.name.charAt(0) : 'P'}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">
                  {patient?.name || 'Patient'}
                </h4>
                <p className="text-xs text-slate-500">
                  {patient?.phone || patient?.email || 'No contact provided'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Blood Group: {patient?.bloodGroup || 'Not set'} • Gender: {patient?.gender || 'N/A'}
                </p>
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="bg-brand-50/40 p-3 rounded-xl border border-brand-100/60">
            <p className="text-xs text-slate-500 font-medium">
              <span className="font-bold text-slate-700">Reason: </span>
              {reason}
            </p>
            {symptoms && (
              <p className="text-xs text-slate-500 mt-1">
                <span className="font-bold text-slate-700">Symptoms: </span>
                {symptoms}
              </p>
            )}
          </div>

          {/* Doctor Notes / Prescription preview */}
          {(doctorNotes || prescription) && (
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs">
              <p className="font-bold text-emerald-800 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Doctor Notes & Prescription
              </p>
              {doctorNotes && <p className="text-emerald-700 mt-1">{doctorNotes}</p>}
              {prescription && (
                <p className="text-emerald-900 mt-1 font-mono text-[11px] bg-white/70 p-1.5 rounded">
                  Rx: {prescription}
                </p>
              )}
            </div>
          )}

          {status === 'Cancelled' && cancellationReason && (
            <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100 text-xs text-rose-700 flex items-start">
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Cancelled Reason:</strong> {cancellationReason}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-brand-50 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700">
          Fee: <span className="text-brand-600">${fee || 50}</span>
        </span>

        <div className="flex items-center space-x-2">
          {/* Patient Actions */}
          {role === 'patient' && status !== 'Cancelled' && status !== 'Completed' && (
            <>
              <button
                onClick={() => onReschedule(appointment)}
                className="px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold rounded-lg border border-brand-200 transition-colors"
              >
                Reschedule
              </button>
              <button
                onClick={() => onCancel(appointment)}
                className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-lg border border-rose-200 transition-colors"
              >
                Cancel
              </button>
            </>
          )}

          {/* Doctor Actions */}
          {role === 'doctor' && status !== 'Cancelled' && (
            <>
              {status === 'Pending' && (
                <button
                  onClick={() => onUpdateStatus(_id, 'Confirmed')}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Confirm
                </button>
              )}
              {status === 'Confirmed' && (
                <button
                  onClick={() => onUpdateStatus(_id, 'Completed')}
                  className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => onViewNotes(appointment)}
                className="px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold rounded-lg border border-brand-200 transition-colors"
              >
                Add Notes
              </button>
              {status !== 'Completed' && (
                <button
                  onClick={() => onCancel(appointment)}
                  className="px-3 py-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </>
          )}

          {/* Admin Actions */}
          {role === 'admin' && status !== 'Cancelled' && (
            <>
              {status !== 'Completed' && (
                <button
                  onClick={() => onCancel(appointment)}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-lg border border-rose-200 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => onReschedule(appointment)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-lg transition-colors"
              >
                Reschedule
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
