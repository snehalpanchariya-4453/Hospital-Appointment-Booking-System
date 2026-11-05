import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Stethoscope,
  ShieldAlert,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, role, logout, quickDemoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleDemoSwitch = async (roleName) => {
    setDemoMenuOpen(false);
    setMobileMenuOpen(false);
    await quickDemoLogin(roleName);
    if (roleName === 'admin') navigate('/admin');
    else if (roleName === 'doctor') navigate('/doctor');
    else navigate('/patient');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-brand-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center shadow-soft-pink group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                Blossom<span className="text-slate-800">Health</span>
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-500 -mt-1">
                Hospital & Care
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/')
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/departments"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/departments')
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
              }`}
            >
              Departments
            </Link>
            <Link
              to="/doctors"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/doctors')
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
              }`}
            >
              Doctors
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/about')
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/contact')
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
              }`}
            >
              Contact
            </Link>

            {/* Role Specific Nav items */}
            {isAuthenticated && role === 'patient' && (
              <>
                <Link
                  to="/patient"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/patient')
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/patient/appointments"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/patient/appointments')
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
                  }`}
                >
                  My Appointments
                </Link>
              </>
            )}

            {isAuthenticated && role === 'doctor' && (
              <>
                <Link
                  to="/doctor"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/doctor')
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
                  }`}
                >
                  Doctor Portal
                </Link>
                <Link
                  to="/doctor/appointments"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/doctor/appointments')
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
                  }`}
                >
                  Patients Schedule
                </Link>
                <Link
                  to="/doctor/availability"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/doctor/availability')
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
                  }`}
                >
                  Availability
                </Link>
              </>
            )}

            {isAuthenticated && role === 'admin' && (
              <>
                <Link
                  to="/admin"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/admin')
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
                  }`}
                >
                  Admin Overview
                </Link>
                <Link
                  to="/admin/appointments"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/admin/appointments')
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
                  }`}
                >
                  Appointments
                </Link>
                <Link
                  to="/admin/doctors"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/admin/doctors')
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
                  }`}
                >
                  Doctors
                </Link>
                <Link
                  to="/admin/patients"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/admin/patients')
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50/50'
                  }`}
                >
                  Patients
                </Link>
              </>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Quick Demo Selector */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-full border border-brand-200 transition-colors"
                title="Quickly test as Patient, Doctor, or Admin"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Demo Accounts</span>
                <ChevronDown className="w-3 h-3 text-brand-400" />
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-soft-pink border border-brand-100 py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    1-Click Switch Role
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('patient')}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between"
                  >
                    <span>🧑 Patient (John Doe)</span>
                    <span className="text-[10px] bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded">User</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('doctor')}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between"
                  >
                    <span>🩺 Doctor (Dr. Sarah)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">Doctor</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 flex items-center justify-between"
                  >
                    <span>👑 Hospital Admin</span>
                    <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* Book Appointment CTA (visible for non-doctors) */}
            {role !== 'doctor' && (
              <Link
                to="/patient/book"
                className="gradient-pink-btn px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-soft-pink"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>
            )}

            {/* User Dropdown or Auth Links */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-brand-50 border border-brand-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-bold text-xs uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-pink border border-brand-100 py-2 z-50 animate-in fade-in zoom-in-95"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-brand-50">
                      <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full">
                        {user?.role}
                      </span>
                    </div>

                    {role === 'patient' && (
                      <Link
                        to="/patient/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600"
                      >
                        <User className="w-3.5 h-3.5 mr-2" />
                        My Profile
                      </Link>
                    )}

                    {role === 'doctor' && (
                      <Link
                        to="/doctor/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600"
                      >
                        <Stethoscope className="w-3.5 h-3.5 mr-2" />
                        Doctor Profile
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-brand-300 text-brand-600 hover:bg-brand-50 transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-brand-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          {/* Demo account switchers */}
          <div className="p-3 bg-brand-50/70 rounded-2xl border border-brand-100">
            <div className="text-xs font-bold text-brand-700 flex items-center mb-2">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Quick Demo Login:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleDemoSwitch('patient')}
                className="py-1.5 text-[11px] font-bold bg-white text-brand-700 border border-brand-200 rounded-lg shadow-2xs hover:bg-brand-100"
              >
                Patient
              </button>
              <button
                onClick={() => handleDemoSwitch('doctor')}
                className="py-1.5 text-[11px] font-bold bg-white text-blue-700 border border-blue-200 rounded-lg shadow-2xs hover:bg-blue-50"
              >
                Doctor
              </button>
              <button
                onClick={() => handleDemoSwitch('admin')}
                className="py-1.5 text-[11px] font-bold bg-white text-purple-700 border border-purple-200 rounded-lg shadow-2xs hover:bg-purple-50"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-brand-50"
            >
              Home
            </Link>
            <Link
              to="/departments"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-brand-50"
            >
              Departments
            </Link>
            <Link
              to="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-brand-50"
            >
              Doctors
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-brand-50"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-brand-50"
            >
              Contact
            </Link>

            {/* Role Links */}
            {isAuthenticated && role === 'patient' && (
              <>
                <Link
                  to="/patient"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-brand-600 bg-brand-50"
                >
                  Patient Dashboard
                </Link>
                <Link
                  to="/patient/appointments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-brand-50"
                >
                  My Appointments
                </Link>
              </>
            )}

            {isAuthenticated && role === 'doctor' && (
              <>
                <Link
                  to="/doctor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-brand-600 bg-brand-50"
                >
                  Doctor Dashboard
                </Link>
                <Link
                  to="/doctor/appointments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-brand-50"
                >
                  Appointments Schedule
                </Link>
                <Link
                  to="/doctor/availability"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-brand-50"
                >
                  Manage Availability
                </Link>
              </>
            )}

            {isAuthenticated && role === 'admin' && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-brand-600 bg-brand-50"
                >
                  Admin Overview
                </Link>
                <Link
                  to="/admin/appointments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-brand-50"
                >
                  Manage Appointments
                </Link>
                <Link
                  to="/admin/doctors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-brand-50"
                >
                  Manage Doctors
                </Link>
                <Link
                  to="/admin/patients"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-brand-50"
                >
                  Manage Patients
                </Link>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-brand-100 flex flex-col space-y-2">
            {role !== 'doctor' && (
              <Link
                to="/patient/book"
                onClick={() => setMobileMenuOpen(false)}
                className="gradient-pink-btn w-full py-2.5 rounded-xl text-center text-sm font-semibold"
              >
                Book Appointment
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl text-center text-sm font-semibold text-rose-600 bg-rose-50"
              >
                Sign Out ({user?.name})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-sm font-semibold text-white bg-brand-500 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
