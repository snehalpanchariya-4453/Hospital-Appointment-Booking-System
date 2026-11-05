import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import {
  Users,
  Stethoscope,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/dashboard/StatCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Calculating hospital statistics..." />
      </div>
    );
  }

  const {
    totalPatients = 0,
    totalDoctors = 0,
    totalDepartments = 0,
    totalAppointments = 0,
    todayAppointments = 0,
    totalRevenue = 0,
    statusBreakdown = {},
    recentAppointments = [],
  } = stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Administration & Operations
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            Hospital Analytics & Overview
          </h1>
          <p className="text-xs text-slate-500">
            Live hospital metrics, staff counts, department allocations, and revenue
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center space-x-2">
          <Link
            to="/admin/doctors"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-brand-200 hover:bg-brand-50 transition-colors shadow-2xs"
          >
            Manage Doctors
          </Link>
          <Link
            to="/admin/departments"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-brand-200 hover:bg-brand-50 transition-colors shadow-2xs"
          >
            Departments
          </Link>
          <Link
            to="/admin/appointments"
            className="gradient-pink-btn px-4 py-2.5 rounded-xl text-xs font-bold shadow-soft-pink"
          >
            All Appointments
          </Link>
        </div>
      </div>

      {/* Top 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Registered Patients"
          value={totalPatients}
          icon={Users}
          color="pink"
          subtitle="Hospital user base"
        />
        <StatCard
          title="Active Doctors"
          value={totalDoctors}
          icon={Stethoscope}
          color="blue"
          subtitle="Medical faculty"
        />
        <StatCard
          title="Total Appointments"
          value={totalAppointments}
          icon={Calendar}
          color="emerald"
          subtitle={`${todayAppointments} scheduled for today`}
        />
        <StatCard
          title="Estimated Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="amber"
          subtitle="Confirmed consultations"
        />
      </div>

      {/* Appointment Status Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-100 shadow-soft-pink space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center">
          <TrendingUp className="w-5 h-5 text-brand-500 mr-2" />
          Appointment Status Distribution
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
            <span className="block text-2xl font-extrabold text-amber-800">
              {statusBreakdown.Pending || 0}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Pending
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
            <span className="block text-2xl font-extrabold text-emerald-800">
              {statusBreakdown.Confirmed || 0}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Confirmed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
            <span className="block text-2xl font-extrabold text-blue-800">
              {statusBreakdown.Completed || 0}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Completed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-center">
            <span className="block text-2xl font-extrabold text-rose-800">
              {statusBreakdown.Cancelled || 0}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Cancelled
            </span>
          </div>
        </div>
      </div>

      {/* Recent Appointments Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">
            Recent Hospital Bookings
          </h3>
          <Link
            to="/admin/appointments"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center"
          >
            <span>View All Appointments</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-brand-100 shadow-soft-pink overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-50/60 border-b border-brand-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Patient</th>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Date & Slot</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-400">
                      No appointments in the system yet.
                    </td>
                  </tr>
                ) : (
                  recentAppointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-brand-50/30 transition-colors">
                      <td className="p-4 font-bold text-slate-800">
                        {apt.patient?.name || 'Patient'}
                        <span className="block font-normal text-slate-400 text-[11px]">
                          {apt.patient?.email}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">
                        {apt.doctor?.user?.name || 'Doctor'}
                      </td>
                      <td className="p-4 text-brand-600 font-semibold">
                        {apt.doctor?.department?.name || 'Department'}
                      </td>
                      <td className="p-4 text-slate-600">
                        <span className="font-semibold block">{apt.dateString}</span>
                        <span className="text-[11px] text-slate-400">{apt.timeSlot}</span>
                      </td>
                      <td className="p-4 font-bold text-slate-800">${apt.fee}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            apt.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : apt.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
