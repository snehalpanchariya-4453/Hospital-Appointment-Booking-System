import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Users, Search, UserCheck, UserX, Phone, Mail, Calendar, Heart } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const res = await adminService.getPatients();
      if (res.data?.success) {
        setPatients(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await adminService.toggleUserStatus(id);
      if (res.data?.success) {
        fetchPatients();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle patient status');
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Loading patient records..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Hospital Registry
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
          Registered Patients ({patients.length})
        </h1>
        <p className="text-xs text-slate-500">
          Manage patient accounts, medical blood groups, and login access.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by patient name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-brand-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 shadow-2xs"
        />
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-3xl border border-brand-100 shadow-soft-pink overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-50/60 border-b border-brand-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Patient Name</th>
                <th className="p-4">Contact & Email</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No patients found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p._id} className="hover:bg-brand-50/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold flex-shrink-0">
                          {p.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <p className="text-[11px] text-slate-400">{p.address || 'No address saved'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="block font-semibold text-slate-700">{p.email}</span>
                      <span className="text-[11px] text-slate-400">{p.phone || 'No phone'}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                        {p.bloodGroup || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4 capitalize text-slate-600 font-medium">
                      {p.gender || 'Not set'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(p._id, p.status)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                          p.status === 'active'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {p.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPatients;
