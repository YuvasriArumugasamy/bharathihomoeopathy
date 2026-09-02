import React from 'react';
import { PackageOpen, AlertCircle, RefreshCw, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  title = "Your Wishlist is Empty",
  description = "You haven't saved any remedies or formulas yet. Click the heart icon on any product to save it to your personal wishlist.",
  actionText = "Explore Natural Remedies",
  onAction,
  actionLink,
  icon: CustomIcon
}) => {
  const IconComponent = CustomIcon || Heart;

  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.08)] max-w-xl mx-auto text-center relative overflow-hidden space-y-6 group">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423]" />

      {/* Icon Pod */}
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-50 to-orange-100/80 border border-orange-200/80 text-[#f97316] flex items-center justify-center mx-auto relative shadow-lg shadow-orange-500/10 group-hover:scale-105 transition-transform duration-300">
        <IconComponent className="w-10 h-10 text-[#f97316] animate-pulse" />
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-brandOrange-500 to-amber-500 text-white flex items-center justify-center shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-medium">{description}</p>
      </div>
      
      {/* CTA Action Button */}
      <div className="pt-2">
        {actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2.5 px-7 py-4 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] hover:scale-105 active:scale-95 rounded-2xl shadow-lg shadow-orange-500/25 transition-all duration-200 cursor-pointer"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : onAction ? (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2.5 px-7 py-4 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] hover:scale-105 active:scale-95 rounded-2xl shadow-lg shadow-orange-500/25 transition-all duration-200 cursor-pointer"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export const ErrorState = ({
  title = "Unable to load content",
  message = "Something went wrong while connecting. Please try again.",
  onRetry
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-rose-200/80 shadow-[0_15px_45px_rgba(15,23,42,0.08)] max-w-md mx-auto text-center relative overflow-hidden space-y-5">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-rose-600" />
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200/60 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{message}</p>
      </div>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-3 text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
