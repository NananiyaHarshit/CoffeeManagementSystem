import React from 'react';

const SkeletonLoader = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-2xl bg-white p-4 shadow-card border border-caramel/10"
        >
          <div className="h-48 w-full rounded-xl bg-caramel/15 mb-4"></div>
          <div className="h-4 w-1/3 rounded bg-caramel/20 mb-2"></div>
          <div className="h-6 w-3/4 rounded bg-caramel/25 mb-2"></div>
          <div className="h-4 w-full rounded bg-caramel/10 mb-4"></div>
          <div className="flex items-center justify-between pt-2">
            <div className="h-6 w-1/4 rounded bg-caramel/30"></div>
            <div className="h-9 w-24 rounded-full bg-caramel/30"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
