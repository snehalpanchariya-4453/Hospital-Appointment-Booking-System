import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { departmentService } from '../services/api';
import {
  Heart,
  Brain,
  Baby,
  Bone,
  Stethoscope,
  Activity,
  Sparkles,
  Search,
  ArrowRight,
  Shield,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const getDeptIcon = (iconName) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-8 h-8 text-brand-500" />;
      case 'Brain':
        return <Brain className="w-8 h-8 text-brand-500" />;
      case 'Baby':
        return <Baby className="w-8 h-8 text-brand-500" />;
      case 'Bone':
        return <Bone className="w-8 h-8 text-brand-500" />;
      case 'Stethoscope':
        return <Stethoscope className="w-8 h-8 text-brand-500" />;
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-brand-500" />;
      default:
        return <Activity className="w-8 h-8 text-brand-500" />;
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentService.getDepartments();
        if (res.data?.success) {
          setDepartments(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load departments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
          Clinical Excellence
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">
          Hospital Departments & Centers
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Our specialized clinical departments offer comprehensive diagnostics, treatments, and compassionate outpatient care.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-5 h-5 text-brand-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search department or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 shadow-soft-pink text-sm"
        />
      </div>

      {loading ? (
        <LoadingSpinner message="Loading clinical departments..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDepts.map((dept) => (
            <div
              key={dept._id}
              className="bg-white rounded-3xl border border-brand-100 p-8 shadow-soft-pink hover:border-brand-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                  {getDeptIcon(dept.icon)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-5">
                  {dept.name}
                </h3>
                <p className="text-sm text-slate-500 mt-2.5 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-brand-50 flex items-center justify-between">
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg">
                  {dept.doctorCount || 0} Board Specialists
                </span>
                <Link
                  to={`/doctors?department=${dept._id}`}
                  className="gradient-pink-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1"
                >
                  <span>View Doctors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Departments;
