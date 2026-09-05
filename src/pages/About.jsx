import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Clock, 
  Award, 
  Users, 
  Smile, 
  Leaf, 
  DollarSign, 
  Calendar,
  Layers,
  Activity,
  Check,
  Globe,
  HandHeart,
  FileText,
  UserCheck,
  Trophy,
  Pill,
  SmilePlus,
  ChevronRight
} from 'lucide-react';
import { assets } from '../assets';
import { SectionHeader } from '../components/common/SectionHeader';

export const About = () => {
  const timeline = [
    {
      year: "2015",
      title: "The Beginning",
      desc: "Started with a small clinic with a vision to bring natural and holistic healing to the community.",
      icon: <Leaf className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50"
    },
    {
      year: "2017",
      title: "Growing Trust",
      desc: "Gained the trust of patients through effective treatment and compassionate care.",
      icon: <Users className="w-6 h-6 text-sky-600" />,
      bg: "bg-sky-50"
    },
    {
      year: "2020",
      title: "Expanding Services",
      desc: "Expanded our services and online presence to reach more people.",
      icon: <Globe className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-50"
    },
    {
      year: "2024+",
      title: "Continuing Commitment",
      desc: "Continuing our commitment to health, healing and happiness for all.",
      icon: <HandHeart className="w-6 h-6 text-teal-600" />,
      bg: "bg-teal-50"
    }
  ];

  const whyChooseUs = [
    {
      title: "Natural & Safe",
      desc: "Treatments with natural remedies with no harmful side effects.",
      icon: <Leaf className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50"
    },
    {
      title: "Expert Care",
      desc: "Expertise in treating all age groups with personalized care.",
      icon: <UserCheck className="w-6 h-6 text-sky-600" />,
      bg: "bg-sky-50"
    },
    {
      title: "Holistic Approach",
      desc: "Focus on the root cause for long-lasting relief and wellness.",
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-50"
    },
    {
      title: "Time & Attention",
      desc: "We listen, understand and provide the best possible solutions.",
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50"
    },
    {
      title: "Affordable Care",
      desc: "Quality homeopathic treatment at an affordable cost.",
      icon: <DollarSign className="w-6 h-6 text-teal-600" />,
      bg: "bg-teal-50"
    },
    {
      title: "Trusted & Reliable",
      desc: "Thousands of patients trust us for their better health.",
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50"
    }
  ];

  const certifications = [
    { 
      name: "NATIONAL COMMISSION FOR HOMEOPATHY", 
      icon: "🏛️"
    },
    { 
      name: "THE HOMEOPATHIC MEDICAL ASSOCIATION OF INDIA", 
      icon: "⚕️"
    },
    { 
      name: "TAMILNADU HOMEOPATHIC MEDICAL ASSOCIATION", 
      icon: "🌿"
    },
    { 
      name: "HOMEOPATHY FOR ALL HEALTH FOR ALL", 
      icon: "🌱"
    },
    { 
      name: "QUALITY CARE YOU CAN TRUST", 
      icon: "🛡️"
    }
  ];

  return (
    <div className="space-y-16 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* 1. Hero Banner with Herbal Remedy Background Image */}
      <section className="relative bg-slate-900 text-white py-10 sm:py-20 lg:py-24 pb-14 sm:pb-20 overflow-hidden border-b border-white/10 min-h-[340px] sm:min-h-[420px] flex items-center">
        
        {/* Background Image: Screenshot 2026-09-02 100844.png */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={assets.aboutBg}
            alt="Natural Homeopathy Remedies Background"
            className="w-full h-full object-cover object-center opacity-100"
          />
          {/* Contrast Scrim Overlay for ultra-clear readability on mobile */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1727]/95 via-[#0f3e5c]/85 to-black/70 backdrop-brightness-[0.9]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            
            {/* Breadcrumb Pill */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs text-sky-100 font-semibold shadow-sm">
              <Link to="/" className="hover:text-amber-300 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/60" />
              <span className="text-amber-300 font-bold">About Us</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              About <span className="text-[#fb923c] font-serif italic">Us</span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-base text-white/95 font-bold leading-relaxed max-w-xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              Dedicated to your health, healing, and well-being through the power of authentic constitutional homeopathy.
            </p>

            {/* Action Badges Strip - Compact horizontal layout on mobile */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/20 text-[11px] sm:text-xs font-bold text-white shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span>10+ Years Experience</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/20 text-[11px] sm:text-xs font-bold text-white shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span>5000+ Happy Patients</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/20 text-[11px] sm:text-xs font-bold text-white shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 shrink-0" />
                <span>100% Pure Homeopathy</span>
              </div>
            </div>

            {/* CTA Buttons - Solid high-contrast colors on mobile */}
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4">
              <Link
                to="/appointment"
                className="btn-gradient-orange w-full sm:w-auto text-center"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>
              <Link
                to="/shop"
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-[#0b1727] font-black text-xs uppercase tracking-wider rounded-full shadow-xl hover:scale-105 transition-all text-center border-2 border-white flex items-center justify-center gap-2"
              >
                Explore Shop
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* 2. Welcome to Dr. Bharathi's Homeo Care */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-[0_15px_45px_rgba(15,23,42,0.08)] relative overflow-hidden">
          {/* Top Accent Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d]" />
          
          {/* Animated Video Showcase Card */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden aspect-[4/5] bg-slate-900 shadow-2xl border-2 border-white ring-4 ring-slate-100 relative group">
            <video
              src={assets.animoCoverRing}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

          </div>

          {/* Right Column Details */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-[#e05a1e] text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-[#e05a1e]" />
                <span>WELCOME TO</span>
              </span>
              
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                Dr. Bharathi’s <span className="bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] bg-clip-text text-transparent">Homeo Care</span>
              </h2>
            </div>

            {/* Description Glass Box */}
            <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2.5">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                At Dr. Bharathi’s Homeo Care, we believe in the power of natural healing. Our mission is to provide safe, effective and personalized homeopathic treatment for you and your family.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                With years of experience in treating acute and chronic disorders, Dr. Bharathi is committed to helping you achieve optimal health and a better quality of life through holistic care.
              </p>
            </div>

            {/* 3 Feature Micro-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              {/* Card 1 */}
              <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/40 p-3.5 rounded-2xl border border-orange-200/60 flex items-center gap-3 shadow-2xs hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff4e50] to-[#f97316] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <UserCheck className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-black text-slate-900 leading-tight">Experienced Homeopathic Doctor</span>
              </div>

              {/* Card 2 */}
              <div className="bg-gradient-to-br from-sky-50/80 to-blue-50/40 p-3.5 rounded-2xl border border-sky-200/60 flex items-center gap-3 shadow-2xs hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-black text-slate-900 leading-tight">Personalized Treatments</span>
              </div>

              {/* Card 3 */}
              <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/40 p-3.5 rounded-2xl border border-emerald-200/60 flex items-center gap-3 shadow-2xs hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Leaf className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-black text-slate-900 leading-tight">Holistic & Natural Healing</span>
              </div>
            </div>

            {/* CTA Action */}
            <div className="pt-2">
              <Link
                to="/appointment"
                className="btn-gradient-orange inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-black whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">BOOK YOUR CONSULTATION</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Our Journey Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Heading */}
        <SectionHeader title="Our Journey" />

        <div className="relative">
          {/* Connecting Line between timeline steps on desktop */}
          <div className="hidden lg:block absolute top-[72px] left-16 right-16 h-1 bg-gradient-to-r from-emerald-400 via-sky-400 via-indigo-400 to-teal-400 opacity-20 rounded-full z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {timeline.map((step, idx) => {
              const iconGradients = [
                'from-emerald-500 to-teal-400 shadow-emerald-500/25 ring-emerald-500/10',
                'from-[#0b344d] to-[#18587c] shadow-[#0b344d]/25 ring-sky-500/10',
                'from-purple-600 to-indigo-500 shadow-purple-500/25 ring-purple-500/10',
                'from-teal-500 to-emerald-400 shadow-teal-500/25 ring-teal-500/10'
              ];
              const iconColor = iconGradients[idx % iconGradients.length];

              return (
                <div 
                  key={idx} 
                  className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_10px_35px_rgba(15,23,42,0.06)] p-6 sm:p-7 text-center relative hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 hover:border-brandOrange-400/60 transition-all duration-300 group overflow-hidden flex flex-col items-center"
                >
                  {/* Top Highlight Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Year Badge Pill */}
                  <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-brandOrange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 mb-4 group-hover:scale-105 transition-transform duration-300">
                    {step.year}
                  </span>

                  {/* Icon Pod */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${iconColor} text-white flex items-center justify-center shadow-md ring-4 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 mb-3`}>
                    {React.cloneElement(step.icon, { className: "w-6 h-6 text-white" })}
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-brandOrange-600 transition-colors leading-tight">
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* 4. Live Counter Metrics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#236888] text-white rounded-3xl p-8 sm:p-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center shadow-xl">
          
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-1">
              <SmilePlus className="w-6 h-6 text-sky-400" />
            </div>
            <span className="text-2xl sm:text-4xl font-extrabold text-white">5000+</span>
            <p className="text-xs text-slate-300 font-semibold">Happy Patients</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-1">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-2xl sm:text-4xl font-extrabold text-white">10+</span>
            <p className="text-xs text-slate-300 font-semibold">Years of Experience</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-1">
              <Pill className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-2xl sm:text-4xl font-extrabold text-white">200+</span>
            <p className="text-xs text-slate-300 font-semibold">Homeopathic Medicines</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-1">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-2xl sm:text-4xl font-extrabold text-white">100%</span>
            <p className="text-xs text-slate-300 font-semibold">Natural & Safe Treatment</p>
          </div>

        </div>
      </section>

      {/* 5. Why Choose Dr. Bharathi's Homeo Care? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <SectionHeader title="Why Choose Dr. Bharathi’s Homeo Care?" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((card, i) => {
            const cardGradients = [
              'from-emerald-500 to-teal-400 shadow-emerald-500/25 ring-emerald-500/10',
              'from-[#0b344d] to-[#18587c] shadow-[#0b344d]/25 ring-sky-500/10',
              'from-purple-600 to-indigo-500 shadow-purple-500/25 ring-purple-500/10',
              'from-orange-500 to-amber-400 shadow-orange-500/25 ring-amber-500/10',
              'from-teal-500 to-emerald-400 shadow-teal-500/25 ring-teal-500/10',
              'from-blue-600 to-sky-500 shadow-blue-500/25 ring-blue-500/10'
            ];
            const gradientClass = cardGradients[i % cardGradients.length];

            return (
              <div 
                key={i} 
                className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_10px_35px_rgba(15,23,42,0.06)] hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1.5 hover:border-brandOrange-400/60 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
              >
                {/* Top Accent Gradient Line on Hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Icon Pod */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${gradientClass} text-white flex items-center justify-center shadow-md ring-4 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 mb-4`}>
                    {React.cloneElement(card.icon, { className: "w-6 h-6 text-white" })}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-brandOrange-600 transition-colors leading-tight mb-2">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 6. Meet Dr. Bharathi Section (With Real Photo assets.bharathi & Quote Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm">
          
          {/* Doctor Portrait */}
          <div className="lg:col-span-4 rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 shadow-md border-2 border-white">
            <img
              src={assets.bharathi}
              alt="Dr. Bharathi - Qualified Homeopathic Doctor"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center Details */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="text-2xl font-extrabold text-[#0b1727] tracking-tight">
                Meet Dr. Bharathi
              </h3>
              <span className="text-xs font-bold text-[#e05a1e] uppercase tracking-wider block mt-0.5">
                Qualified Homeopathic Doctor
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dr. Bharathi is a dedicated homeopathic practitioner with over 10 years of experience in treating acute and chronic diseases naturally.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Her mission is to provide safe, effective and personalized homeopathic care for a healthier tomorrow.
            </p>

            <ul className="space-y-2 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e05a1e] shrink-0" />
                <span>B.H.M.S - Bachelor of Homeopathic Medicine & Surgery</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e05a1e] shrink-0" />
                <span>Expertise in Women's Health, Child Care, Skin, Allergy, Stress & More</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e05a1e] shrink-0" />
                <span>Holistic and patient-centric approach</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e05a1e] shrink-0" />
                <span>Compassionate care for all age groups</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/appointment"
                className="btn-gradient-orange"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </Link>
            </div>
          </div>

          {/* Right Quote Card */}
          <div className="lg:col-span-3 bg-[#fdfbf9] border border-amber-100 p-6 rounded-2xl text-center space-y-4 shadow-sm flex flex-col justify-between h-full">
            <span className="text-4xl font-serif text-[#e05a1e] font-black leading-none">“</span>
            
            <p className="text-xs sm:text-sm text-slate-700 font-medium italic leading-relaxed">
              My goal is to heal naturally, care deeply and help you live a healthier life.
            </p>
            
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[#0b1727] block">- Dr. Bharathi</span>
              
              <div className="w-24 h-16 mx-auto rounded-xl overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=300&q=80"
                  alt="Herbal remedies"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Certifications & Member Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <SectionHeader title="Certifications & Member" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {certifications.map((cert, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-slate-200/80 p-5 text-center shadow-sm flex flex-col items-center justify-center gap-3 hover:border-orange-400 hover:shadow-md transition-all"
            >
              <div className="text-3xl filter drop-shadow-sm">{cert.icon}</div>
              <h4 className="text-[10px] sm:text-[11px] font-black text-[#0b1727] tracking-tight leading-tight">
                {cert.name}
              </h4>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
};
