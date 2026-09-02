import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageCircle,
  Leaf,
  ShieldCheck,
  UserCheck,
  Truck,
  CreditCard,
  ChevronRight,
  Tag
} from 'lucide-react';
import { assets } from '../assets';
import { SectionHeader } from '../components/common/SectionHeader';
import { useToast } from '../context/ToastContext';

export const Contact = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      showToast('Please fill in required fields', 'warning');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been sent to Dr. Bharathi’s clinic desk!', 'success');
  };

  return (
    <div className="space-y-12 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* 1. Contact Hero Banner: Compact on Mobile, Tall on Desktop */}
      <section className="relative overflow-hidden min-h-[260px] sm:min-h-[380px] lg:min-h-[480px] flex items-start sm:items-center bg-slate-100 border-b border-slate-200/60 shadow-xs">
        {/* 100% Crystal Clear Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={assets.contactBg}
            alt="Contact Us Homeopathic Remedies"
            className="w-full h-full object-cover object-right sm:object-center opacity-100"
          />
        </div>

        {/* Content Box moved UP (top) and RIGHT (right) to clear the left green leaves cleanly */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 lg:pt-12 pb-8 sm:pb-16 w-full">
          <div className="space-y-3 sm:space-y-4 max-w-[85%] sm:max-w-xl ml-4 sm:ml-28 lg:ml-40 -mt-2 sm:-mt-6">
            
            {/* Breadcrumb Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 text-[11px] sm:text-xs font-bold text-slate-800 shadow-md">
              <Link to="/" className="hover:text-brandOrange-600 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-brandOrange-600 font-extrabold">Contact Us</span>
            </div>

            {/* Main Title with Elegant Display & Serif Font */}
            <h1 className="text-4xl sm:text-6xl font-black text-[#0b1727] tracking-tight leading-none font-display drop-shadow-[0_2px_10px_rgba(255,255,255,0.9)]">
              Contact <span className="text-[#e05a1e] font-serif italic font-bold">Us</span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-base text-slate-900 font-extrabold leading-relaxed max-w-lg drop-shadow-[0_1px_8px_rgba(255,255,255,0.95)]">
              We are here to answer your questions regarding clinic appointments, homeopathic dilutions, prescription refills, and courier delivery.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main 2-Column Contact Info + Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Address Card */}
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25 ring-4 ring-orange-500/10 group-hover:scale-110 transition-transform duration-200 mt-0.5">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Clinic Address</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Municipality complex, 143, Nethaji Rd, Melapalayam, Tirunelveli, Tamil Nadu 627005
                </p>
              </div>
            </div>

            {/* Phone & WhatsApp Card */}
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0b344d] to-[#18587c] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0b344d] to-[#18587c] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0b344d]/25 ring-4 ring-sky-500/10 group-hover:scale-110 transition-transform duration-200 mt-0.5">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Phone & WhatsApp</h4>
                <a href="tel:+919025854711" className="text-xs text-slate-900 font-extrabold hover:text-brandOrange-600 block transition-colors">+91 90258 54711</a>
                <a
                  href="https://wa.me/919025854711"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold hover:underline mt-0.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp (+91 90258 54711)</span>
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25 ring-4 ring-purple-500/10 group-hover:scale-110 transition-transform duration-200 mt-0.5">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Email Enquiries</h4>
                <a href="mailto:bharathihomoeopathy246@gmail.com" className="text-xs text-slate-600 hover:text-brandOrange-600 font-medium transition-colors break-all">bharathihomoeopathy246@gmail.com</a>
              </div>
            </div>

            {/* Consultation Hours Card */}
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25 ring-4 ring-emerald-500/10 group-hover:scale-110 transition-transform duration-200 mt-0.5">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Consultation Hours</h4>
                <p className="text-xs text-slate-600 font-semibold">Mon - Sat: 9:30 AM – 1:30 PM, 5:30 PM – 9:30 PM</p>
                <p className="text-xs text-rose-500 font-extrabold">Sunday: Closed</p>
              </div>
            </div>

          </div>

          {/* Right: Enquiry Form Card */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.08)] relative overflow-hidden">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d]" />

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4.5 text-xs">
                
                {/* Header Title */}
                <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100 mb-2">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0b344d] to-[#18587c] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0b344d]/25 ring-4 ring-sky-500/10">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Send Us a Message
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Our clinic desk will reply within 24 hours
                    </p>
                  </div>
                </div>

                {/* Name & Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 text-brandOrange-600 flex items-center justify-center pointer-events-none group-focus-within/input:bg-[#f97316] group-focus-within/input:text-white group-focus-within/input:border-[#f97316] transition-all duration-200 shadow-2xs">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-brandOrange-500 focus:ring-4 focus:ring-brandOrange-500/10 transition-all duration-300 text-xs sm:text-[13px] text-slate-900 font-bold placeholder-slate-400 shadow-2xs hover:border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-sky-50 border border-sky-200/60 text-sky-600 flex items-center justify-center pointer-events-none group-focus-within/input:bg-sky-500 group-focus-within/input:text-white group-focus-within/input:border-sky-500 transition-all duration-200 shadow-2xs">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-brandOrange-500 focus:ring-4 focus:ring-brandOrange-500/10 transition-all duration-300 text-xs sm:text-[13px] text-slate-900 font-bold placeholder-slate-400 shadow-2xs hover:border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Subject Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/60 text-purple-600 flex items-center justify-center pointer-events-none group-focus-within/input:bg-purple-600 group-focus-within/input:text-white group-focus-within/input:border-purple-600 transition-all duration-200 shadow-2xs">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-brandOrange-500 focus:ring-4 focus:ring-brandOrange-500/10 transition-all duration-300 text-xs sm:text-[13px] text-slate-900 font-bold placeholder-slate-400 shadow-2xs hover:border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/60 text-teal-600 flex items-center justify-center pointer-events-none group-focus-within/input:bg-teal-500 group-focus-within/input:text-white group-focus-within/input:border-teal-500 transition-all duration-200 shadow-2xs">
                        <Tag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Remedy Consultation"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-brandOrange-500 focus:ring-4 focus:ring-brandOrange-500/10 transition-all duration-300 text-xs sm:text-[13px] text-slate-900 font-bold placeholder-slate-400 shadow-2xs hover:border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1.5">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group/input">
                    <textarea
                      rows={4}
                      required
                      placeholder="How can Dr. Bharathi’s care team help you?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-4 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-brandOrange-500 focus:ring-4 focus:ring-brandOrange-500/10 transition-all duration-300 text-xs sm:text-[13px] text-slate-900 font-bold placeholder-slate-400 shadow-2xs hover:border-slate-300"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-gradient-orange w-full sm:w-auto shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform duration-200 px-8 py-3.5 rounded-2xl"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy-950">Message Sent!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you for contacting Dr. Bharathi’s Homeo Care. Our clinic desk will reply within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-brandOrange-600 hover:underline"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3. Five Trust Badges Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.08)] p-3 sm:p-4 lg:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-0 lg:divide-x lg:divide-slate-100">
          
          {/* Badge 1: 100% Natural */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-emerald-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25 ring-4 ring-emerald-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                100% Natural
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Safe & gentle homeopathic care
              </p>
            </div>
          </div>

          {/* Badge 2: No Side Effects */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-sky-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#0b344d] to-[#18587c] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0b344d]/25 ring-4 ring-sky-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-[#0b344d] transition-colors leading-snug">
                No Side Effects
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Non-toxic & highly effective
              </p>
            </div>
          </div>

          {/* Badge 3: Expert Doctors */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-purple-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25 ring-4 ring-purple-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                Expert Doctors
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Experienced specialists
              </p>
            </div>
          </div>

          {/* Badge 4: Fast & Safe Delivery */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-amber-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25 ring-4 ring-amber-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                Fast & Safe Delivery
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                On all orders above ₹999
              </p>
            </div>
          </div>

          {/* Badge 5: Secure Payments */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-rose-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/25 ring-4 ring-rose-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                Secure Payments
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                100% safe & encrypted
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
