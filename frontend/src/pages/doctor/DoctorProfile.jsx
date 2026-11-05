import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Award, DollarSign, MapPin, CheckCircle2, AlertCircle, Save, User } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialization: '',
    qualification: '',
    experienceYears: 0,
    consultationFee: 50,
    roomNumber: 'OPD-101',
    bio: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await doctorService.getMyProfile();
        if (res.data?.success) {
          const doc = res.data.data;
          setProfile(doc);
          setFormData({
            name: doc.user?.name || '',
            phone: doc.user?.phone || '',
            specialization: doc.specialization || '',
            qualification: doc.qualification || '',
            experienceYears: doc.experienceYears || 0,
            consultationFee: doc.consultationFee || 50,
            roomNumber: doc.roomNumber || 'OPD-101',
            bio: doc.bio || '',
          });
        }
      } catch (err) {
        console.error('Error loading doctor profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await doctorService.updateDoctor(profile._id, formData);
      if (res.data?.success) {
        setSuccessMsg('Your doctor profile has been successfully saved!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update doctor profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Loading doctor profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Faculty Credentials
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
          Doctor Profile & Bio
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Update the profile information shown to prospective patients booking appointments.
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
              Doctor Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Contact Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Clinical Specialization *
            </label>
            <input
              type="text"
              name="specialization"
              required
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20"
              placeholder="e.g. Interventional Cardiology"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Degrees & Qualifications *
            </label>
            <input
              type="text"
              name="qualification"
              required
              value={formData.qualification}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20"
              placeholder="e.g. MBBS, MD, FACC"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Years Experience
            </label>
            <input
              type="number"
              min="0"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Consultation Fee ($)
            </label>
            <input
              type="number"
              min="0"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              OPD Room / Chamber
            </label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20"
              placeholder="OPD-201"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Professional Biography & Clinical Experience
          </label>
          <textarea
            rows="4"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-brand-200 text-sm bg-brand-50/20"
            placeholder="Introduce your medical expertise, certifications, and philosophy of patient care..."
          ></textarea>
        </div>

        <div className="pt-4 border-t border-brand-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="gradient-pink-btn px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-soft-pink flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving changes...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfile;
