import React from 'react';
import { Heart, ShieldCheck, Award, Users, Activity, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
          About Blossom Health
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          A Century of Trusted Healthcare & Innovation
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Founded with a patient-centric philosophy, Blossom Health combines warm, gentle bedside care with state-of-the-art diagnostic facilities and internationally trained medical faculty.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-brand-100 shadow-soft-pink text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
            <Heart className="w-7 h-7 text-brand-500 fill-brand-100" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Compassionate Care</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every patient is treated with dignity, warmth, and individualized medical attention that addresses both physical and emotional well-being.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-brand-100 shadow-soft-pink text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-brand-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Accredited Safety</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Strict sterilization protocols, JCAHO gold-seal accreditation, and peer-reviewed safety records across all surgical suites.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-brand-100 shadow-soft-pink text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
            <Award className="w-7 h-7 text-brand-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Specialist Excellence</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Leading board-certified specialists with decades of research and clinical experience in cardiology, neurology, pediatrics, and surgery.
          </p>
        </div>
      </div>

      {/* Hospital Stats */}
      <div className="bg-gradient-to-r from-brand-50 via-white to-brand-50 p-8 rounded-3xl border border-brand-100 shadow-soft-pink">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <h4 className="text-3xl font-extrabold text-brand-600">15,000+</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1">Patients Served Yearly</p>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-slate-800">50+</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1">Specialized Doctors</p>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-brand-600">98.6%</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1">Patient Satisfaction</p>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-slate-800">24/7</h4>
            <p className="text-xs text-slate-500 font-semibold mt-1">Critical & Emergency Care</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
