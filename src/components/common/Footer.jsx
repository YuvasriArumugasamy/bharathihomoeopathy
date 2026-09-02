import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ChevronRight } from 'lucide-react';
import { assets } from '../../assets';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0b344d] via-[#104363] to-[#072437] text-slate-100 font-sans text-xs relative overflow-hidden border-t border-slate-700/50">
      
      {/* Subtle Background Glow Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brandOrange-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Col 1: Brand Bio */}
          <div className="md:col-span-5 lg:col-span-5 space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-brandOrange-500 shadow-lg bg-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 ring-4 ring-brandOrange-500/20">
                <img 
                  src={assets.logo} 
                  alt="Dr Bharathi's Homeo Care" 
                  className="w-full h-full object-cover scale-[1.08] rounded-full" 
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
              </div>
              <div className="flex flex-col items-center justify-center pt-0.5">
                <div className="text-xl sm:text-2xl font-serif tracking-tight leading-none mb-1">
                  <span className="text-[#f97316]">Dr</span>
                  <span className="text-white ml-1.5 font-bold">Bharathi's</span>
                </div>
                
                <div className="w-full h-[1.5px] flex">
                  <div className="h-full bg-white/70 w-[75%]"></div>
                  <div className="h-full bg-[#f97316] w-[25%]"></div>
                </div>

                <div className="flex items-center justify-center w-full mt-1 gap-1.5">
                  <div className="h-[1px] bg-[#f97316] w-3"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-[#f97316]"></div>
                  <span className="text-[8px] sm:text-[9.5px] font-black uppercase tracking-[0.25em] text-white">
                    HOMEO CARE
                  </span>
                  <div className="w-[3px] h-[3px] rounded-full bg-[#f97316]"></div>
                  <div className="h-[1px] bg-[#f97316] w-3"></div>
                </div>
              </div>
            </Link>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm font-medium">
              We are committed to providing safe, gentle and effective homeopathic treatment with personalized care for you and your family.
            </p>

            {/* Social Media Links with Glowing Icon Pods */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://www.youtube.com/@dr.lakshmibharathik3579"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center text-xs shadow-md shadow-red-600/30 hover:scale-110 active:scale-95 transition-all duration-200"
                aria-label="YouTube Channel"
                title="YouTube"
              >
                <i className="fa-brands fa-youtube text-sm"></i>
              </a>
              <a
                href="https://www.instagram.com/_drbharathi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center text-xs shadow-md shadow-pink-500/30 hover:scale-110 active:scale-95 transition-all duration-200"
                aria-label="Instagram"
                title="Instagram"
              >
                <i className="fa-brands fa-instagram text-sm"></i>
              </a>
              <a
                href="https://wa.me/919025854711"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center text-xs shadow-md shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all duration-200"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brandOrange-500" />
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'All Products', path: '/shop' },
                { name: 'Special Offers', path: '/offers' },
                { name: 'Book Appointment', path: '/appointment' },
                { name: 'Contact Clinic', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="group/link flex items-center gap-1.5 text-slate-300 hover:text-amber-300 transition-all duration-200 hover:translate-x-1 font-medium"
                  >
                    <ChevronRight className="w-3 h-3 text-brandOrange-400 opacity-60 group-hover/link:opacity-100 transition-opacity shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Clinic Info Glass Micro-Cards */}
          <div className="md:col-span-4 lg:col-span-4 space-y-4">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brandOrange-500" />
              <span>Clinic Info</span>
            </h4>
            
            <div className="space-y-2.5">
              {/* Address */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <p className="text-[11.5px] text-slate-200 leading-snug font-medium">
                  Municipality complex, 143, Nethaji Rd, Melapalayam, Tirunelveli, Tamil Nadu 627005
                </p>
              </div>

              {/* Phone */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <a href="tel:+919025854711" className="text-xs text-slate-200 hover:text-amber-300 font-extrabold transition-colors">
                  +91 90258 54711
                </a>
              </div>

              {/* Email */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <a href="mailto:bharathihomoeopathy246@gmail.com" className="text-[11.5px] text-slate-200 hover:text-amber-300 font-medium truncate transition-colors">
                  bharathihomoeopathy246@gmail.com
                </a>
              </div>

              {/* Timings */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="text-[11.5px] text-slate-200 font-medium leading-snug">
                  <p>Mon - Sat: 9:30 AM - 1:30 PM, 5:30 PM - 9:30 PM</p>
                  <p className="text-amber-300 font-bold mt-0.5">Sunday: Closed</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Copyright & Designer Credit Bar */}
      <div className="border-t border-white/10 bg-[#051c2b] py-4 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[11px] font-medium">
          <p>© 2025 Dr. Bharathi’s Homeo Care. All Rights Reserved.</p>
          <p>Designed with <span className="text-rose-500 font-bold">❤️</span> by YuvaTech Solutions</p>
        </div>
      </div>

    </footer>
  );
};
