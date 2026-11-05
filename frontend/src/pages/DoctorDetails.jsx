import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doctorService } from '../services/api';
import {
  Star,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Award,
  CheckCircle2,
  Stethoscope,
  ArrowLeft,
  Mail,
  Phone,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { handleImageError } from '../utils/avatar';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await doctorService.getDoctor(id);
        if (res.data?.success) {
          setDoctor(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching doctor details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Loading doctor profile..." />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-800">Doctor not found</h3>
        <Link to="/doctors" className="gradient-pink-btn px-4 py-2 rounded-xl text-xs font-bold inline-block">
          Back to Doctors List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/doctors"
        className="inline-flex items-center text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Specialists
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Doctor Card & Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-100 p-6 shadow-soft-pink text-center">
            <div className="w-36 h-36 mx-auto rounded-3xl overflow-hidden border-4 border-brand-100 shadow-md">
              <img
                src={
                  doctor.user?.avatar ||
                  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
                }
                alt={doctor.user?.name}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded">
                {doctor.department?.name || 'Department'}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                {doctor.user?.name}
              </h2>
              <p className="text-sm font-semibold text-brand-500">
                {doctor.specialization}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {doctor.qualification}
              </p>

              <div className="flex items-center justify-center space-x-1 mt-3 text-amber-500 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{doctor.rating || 4.9}</span>
                <span className="text-slate-400 font-normal">
                  ({doctor.reviewsCount || 24} patient reviews)
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-brand-50 grid grid-cols-2 gap-4 text-left text-xs">
              <div className="bg-brand-50/40 p-3 rounded-xl border border-brand-100">
                <span className="text-slate-400 block">Experience</span>
                <span className="font-bold text-slate-800 text-sm">
                  {doctor.experienceYears} Years
                </span>
              </div>
              <div className="bg-brand-50/40 p-3 rounded-xl border border-brand-100">
                <span className="text-slate-400 block">Consultation Fee</span>
                <span className="font-bold text-brand-600 text-sm">
                  ${doctor.consultationFee}
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-500 text-left space-y-2">
              <p className="flex items-center">
                <MapPin className="w-4 h-4 text-brand-500 mr-2 flex-shrink-0" />
                Clinic Location: {doctor.roomNumber || 'Room 101 - 2nd Floor'}
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 text-brand-500 mr-2 flex-shrink-0" />
                {doctor.user?.email}
              </p>
            </div>
          </div>

          {/* Working Schedule Card */}
          <div className="bg-white rounded-3xl border border-brand-100 p-6 shadow-soft-pink space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <Clock className="w-4 h-4 text-brand-500 mr-2" />
              Practice Schedule
            </h4>

            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex justify-between py-1 border-b border-brand-50">
                <span className="font-semibold">Working Days:</span>
                <span className="font-bold text-slate-800">
                  {doctor.workingDays?.join(', ') || 'Mon - Fri'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-50">
                <span className="font-semibold">Working Hours:</span>
                <span className="font-bold text-slate-800">
                  {doctor.workingHours?.start || '09:00'} - {doctor.workingHours?.end || '17:00'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold">Slot Duration:</span>
                <span className="font-bold text-brand-600">
                  {doctor.workingHours?.slotDurationMinutes || 30} minutes / slot
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Booking Trigger */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-100 p-8 shadow-soft-pink space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">About Specialist</h3>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                {doctor.bio ||
                  `${doctor.user?.name} is a renowned specialist in ${doctor.specialization} with over ${doctor.experienceYears} years of exemplary clinical practice.`}
              </p>
            </div>

            <div className="pt-6 border-t border-brand-50">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Qualifications & Credentials</h4>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-brand-50/50 p-3 rounded-2xl border border-brand-100">
                <Award className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span>{doctor.qualification} • Certified Medical Practitioner</span>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-50">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Patient Consultation Perks</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                  Real-time slot reservation (prevent double booking)
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                  Complete medical history and digital prescription archive
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                  Free 48-hour rescheduling from your patient portal
                </li>
              </ul>
            </div>

            {/* Direct Book CTA */}
            <div className="pt-6 border-t border-brand-50 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Consultation Fee</span>
                <span className="text-2xl font-extrabold text-brand-600">
                  ${doctor.consultationFee}
                </span>
              </div>

              <Link
                to={`/patient/book?doctor=${doctor._id}`}
                className="gradient-pink-btn px-8 py-3.5 rounded-2xl font-bold text-sm shadow-soft-pink flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
