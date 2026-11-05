import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { doctorService, departmentService } from '../services/api';
import { Search, Star, Calendar, Clock, DollarSign, Filter, Stethoscope } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { handleImageError } from '../utils/avatar';

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedDept, setSelectedDept] = useState(searchParams.get('department') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          departmentService.getDepartments({ status: 'active' }),
          doctorService.getDoctors({
            department: selectedDept || undefined,
            search: search || undefined,
          }),
        ]);

        if (deptRes.data?.success) setDepartments(deptRes.data.data);
        if (docRes.data?.success) setDoctors(docRes.data.data);
      } catch (err) {
        console.error('Failed to load doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [selectedDept]);

  const handleFilterSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await doctorService.getDoctors({
        department: selectedDept || undefined,
        search: search || undefined,
      });
      if (res.data?.success) {
        setDoctors(res.data.data);
      }
    } catch (err) {
      console.error('Filter failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
          Medical Specialists
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">
          Find Your Healthcare Specialist
        </h1>
        <p className="text-sm text-slate-500">
          Search our team of experienced doctors across all medical fields
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-brand-100 shadow-soft-pink max-w-4xl mx-auto">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-brand-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-brand-50/20 border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-brand-50/20 border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm font-medium text-slate-800"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="gradient-pink-btn w-full py-3 rounded-2xl font-bold text-sm"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <LoadingSpinner message="Searching doctors..." />
      ) : doctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-brand-100 max-w-lg mx-auto p-8 shadow-sm">
          <Stethoscope className="w-12 h-12 text-brand-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No doctors found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or department filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedDept('');
              handleFilterSubmit();
            }}
            className="mt-4 px-4 py-2 bg-brand-50 text-brand-700 text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-3xl border border-brand-100 overflow-hidden shadow-soft-pink hover:border-brand-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 bg-brand-50">
                  <img
                    src={
                      doc.user?.avatar ||
                      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
                    }
                    alt={doc.user?.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-amber-600 flex items-center shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                    {doc.rating || 4.9}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl text-xs font-bold text-brand-700 shadow-xs">
                    {doc.department?.name || 'Department'}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    {doc.user?.name}
                  </h3>
                  <p className="text-sm text-brand-500 font-semibold mt-0.5">
                    {doc.specialization}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {doc.bio || `${doc.qualification} with ${doc.experienceYears} years of medical experience.`}
                  </p>

                  <div className="mt-4 pt-4 border-t border-brand-50 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>
                      <span className="block font-bold text-slate-700">Experience</span>
                      <span>{doc.experienceYears} Years</span>
                    </div>
                    <div>
                      <span className="block font-bold text-slate-700">Room</span>
                      <span>{doc.roomNumber || 'OPD'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="flex items-center justify-between pb-3 text-xs">
                  <span className="text-slate-500">Consultation Fee</span>
                  <span className="font-extrabold text-brand-600 text-base">
                    ${doc.consultationFee}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/doctors/${doc._id}`}
                    className="px-4 py-2.5 rounded-xl text-center text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/patient/book?doctor=${doc._id}`}
                    className="gradient-pink-btn px-4 py-2.5 rounded-xl text-center text-xs font-bold shadow-soft-pink"
                  >
                    Book Slot
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
