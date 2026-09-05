import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Heart, 
  Leaf, 
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Video,
  Building2
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { useToast } from '../context/ToastContext';
import { assets } from '../assets';

export const Appointment = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    consultationType: 'In-Clinic Visit',
    date: new Date().toISOString().slice(0, 10),
    time: '10:00 AM',
    doctor: 'Dr. Bharathi (Homeopathic Doctor)',
    concern: 'General Consultation',
    description: '',
    agreed: true
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const departments = [
    'General Consultation',
    'Immunity & Respiratory Health',
    'Women’s Health & Hormonal Care',
    'Pediatric & Child Care',
    'Skin & Allergy Care',
    'Stress, Anxiety & Sleep Disorders',
    'Joint, Muscle & Chronic Pain'
  ];

  const times = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.date || !formData.time) {
      showToast('Please fill in required appointment fields', 'warning');
      return;
    }
    if (!formData.agreed) {
      showToast('Please accept terms and privacy policy', 'warning');
      return;
    }

    setIsSubmitted(true);
    showToast('Appointment booked successfully! We will confirm on WhatsApp.', 'success');
  };

  return (
    <div className="space-y-12 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* 1. Appointment Hero Header */}
      <section 
        className="relative border-b border-slate-100 py-16 lg:py-24 overflow-hidden min-h-[350px] lg:min-h-[450px] flex items-center"
      >
        <div 
          className="absolute inset-0 z-0 opacity-100 pointer-events-none"
          style={{ 
            backgroundImage: `url(${assets.bg7})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center right' 
          }}
        ></div>
        {/* Gradient Overlay for Text Readability - Solid on mobile, fades on desktop */}
        <div className="absolute inset-0 bg-white/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/80 lg:via-40% lg:to-transparent lg:to-70% z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="space-y-3 sm:space-y-4 max-w-lg lg:max-w-xl xl:max-w-2xl">
            
            {/* Breadcrumb Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 text-[11px] sm:text-xs font-bold text-slate-800 shadow-md">
              <Link to="/" className="hover:text-brandOrange-600 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-brandOrange-600 font-extrabold">Appointment</span>
            </div>

            {/* Main Title with Elegant Display & Serif Font */}
            <h1 className="text-4xl sm:text-6xl font-black text-[#0b1727] tracking-tight leading-none font-display drop-shadow-[0_2px_10px_rgba(255,255,255,0.9)]">
              Book an <span className="text-[#e05a1e] font-serif italic font-bold">Appointment</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl font-black text-[#0b1727] drop-shadow-[0_1px_5px_rgba(255,255,255,0.9)]">
              Your health is our priority.
            </p>

            {/* Description */}
            <p className="text-xs sm:text-base text-slate-900 font-extrabold leading-relaxed max-w-2xl drop-shadow-[0_1px_8px_rgba(255,255,255,0.95)]">
              Schedule an appointment with Dr. Bharathi for personalized homeopathic care and natural healing.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main 2-Column Appointment Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Appointment Booking Form */}
          <div className="lg:col-span-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-[0_15px_45px_rgba(15,23,42,0.08)] relative overflow-hidden">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ff4e50] via-[#f97316] via-amber-400 to-[#0b344d]" />

            <div className="relative z-10">
              {/* Header Title */}
              <div className="flex items-center gap-3.5 pb-6 mb-6 border-b border-slate-100">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25 ring-4 ring-orange-500/10">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Book Your Consultation
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Fill in your details below for instant slot confirmation
                  </p>
                </div>
              </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                
                {/* Consultation Mode Selector (In-Clinic Visit vs Video Call) */}
                <div>
                  <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2.5">
                    Consultation Mode <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* In-Clinic Card */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, consultationType: 'In-Clinic Visit' })}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 cursor-pointer ${
                        formData.consultationType === 'In-Clinic Visit'
                          ? 'bg-gradient-to-tr from-sky-50 to-blue-50/80 border-sky-500 ring-4 ring-sky-500/10 shadow-md'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-700 shadow-2xs'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                        formData.consultationType === 'In-Clinic Visit'
                          ? 'bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-sky-500/10'
                          : 'bg-sky-50 border border-sky-200/60 text-sky-600'
                      }`}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900">In-Clinic Visit</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Melapalayam Clinic Desk</p>
                      </div>
                    </button>

                    {/* Video Call Card */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, consultationType: 'Video Call Consultation' })}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 cursor-pointer ${
                        formData.consultationType === 'Video Call Consultation'
                          ? 'bg-gradient-to-tr from-amber-50 to-orange-50/80 border-[#f97316] ring-4 ring-orange-500/10 shadow-md'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-700 shadow-2xs'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                        formData.consultationType === 'Video Call Consultation'
                          ? 'bg-gradient-to-tr from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white shadow-md shadow-orange-500/25 ring-4 ring-orange-500/10'
                          : 'bg-orange-50 border border-orange-200/60 text-brandOrange-600'
                      }`}>
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-slate-900">Video Call Consultation</span>
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-black uppercase">ONLINE</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">WhatsApp / Meet Video Call</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 text-brandOrange-600 flex items-center justify-center pointer-events-none group-focus-within/input:bg-[#f97316] group-focus-within/input:text-white group-focus-within/input:border-[#f97316] transition-all duration-200 shadow-2xs">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-brandOrange-500 focus:ring-4 focus:ring-brandOrange-500/10 transition-all duration-300 text-xs sm:text-[13px] text-slate-900 font-bold placeholder-slate-400 shadow-2xs hover:border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2.5">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-sky-50 border border-sky-200/60 text-sky-600 flex items-center justify-center pointer-events-none group-focus-within/input:bg-sky-500 group-focus-within/input:text-white group-focus-within/input:border-sky-500 transition-all duration-200 shadow-2xs">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="Enter your mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-brandOrange-500 focus:ring-4 focus:ring-brandOrange-500/10 transition-all duration-300 text-xs sm:text-[13px] text-slate-900 font-bold placeholder-slate-400 shadow-2xs hover:border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2.5">
                      Email Address
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/60 text-purple-600 flex items-center justify-center pointer-events-none group-focus-within/input:bg-purple-600 group-focus-within/input:text-white group-focus-within/input:border-purple-600 transition-all duration-200 shadow-2xs">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-brandOrange-500 focus:ring-4 focus:ring-brandOrange-500/10 transition-all duration-300 text-xs sm:text-[13px] text-slate-900 font-bold placeholder-slate-400 shadow-2xs hover:border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2.5">
                      Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center pointer-events-none group-focus-within/input:bg-amber-500 group-focus-within/input:text-white group-focus-within/input:border-amber-500 transition-all duration-200 shadow-2xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().slice(0, 10)}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-brandOrange-500 focus:ring-4 focus:ring-brandOrange-500/10 transition-all duration-300 text-xs sm:text-[13px] text-slate-900 font-bold placeholder-slate-400 shadow-2xs hover:border-slate-300 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Time & Department Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2.5">
                      Preferred Time <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/60 text-teal-600 flex items-center justify-center pointer-events-none group-focus-within/input:bg-teal-500 group-focus-within/input:text-white group-focus-within/input:border-teal-500 transition-all duration-200 shadow-2xs">
                        <Clock className="w-4 h-4" />
                      </div>
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full pl-12 pr-9 py-3.5 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-brandOrange-500 focus:ring-4 focus:ring-brandOrange-500/10 appearance-none transition-all duration-300 text-xs sm:text-[13px] text-slate-900 font-bold shadow-2xs hover:border-slate-300 cursor-pointer"
                      >
                        {times.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2.5">
                      Select Department / Concern <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center pointer-events-none group-focus-within/input:bg-emerald-500 group-focus-within/input:text-white group-focus-within/input:border-emerald-500 transition-all duration-200 shadow-2xs">
                        <Leaf className="w-4 h-4" />
                      </div>
                      <select
                        value={formData.concern}
                        onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                        className="w-full pl-12 pr-9 py-3.5 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-brandOrange-500 focus:ring-4 focus:ring-brandOrange-500/10 appearance-none transition-all duration-300 text-xs sm:text-[13px] text-slate-900 font-bold shadow-2xs hover:border-slate-300 cursor-pointer"
                      >
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2.5">
                    Briefly describe your health concern <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group/input">
                    <textarea
                      rows={4}
                      required
                      placeholder="Write your symptoms or health concern..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-4 bg-white border border-slate-200/90 rounded-2xl focus:outline-none focus:border-brandOrange-500 focus:ring-4 focus:ring-brandOrange-500/10 transition-all duration-300 text-xs sm:text-[13px] text-slate-900 font-bold placeholder-slate-400 shadow-2xs hover:border-slate-300"
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreed}
                      onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                      className="rounded-lg border-slate-300 text-brandOrange-500 focus:ring-brandOrange-400 w-4 h-4 cursor-pointer"
                    />
                    <span>
                      I agree to the <Link to="/about" className="text-brandOrange-600 font-bold hover:underline">terms and conditions</Link> and <Link to="/about" className="text-brandOrange-600 font-bold hover:underline">privacy policy</Link>.
                    </span>
                  </label>
                </div>

                {/* Submit CTA Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="btn-gradient-orange w-full sm:w-auto shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform duration-200 px-8 py-3.5 rounded-2xl whitespace-nowrap"
                  >
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">BOOK YOUR CONSULTATION</span>
                  </button>
                </div>

              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy-950">Appointment Slot Requested!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{formData.fullName}</strong>. Dr. Bharathi’s care team has received your request for <strong>{formData.consultationType}</strong> on <strong>{formData.date}</strong> at <strong>{formData.time}</strong>.
                </p>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 max-w-sm mx-auto text-xs text-emerald-800 font-semibold">
                  WhatsApp confirmation will be sent to {formData.phone}
                </div>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-bold text-brandOrange-600 hover:underline pt-2 inline-block"
                >
                  Book Another Slot
                </button>
              </div>
            )}
            </div>
          </div>

          {/* Right: Clinic Information & Important Notes */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Clinic Information Card */}
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_10px_35px_rgba(15,23,42,0.06)] hover:shadow-xl transition-all duration-300 relative overflow-hidden group space-y-4">
              {/* Top Highlight Accent Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d]" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900">
                  Clinic Information
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#e05a1e] text-[10px] font-black uppercase tracking-wider border border-orange-200/60">
                  MELAPALAYAM
                </span>
              </div>

              <div className="space-y-4 text-xs text-slate-600">
                {/* Address */}
                <div className="flex items-start gap-3.5 group/item">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20 ring-4 ring-orange-500/10 group-hover/item:scale-110 transition-transform duration-200 mt-0.5">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Address</h4>
                    <p className="text-slate-500 font-medium leading-relaxed mt-0.5">
                      Municipality complex, 143, Nethaji Rd, Melapalayam, Tirunelveli, Tamil Nadu 627005
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5 group/item">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 ring-4 ring-blue-500/10 group-hover/item:scale-110 transition-transform duration-200 mt-0.5">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Phone</h4>
                    <a href="tel:+919025854711" className="text-slate-600 hover:text-brandOrange-600 font-extrabold text-xs transition-colors mt-0.5 block">
                      +91 90258 54711
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5 group/item">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20 ring-4 ring-purple-500/10 group-hover/item:scale-110 transition-transform duration-200 mt-0.5">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Email</h4>
                    <a href="mailto:bharathihomoeopathy246@gmail.com" className="text-slate-600 hover:text-brandOrange-600 font-medium text-xs transition-colors break-all mt-0.5 block">
                      bharathihomoeopathy246@gmail.com
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5 group/item">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 ring-4 ring-emerald-500/10 group-hover/item:scale-110 transition-transform duration-200 mt-0.5">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Consultation Hours</h4>
                    <p className="text-slate-600 font-semibold leading-tight mt-0.5">
                      Mon - Sat: 9:30 AM – 1:30 PM, 5:30 PM – 9:30 PM
                    </p>
                    <p className="text-rose-500 font-extrabold text-[11px] mt-0.5">
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes Card */}
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_10px_35px_rgba(15,23,42,0.06)] hover:shadow-xl transition-all duration-300 relative overflow-hidden group space-y-4">
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-[#0b344d]" />

              <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-brandOrange-500 text-sm" />
                <span>Important Notes</span>
              </h3>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-3 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-medium text-slate-700 leading-snug">
                    Please book your appointment at least 2 hours in advance.
                  </span>
                </li>

                <li className="flex items-start gap-3 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-medium text-slate-700 leading-snug">
                    You will receive a confirmation message on WhatsApp.
                  </span>
                </li>

                <li className="flex items-start gap-3 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-medium text-slate-700 leading-snug">
                    In case of emergency, please call us directly.
                  </span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Four Feature Badges Strip at Bottom */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.08)] p-3.5 sm:p-5 lg:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-0 lg:divide-x lg:divide-slate-100">
          
          {/* Badge 1: Experienced Doctor */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-purple-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25 ring-4 ring-purple-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                Experienced Doctor
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Expert homeopathic care from Dr. Bharathi
              </p>
            </div>
          </div>

          {/* Badge 2: Personalized Treatment */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-rose-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/25 ring-4 ring-rose-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                Personalized Treatment
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Tailored treatment for your unique needs
              </p>
            </div>
          </div>

          {/* Badge 3: Natural & Safe */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-emerald-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25 ring-4 ring-emerald-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                Natural & Safe
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                100% natural, safe & effective remedies
              </p>
            </div>
          </div>

          {/* Badge 4: Holistic Healing */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-sky-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#0b344d] to-[#18587c] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0b344d]/25 ring-4 ring-sky-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-[#0b344d] transition-colors leading-snug">
                Holistic Healing
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Treating the root cause for wellness
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
