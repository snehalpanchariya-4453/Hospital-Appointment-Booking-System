import React, { useState, useEffect } from 'react';
import { doctorService, departmentService, adminService } from '../../services/api';
import {
  Stethoscope,
  Plus,
  Search,
  Trash2,
  Edit,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Star,
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { handleImageError } from '../../utils/avatar';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Add Doctor Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    departmentId: '',
    specialization: '',
    qualification: '',
    experienceYears: 5,
    consultationFee: 70,
    roomNumber: 'OPD-101',
    bio: '',
  });
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [alertSuccess, setAlertSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [docRes, deptRes] = await Promise.all([
        doctorService.getDoctors(),
        departmentService.getDepartments({ status: 'active' }),
      ]);
      if (docRes.data?.success) setDoctors(docRes.data.data);
      if (deptRes.data?.success) setDepartments(deptRes.data.data);
    } catch (err) {
      console.error('Failed to load doctors list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    setModalError('');

    if (
      !newDoctorData.name ||
      !newDoctorData.email ||
      !newDoctorData.password ||
      !newDoctorData.departmentId ||
      !newDoctorData.specialization ||
      !newDoctorData.qualification
    ) {
      setModalError('Please complete all required fields (*)');
      return;
    }

    setModalSubmitting(true);
    try {
      const res = await adminService.createDoctor(newDoctorData);
      if (res.data?.success) {
        setAddModalOpen(false);
        setNewDoctorData({
          name: '',
          email: '',
          password: '',
          phone: '',
          departmentId: '',
          specialization: '',
          qualification: '',
          experienceYears: 5,
          consultationFee: 70,
          roomNumber: 'OPD-101',
          bio: '',
        });
        setAlertSuccess('New doctor created and credentials generated successfully.');
        setTimeout(() => setAlertSuccess(''), 4000);
        fetchData();
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create doctor');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove Dr. ${name}? This will delete the doctor account.`)) {
      return;
    }

    try {
      const res = await adminService.deleteDoctor(id);
      if (res.data?.success) {
        setAlertSuccess(`Doctor Dr. ${name} deleted.`);
        setTimeout(() => setAlertSuccess(''), 4000);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete doctor');
    }
  };

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(search.toLowerCase()) ||
      doc.department?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Loading doctors list..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Staff Management
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            Manage Hospital Doctors
          </h1>
          <p className="text-xs text-slate-500">
            View, onboard, configure, or retire specialist doctor accounts
          </p>
        </div>

        <button
          onClick={() => {
            setModalError('');
            setAddModalOpen(true);
          }}
          className="gradient-pink-btn px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-soft-pink flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {alertSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center shadow-xs">
          <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />
          <span>{alertSuccess}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter doctors by name, specialty, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-brand-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 shadow-2xs"
        />
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-3xl border border-brand-100 shadow-soft-pink overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-50/60 border-b border-brand-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Doctor</th>
                <th className="p-4">Department</th>
                <th className="p-4">Specialization</th>
                <th className="p-4">Fee ($)</th>
                <th className="p-4">Room</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No doctors matching "{search}".
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-brand-50/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-brand-100 flex-shrink-0">
                          <img
                            src={
                              doc.user?.avatar ||
                              'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150'
                            }
                            alt=""
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{doc.user?.name}</p>
                          <p className="text-[11px] text-slate-400">{doc.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-brand-600">
                      {doc.department?.name || 'Department'}
                    </td>
                    <td className="p-4 text-slate-700 font-medium">
                      {doc.specialization}
                      <span className="block text-[11px] text-slate-400">
                        {doc.qualification} • {doc.experienceYears}y exp
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">${doc.consultationFee}</td>
                    <td className="p-4 text-slate-600 font-medium">{doc.roomNumber || 'OPD'}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 mr-1" />
                        {doc.rating || 4.8}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteDoctor(doc._id, doc.user?.name)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete Doctor Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Onboard New Specialist Doctor"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateDoctor} className="space-y-4">
          {modalError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newDoctorData.name}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, name: e.target.value })}
                placeholder="Dr. Samantha Clark"
                className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Login Email *
              </label>
              <input
                type="email"
                required
                value={newDoctorData.email}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, email: e.target.value })}
                placeholder="samantha.clark@blossomhospital.com"
                className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={newDoctorData.password}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Department *
              </label>
              <select
                required
                value={newDoctorData.departmentId}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, departmentId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20 font-medium"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Specialization *
              </label>
              <input
                type="text"
                required
                value={newDoctorData.specialization}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, specialization: e.target.value })}
                placeholder="e.g. Pediatric Surgery"
                className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Qualifications *
              </label>
              <input
                type="text"
                required
                value={newDoctorData.qualification}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, qualification: e.target.value })}
                placeholder="MBBS, MD, MS"
                className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                value={newDoctorData.experienceYears}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, experienceYears: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Fee ($)
              </label>
              <input
                type="number"
                min="0"
                value={newDoctorData.consultationFee}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, consultationFee: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Room No.
              </label>
              <input
                type="text"
                value={newDoctorData.roomNumber}
                onChange={(e) => setNewDoctorData({ ...newDoctorData, roomNumber: e.target.value })}
                placeholder="OPD-302"
                className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Short Professional Bio
            </label>
            <textarea
              rows="2"
              value={newDoctorData.bio}
              onChange={(e) => setNewDoctorData({ ...newDoctorData, bio: e.target.value })}
              placeholder="Clinical experience, background, focus areas..."
              className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs bg-brand-50/20"
            ></textarea>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-brand-100">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modalSubmitting}
              className="gradient-pink-btn px-6 py-2 text-xs font-bold rounded-xl shadow-soft-pink"
            >
              {modalSubmitting ? 'Creating Doctor...' : 'Onboard Doctor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDoctors;
