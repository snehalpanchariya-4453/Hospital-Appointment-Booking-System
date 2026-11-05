import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { User, Phone, MapPin, Heart, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const PatientProfile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    gender: user?.gender || 'prefer_not_to_say',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
    bloodGroup: user?.bloodGroup || '',
    address: user?.address || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await authService.updateProfile(formData);
      if (res.data?.success) {
        updateUser(res.data.user);
        setSuccessMsg('Your profile details have been successfully updated.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Personal Information
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
          Patient Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Ensure your contact details and medical blood group are accurate for clinical records.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center shadow-xs">
          <CheckCircle2 className="w-5 h-5 mr-2.5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center shadow-xs">
          <AlertCircle className="w-5 h-5 mr-2.5 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-100 shadow-soft-pink space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Legal Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address (Login ID)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Contact Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="prefer_not_to_say">Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Blood Group
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Permanent Address
          </label>
          <textarea
            rows="2"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20 focus:outline-none focus:ring-2 focus:ring-brand-400"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-brand-100 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="gradient-pink-btn px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-soft-pink flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving changes...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfile;
