import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse flex flex-col gap-3">
      <div className="w-full h-48 bg-slate-200 rounded-xl"></div>
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      <div className="h-5 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mt-auto"></div>
      <div className="h-10 bg-slate-200 rounded-xl w-full mt-2"></div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};
