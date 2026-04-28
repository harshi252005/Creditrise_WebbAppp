import React from 'react';
import { Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const Navbar = ({ title }) => {
  const { user } = useAuth();
  
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 md:px-10">
      <div>
        {title ? (
          <h1 className="text-xl font-bold text-white">{title}</h1>
        ) : (
          <>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Welcome Back</p>
            <h1 className="text-2xl font-black text-white">{user?.fullname || 'User'}</h1>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/notifications" className="relative w-11 h-11 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          <Bell size={22} />
          <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-risk rounded-full border-2 border-slate-900 text-[9px] font-black text-white flex items-center justify-center">
            {user?.notifications || '0'}
          </span>
        </Link>
        
        <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">
          {getInitials(user?.fullname)}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
