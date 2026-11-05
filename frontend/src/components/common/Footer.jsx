import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-brand-100 mt-20">
      {/* Pink accent banner */}
      <div className="bg-gradient-to-r from-brand-500 via-brand-400 to-brand-300 py-3 text-white text-center text-xs font-semibold tracking-wide">
        🌸 24/7 Emergency Care & Immediate Trauma Support: Call (555) 911-CARE
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center shadow-soft-pink">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                Blossom<span className="text-slate-800">Health</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Providing compassionate, high-standard healthcare with state-of-the-art diagnostic facilities and specialized medical experts.
            </p>
            <div className="flex items-center space-x-2 text-xs font-medium text-brand-600 bg-brand-50/70 p-2.5 rounded-xl border border-brand-100">
              <ShieldCheck className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span>Certified Healthcare & JCAHO Accredited Hospital</span>
            </div>
          </div>

          {/* Col 2: Hospital Departments */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 tracking-wider uppercase mb-4">
              Top Departments
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>
                <Link to="/departments" className="hover:text-brand-600 transition-colors">
                  Cardiology & Vascular Care
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-brand-600 transition-colors">
                  Neurology & Brain Science
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-brand-600 transition-colors">
                  Pediatrics & Child Wellness
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-brand-600 transition-colors">
                  Dermatology & Skin Clinic
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-brand-600 transition-colors">
                  Orthopedics & Joint Surgery
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-brand-600 transition-colors">
                  Gynecology & Obstetrics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>
                <Link to="/doctors" className="hover:text-brand-600 transition-colors">
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link to="/patient/book" className="hover:text-brand-600 transition-colors">
                  Book an Appointment
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-600 transition-colors">
                  About Blossom Health
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-600 transition-colors">
                  Help & Contact Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-600 transition-colors">
                  Staff & Doctor Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 tracking-wider uppercase mb-4">
              Contact & Hours
            </h4>
            <div className="space-y-3 text-sm text-slate-500">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>100 Blossom Medical Park, Metro District, NY 10001</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>Appointments: (555) 234-5600</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>care@blossomhospital.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>OPD: Mon - Sat: 8:00 AM - 8:00 PM<br />Emergency: 24/7 Everyday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-brand-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} Blossom Health System. All rights reserved. MERN Stack Hospital System.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-brand-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-brand-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-brand-600 cursor-pointer">Patient Bill of Rights</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
