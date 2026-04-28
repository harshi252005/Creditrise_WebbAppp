import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Activity, Sparkles, User, CreditCard } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: <Shield size={24} />, path: '/dashboard' },
    { name: 'My Loans', icon: <CreditCard size={24} />, path: '/loans' },
    { name: 'Analysis', icon: <Activity size={24} />, path: '/analysis' },
    { name: 'AI Coach', icon: <Sparkles size={24} />, path: '/coach' },
    { name: 'Profile', icon: <User size={24} />, path: '/profile' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-80 bg-slate-950 border-r border-slate-800 p-8 h-screen sticky top-0">
      <div className="flex items-center space-x-4 mb-16 px-4">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40">
          <Shield className="text-white" size={28} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">CreditRise</h1>
      </div>

      <nav className="flex-1 space-y-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-5 px-6 py-5 rounded-[2rem] transition-all duration-300 font-extrabold uppercase text-sm tracking-widest ${
                isActive
                  ? 'bg-primary text-white shadow-2xl shadow-primary/20 scale-105'
                  : 'text-slate-500 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-900/30 to-slate-900 border border-indigo-500/20 shadow-2xl">
        <p className="text-white font-black text-lg mb-2">Build Better Credit</p>
        <p className="text-slate-500 text-xs font-bold leading-relaxed">Your journey to financial freedom starts here.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
