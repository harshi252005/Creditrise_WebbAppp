import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-10">
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 md:px-10">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-slate-800 rounded-full animate-pulse" />
          <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 bg-slate-800 rounded-xl animate-pulse" />
          <div className="w-11 h-11 bg-slate-800 rounded-xl animate-pulse" />
        </div>
      </header>

      <main className="p-6 space-y-6 md:p-10 max-w-5xl mx-auto">
        {/* Credit Score Card Skeleton */}
        <section className="bg-slate-800/40 border border-slate-700/50 rounded-[2.5rem] p-8 h-80 animate-pulse" />

        {/* Info Grid Skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2rem] h-48 animate-pulse" />
          <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2rem] h-48 animate-pulse" />
        </section>

        {/* EMI Card Skeleton */}
        <section className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] h-32 animate-pulse" />

        {/* Quick Actions Skeleton */}
        <section className="space-y-4">
          <div className="h-6 w-32 bg-slate-800 rounded-full animate-pulse ml-2" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-slate-800/40 border border-slate-700/50 rounded-3xl animate-pulse" />
            <div className="h-32 bg-slate-800/40 border border-slate-700/50 rounded-3xl animate-pulse" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardSkeleton;
