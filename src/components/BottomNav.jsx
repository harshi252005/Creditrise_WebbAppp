import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Activity, Sparkles, User, CreditCard } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { name: 'Home', icon: <Shield size={24} />, path: '/dashboard' },
    { name: 'Loans', icon: <CreditCard size={24} />, path: '/loans' },
    { name: 'Analysis', icon: <Activity size={24} />, path: '/analysis' },
    { name: 'Coach', icon: <Sparkles size={24} />, path: '/coach' },
    { name: 'Profile', icon: <User size={24} />, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 bg-slate-950/80 backdrop-blur-2xl border-t border-slate-800 flex items-center justify-around px-4 pb-4 z-50 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center space-y-1 transition-all duration-300 w-full pt-4 ${
              isActive ? 'text-primary' : 'text-slate-500'
            }`
          }
        >
          <div className="relative">
            {item.icon}
            {/* Active Indicator */}
            <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary transition-opacity duration-300 pointer-events-none ${
              ({ isActive }) => isActive ? 'opacity-100' : 'opacity-0'
            }`} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
