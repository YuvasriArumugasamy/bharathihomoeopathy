import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = "Unable to load content",
  message = "Something went wrong while connecting. Please try again.",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-2xl border border-rose-100 shadow-sm max-w-md mx-auto">
      <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-navy-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-smooth"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
