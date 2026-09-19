import React from 'react';

/**
 * Skeleton Loader Component
 * Shows loading animation while data is fetching
 */

export const SkeletonLoader = ({ type = 'order', count = 3 }) => {
  if (type === 'order') {
    return (
      <div className="space-y-3 sm:space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 p-3.5 sm:p-4 space-y-3 animate-pulse"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                <div className="h-4 w-20 bg-slate-200 rounded"></div>
                <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
              </div>
              <div className="h-5 w-16 bg-slate-200 rounded"></div>
            </div>

            {/* Product name */}
            <div className="h-3 w-3/4 bg-slate-200 rounded"></div>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <div className="h-8 bg-slate-100 rounded-lg"></div>
              <div className="h-8 bg-slate-100 rounded-lg"></div>
              <div className="h-8 bg-slate-100 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'appointment') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-3.5 sm:p-4 rounded-xl border border-slate-200 animate-pulse space-y-2"
          >
            <div className="flex items-center gap-2">
              <div className="h-5 w-32 bg-slate-200 rounded"></div>
              <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
            </div>
            <div className="h-3 w-48 bg-slate-200 rounded"></div>
            <div className="h-3 w-36 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'prescription') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-3.5 sm:p-4 rounded-xl border border-slate-200 animate-pulse space-y-2"
          >
            <div className="h-4 w-28 bg-slate-200 rounded"></div>
            <div className="h-3 w-40 bg-slate-200 rounded"></div>
            <div className="h-3 w-32 bg-slate-200 rounded"></div>
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-24 bg-slate-100 rounded-lg"></div>
              <div className="h-8 w-24 bg-slate-100 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card skeleton
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-slate-200 animate-pulse"
        >
          <div className="h-4 w-3/4 bg-slate-200 rounded mb-3"></div>
          <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
