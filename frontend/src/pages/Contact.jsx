import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
          Get in Touch
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900">
          Contact Blossom Health
        </h1>
        <p className="text-sm text-slate-500">
          Have an inquiry, feedback, or need emergency assistance? Our team is available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-soft-pink space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Hospital Contact Hub</h3>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Hospital Address</h4>
                  <p className="text-xs text-slate-500">100 Blossom Medical Park, Metro District, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Phone & Helpline</h4>
                  <p className="text-xs text-slate-500">Appointments: (555) 234-5600</p>
                  <p className="text-xs text-rose-500 font-bold">24/7 Emergency: (555) 911-CARE</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Email Inquiries</h4>
                  <p className="text-xs text-slate-500">care@blossomhospital.com</p>
                  <p className="text-xs text-slate-500">appointments@blossomhospital.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Visiting Hours</h4>
                  <p className="text-xs text-slate-500">Outpatient: Mon - Sat: 8:00 AM - 8:00 PM</p>
                  <p className="text-xs text-slate-500">Emergency & Inpatient: Open 24 Hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 rounded-3xl border border-brand-100 shadow-soft-pink space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Send an Inquiry or Feedback</h3>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Thank you! Your message has been sent to our patient relations desk.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm bg-brand-50/20"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm bg-brand-50/20"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm bg-brand-50/20"
                  placeholder="Inquiry regarding pediatric appointments"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm bg-brand-50/20"
                  placeholder="How can we assist you today?..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="gradient-pink-btn px-6 py-3 rounded-xl font-bold text-sm shadow-soft-pink flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
