import React from 'react';
import { ScrollReveal } from './ScrollReveal';

export const SectionHeader = ({ title, isMainTitle = false }) => {
  return (
    <ScrollReveal direction="up" duration={750}>
      <div className="flex flex-col items-center justify-center w-full mt-4 mb-8 overflow-hidden">
        {/* Top Decorative Lines and Icon */}
        <div className="flex items-center justify-center w-full max-w-4xl gap-4 px-4">
          {/* Left Lines */}
          <div className="flex flex-col flex-1 gap-1.5 opacity-90">
            <div className="h-[2.5px] bg-[#0f3e5c] w-full rounded-full"></div>
            <div className="h-[1.5px] bg-[#a9c3d9] w-[95%] ml-auto rounded-full"></div>
          </div>

          {/* Central Icon */}
          <div className="flex-shrink-0 flex items-center justify-center -mt-2">
            <svg width="50" height="60" viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
              {/* Orange Left Shape */}
              <path d="M 25 2 C 5 15 5 45 25 58 C 15 45 15 15 25 2 Z" fill="#c26839"/>
              {/* Navy Blue Right Shape (Person) */}
              <circle cx="35" cy="18" r="4.5" fill="#0f3e5c"/>
              <path d="M 25 22 C 32 25 37 25 43 19 C 38 28 35 32 32 38 C 30 45 28 52 27 58 C 29 48 29 35 25 22 Z" fill="#0f3e5c"/>
            </svg>
          </div>

          {/* Right Lines */}
          <div className="flex flex-col flex-1 gap-1.5 opacity-90">
            <div className="h-[2.5px] bg-[#0f3e5c] w-full rounded-full"></div>
            <div className="h-[1.5px] bg-[#a9c3d9] w-[95%] mr-auto rounded-full"></div>
          </div>
        </div>

        {/* Title Text */}
        {isMainTitle ? (
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-extrabold text-[#0f3e5c] tracking-wide mt-2 mb-3 text-center drop-shadow-xs">
            {title}
          </h1>
        ) : (
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-extrabold text-[#0f3e5c] tracking-wide mt-2 mb-3 text-center drop-shadow-xs">
            {title}
          </h2>
        )}

        {/* Bottom Decorative Divider */}
        <div className="flex items-center justify-center w-full max-w-xl gap-2.5 px-4">
          <div className="h-[1.5px] bg-[#c26839] flex-1 rounded-full"></div>
          
          {/* Four-point star/sparkle */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 8 0 C 8 6 10 8 16 8 C 10 8 8 10 8 16 C 8 10 6 8 0 8 C 6 8 8 6 8 0 Z" fill="#c26839"/>
          </svg>
          
          <div className="flex gap-2.5 mx-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0f3e5c]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#0f3e5c]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#0f3e5c]"></div>
          </div>

          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 8 0 C 8 6 10 8 16 8 C 10 8 8 10 8 16 C 8 10 6 8 0 8 C 6 8 8 6 8 0 Z" fill="#c26839"/>
          </svg>

          <div className="h-[1.5px] bg-[#c26839] flex-1 rounded-full"></div>
        </div>
      </div>
    </ScrollReveal>
  );
};
