import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { departmentService, doctorService } from '../services/api';
import {
  Heart,
  Calendar,
  Users,
  Award,
  Clock,
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  Activity,
  Brain,
  Baby,
  Bone,
  Stethoscope,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { handleImageError } from '../utils/avatar';

const Home = () => {
  const { quickDemoLogin, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Dynamic Lucide icon helper
  const getDeptIcon = (iconName) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-6 h-6 text-brand-500" />;
      case 'Brain':
        return <Brain className="w-6 h-6 text-brand-500" />;
      case 'Baby':
        return <Baby className="w-6 h-6 text-brand-500" />;
      case 'Bone':
        return <Bone className="w-6 h-6 text-brand-500" />;
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-brand-500" />;
      default:
        return <Activity className="w-6 h-6 text-brand-500" />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          departmentService.getDepartments({ status: 'active' }),
          doctorService.getDoctors({ isAvailable: true }),
        ]);

        if (deptRes.data?.success) setDepartments(deptRes.data.data);
        if (docRes.data?.success) setFeaturedDoctors(docRes.data.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/doctors?search=${encodeURIComponent(searchQuery)}&department=${selectedDeptFilter}`);
  };

  const handleDemoLogin = async (roleName) => {
    await quickDemoLogin(roleName);
    if (roleName === 'admin') navigate('/admin');
    else if (roleName === 'doctor') navigate('/doctor');
    else navigate('/patient');
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Quick 1-Click Demo Bar */}
      <div className="bg-brand-50/90 border-b border-brand-100 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs text-brand-800 gap-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-600 animate-bounce" />
            <span className="font-bold">Pair Programming Demo Helpers:</span>
            <span className="text-slate-600 hidden sm:inline">
              Test all 3 MERN Stack roles with one click:
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDemoLogin('patient')}
              className="px-3 py-1 bg-white hover:bg-brand-100 font-bold text-brand-700 rounded-lg border border-brand-200 transition-colors shadow-2xs"
            >
              🧑 Patient Demo
            </button>
            <button
              onClick={() => handleDemoLogin('doctor')}
              className="px-3 py-1 bg-white hover:bg-blue-100 font-bold text-blue-700 rounded-lg border border-blue-200 transition-colors shadow-2xs"
            >
              🩺 Doctor Demo
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="px-3 py-1 bg-white hover:bg-purple-100 font-bold text-purple-700 rounded-lg border border-purple-200 transition-colors shadow-2xs"
            >
              👑 Admin Demo
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-brand-500 text-brand-500" />
                <span>Modern Healthcare & Patient Wellness</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Gentle Care,{' '}
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-rose-400 bg-clip-text text-transparent">
                  Exceptional
                </span>{' '}
                Medicine.
              </h1>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Welcome to Blossom Health System. Seamlessly explore our medical departments, book instant appointment slots with top board-certified doctors, and manage healthcare with ease.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/patient/book"
                  className="gradient-pink-btn px-6 py-3.5 rounded-2xl text-base font-bold flex items-center space-x-2 shadow-soft-pink"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book an Appointment</span>
                </Link>

                <Link
                  to="/doctors"
                  className="px-6 py-3.5 rounded-2xl text-base font-bold bg-white text-slate-800 border border-brand-200 hover:bg-brand-50/60 transition-colors shadow-sm flex items-center space-x-2"
                >
                  <Search className="w-5 h-5 text-brand-500" />
                  <span>Find Doctors</span>
                </Link>
              </div>

              {/* Mini Stats Ribbon */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-brand-100 max-w-lg">
                <div>
                  <h4 className="text-2xl font-extrabold text-slate-800">50+</h4>
                  <p className="text-xs font-medium text-slate-500">Board Specialists</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-brand-600">100%</h4>
                  <p className="text-xs font-medium text-slate-500">Double-Booking Safe</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-slate-800">24/7</h4>
                  <p className="text-xs font-medium text-slate-500">Emergency Care</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-200 to-brand-100 rounded-3xl blur-2xl opacity-60 -z-10" />
                <div className="bg-white rounded-3xl border border-brand-100 p-6 shadow-soft-pink overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600"
                    alt="Blossom Hospital Medical Team"
                    className="w-full h-72 object-cover rounded-2xl shadow-sm"
                  />
                  
                  {/* Floating card 1 */}
                  <div className="mt-4 p-3.5 bg-brand-50/70 rounded-2xl border border-brand-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Instant Online Slots</p>
                        <p className="text-[11px] text-slate-500">Zero wait-time booking</p>
                      </div>
                    </div>
                    <Link
                      to="/patient/book"
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center"
                    >
                      Book <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search & Filter Doctor Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white p-4 sm:p-5 rounded-3xl border border-brand-200 shadow-soft-pink flex flex-col md:flex-row items-center gap-3"
        >
          <div className="flex-1 w-full relative">
            <Search className="w-5 h-5 text-brand-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctor by name or specialization (e.g. Cardiologist)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-brand-50/30 border border-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm font-medium text-slate-800"
            />
          </div>

          <div className="w-full md:w-64">
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-brand-50/30 border border-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm font-medium text-slate-800"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="gradient-pink-btn w-full md:w-auto px-8 py-3 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </section>

      {/* Departments Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              Specialized Care
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Hospital Departments
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              State-of-the-art diagnostic facilities staffed with world-class medical specialists
            </p>
          </div>
          <Link
            to="/departments"
            className="mt-4 sm:mt-0 text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center group"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading departments..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.slice(0, 6).map((dept) => (
              <Link
                key={dept._id}
                to={`/doctors?department=${dept._id}`}
                className="group bg-white p-6 rounded-3xl border border-brand-100 hover:border-brand-300 shadow-soft-pink hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-100 transition-all duration-200">
                    {getDeptIcon(dept.icon)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mt-4 group-hover:text-brand-600 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-brand-50 flex items-center justify-between text-xs font-semibold">
                  <span className="text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                    {dept.doctorCount || 0} Doctors Available
                  </span>
                  <span className="text-slate-400 group-hover:text-brand-600 flex items-center">
                    Browse <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              Expert Faculty
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Featured Specialist Doctors
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Book consultations with experienced medical practitioners
            </p>
          </div>
          <Link
            to="/doctors"
            className="mt-4 sm:mt-0 text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center group"
          >
            <span>See All Specialists</span>
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading doctors..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-3xl border border-brand-100 overflow-hidden shadow-soft-pink hover:border-brand-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-brand-50">
                    <img
                      src={
                        doc.user?.avatar ||
                        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
                      }
                      alt={doc.user?.name}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-amber-600 flex items-center shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                      {doc.rating || 4.9}
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                      {doc.department?.name || 'Department'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2">
                      {doc.user?.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {doc.specialization}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {doc.experienceYears} Years Experience • {doc.qualification}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between pb-3 text-xs">
                    <span className="text-slate-500">Consultation Fee</span>
                    <span className="font-extrabold text-brand-600 text-sm">
                      ${doc.consultationFee}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/doctors/${doc._id}`}
                      className="px-3 py-2 rounded-xl text-center text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to={`/patient/book?doctor=${doc._id}`}
                      className="gradient-pink-btn px-3 py-2 rounded-xl text-center text-xs font-bold shadow-2xs"
                    >
                      Book Slot
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Emergency & Support Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-500 via-rose-500 to-brand-600 p-8 sm:p-12 text-white shadow-soft-pink flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest bg-white/20 px-3 py-1 rounded-full">
              24/7 Immediate Response
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Need Immediate Medical Assistance?
            </h3>
            <p className="text-brand-100 text-sm max-w-lg">
              Our trauma center and emergency team are on standby around the clock with rapid ambulance dispatch.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="tel:5559112273"
              className="px-6 py-3.5 bg-white text-brand-600 rounded-2xl font-bold text-sm shadow-md hover:bg-brand-50 transition-colors flex items-center space-x-2"
            >
              <PhoneCall className="w-4 h-4 text-brand-500" />
              <span>Emergency: (555) 911-CARE</span>
            </a>
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-brand-700/50 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm border border-white/20 transition-colors"
            >
              Contact Hospital
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
