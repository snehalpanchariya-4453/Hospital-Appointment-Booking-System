import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Lock, Mail, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const redirectByRole = (role) => {
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    if (role === 'admin') navigate('/admin');
    else if (role === 'doctor') navigate('/doctor');
    else navigate('/patient');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide your email and password');
      return;
    }

    setSubmitting(true);
    const result = await login(formData.email, formData.password);
    setSubmitting(false);

    if (result.success) {
      redirectByRole(result.user.role);
    } else {
      setError(result.message);
    }
  };

  const handleDemo = async (roleName) => {
    setSubmitting(true);
    const result = await quickDemoLogin(roleName);
    setSubmitting(false);
    if (result.success) {
      redirectByRole(result.user.role);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-300 mx-auto flex items-center justify-center shadow-soft-pink">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to Blossom Health
          </h2>
          <p className="text-sm text-slate-500">
            Sign in to access your portal and appointments
          </p>
        </div>

        {/* Demo Fast-Login Strip */}
        <div className="bg-brand-50/80 p-4 rounded-2xl border border-brand-200 space-y-2">
          <div className="flex items-center text-xs font-bold text-brand-800">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-500" />
            Quick Demo 1-Click Login:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('patient')}
              className="py-2 text-xs font-bold bg-white text-brand-700 border border-brand-200 rounded-xl hover:bg-brand-100 transition-colors shadow-2xs"
            >
              🧑 Patient
            </button>
            <button
              type="button"
              onClick={() => handleDemo('doctor')}
              className="py-2 text-xs font-bold bg-white text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors shadow-2xs"
            >
              🩺 Doctor
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="py-2 text-xs font-bold bg-white text-purple-700 border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors shadow-2xs"
            >
              👑 Admin
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-3xl border border-brand-100 shadow-soft-pink space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm bg-brand-50/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm bg-brand-50/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="gradient-pink-btn w-full py-3.5 rounded-xl font-bold text-sm shadow-soft-pink flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don’t have a patient account yet?{' '}
              <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
