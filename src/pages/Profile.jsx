import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Award, Shield, LogOut, ChevronRight, Star, CreditCard, Clock, Activity } from 'lucide-react';
import { dataService } from '../services/api';
import { useAuth } from '../services/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await dataService.getProfile(user.id);
        if (response.data.success) {
          setProfileData(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("ARE YOU SURE? This will permanently erase your credit history and profile. This action cannot be undone.")) {
      try {
        const response = await dataService.deleteAccount(user.id);
        if (response.data.success) {
          alert("Account deleted successfully.");
          logout();
          navigate('/login');
        }
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  const handleEditPersonalDetails = () => {
    navigate('/edit-profile');
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-primary font-black text-2xl">LOADING PROFILE...</div>;

  const data = profileData || {
    name: user.fullname,
    email: user.email,
    phone: user.phone || "+91 98765 43210",
    member_since: "Jan 2023",
    score: 742,
    credit_limit: 550000,
    xp: 2450,
    level: 12,
    zone: "Elite Range",
    credit_age: "3.2 yrs"
  };

  const options = [
    { label: 'View Full Credit Report', icon: <Activity className="text-primary" size={20} />, path: '/analysis' },
    { label: 'Score Drop Analyzer', icon: <Activity className="text-risk" size={20} />, path: '/analysis' },
    { label: 'Notifications', icon: <Activity className="text-warning" size={20} />, path: '/dashboard' },
    { label: 'Privacy & Security', icon: <Shield className="text-secondary" size={20} />, path: '#' },
    { label: 'Personal Details', icon: <User className="text-primary" size={20} />, path: '#', onClick: handleEditPersonalDetails },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-10">
      <Navbar title="Profile" />

      <main className="p-6 space-y-10 md:p-10 max-w-4xl mx-auto">
        {/* Profile Card */}
        <section className="bg-gradient-to-br from-primary to-accent p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 text-white/5 rotate-12 group-hover:scale-110 transition-transform">
             <User size={240} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-xl border-4 border-white/30 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl">
              {data.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-4xl font-black text-white leading-none tracking-tight">{data.name}</h2>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-center md:justify-start space-x-2 text-white/70 font-bold">
                  <Mail size={16} />
                  <span>{data.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2 text-white/70 font-bold">
                  <Phone size={16} />
                  <span>{data.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4 mt-10">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/20">
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Member Since</p>
              <p className="text-xl font-black text-white">{data.member_since}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/20">
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Plan</p>
              <p className="text-xl font-black text-white uppercase tracking-tighter">Premium</p>
            </div>
          </div>
        </section>

        {/* Credit Summary */}
        <section className="bg-slate-800/40 border-2 border-slate-700/50 p-8 rounded-[2.5rem] space-y-8">
           <h3 className="text-2xl font-black text-white px-2">Credit Summary</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-6 bg-slate-900/60 rounded-[2rem] border border-slate-800">
                <div className="flex items-center space-x-5">
                  <div className="p-4 bg-secondary/20 text-secondary rounded-2xl">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">Current Score</h4>
                    <p className="text-slate-500 text-sm font-bold">{data.zone}</p>
                  </div>
                </div>
                <span className="text-3xl font-black text-white tracking-tighter">{data.score}</span>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-900/60 rounded-[2rem] border border-slate-800">
                <div className="flex items-center space-x-5">
                  <div className="p-4 bg-primary/20 text-primary rounded-2xl">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">Total Credit Limit</h4>
                    <p className="text-slate-500 text-sm font-bold">Across all accounts</p>
                  </div>
                </div>
                <span className="text-3xl font-black text-white tracking-tighter">₹{(data.credit_limit / 100000).toFixed(1)}L</span>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-900/60 rounded-[2rem] border border-slate-800">
                <div className="flex items-center space-x-5">
                  <div className="p-4 bg-accent/20 text-accent rounded-2xl">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">Credit Age</h4>
                    <p className="text-slate-500 text-sm font-bold">Oldest account age</p>
                  </div>
                </div>
                <span className="text-3xl font-black text-white tracking-tighter">{data.credit_age}</span>
              </div>
           </div>
        </section>

        {/* Options */}
        <section className="space-y-4">
          {options.map((opt, idx) => (
            <button 
              key={idx}
              onClick={() => opt.path !== '#' && navigate(opt.path)}
              className="w-full flex items-center justify-between p-7 bg-slate-800/40 hover:bg-slate-800/60 transition-all rounded-[2rem] border border-slate-700/50 group"
            >
              <div className="flex items-center space-x-5">
                <div className="p-4 bg-slate-900/60 rounded-2xl group-hover:scale-110 transition-transform">
                  {opt.icon}
                </div>
                <span className="text-xl font-bold text-white tracking-tight">{opt.label}</span>
              </div>
              <ChevronRight className="text-slate-500 group-hover:text-white transition-colors" size={24} />
            </button>
          ))}
        </section>

        {/* Experience Points Card */}
        <section className="bg-gradient-to-br from-warning/20 to-warning/5 border-2 border-warning/20 p-8 rounded-[3rem] space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-2xl font-black text-white mb-1">Experience Points</h4>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Level {data.level} - Credit Master</p>
            </div>
             <div className="p-3 bg-warning text-slate-900 rounded-2xl shadow-lg shadow-warning/20">
               <Star size={24} fill="currentColor" />
             </div>
          </div>

          <div className="space-y-4">
            <div className="h-4 w-full bg-slate-900/60 rounded-full overflow-hidden border border-slate-800">
               <div className="h-full bg-gradient-to-r from-warning to-orange-500 w-[70%] rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)]" />
            </div>
            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
               <span>{data.xp.toLocaleString()} XP</span>
               <span>Next level: 3,500 XP</span>
            </div>
          </div>
        </section>

        {/* Logout & Delete */}
        <div className="space-y-4 mt-10 md:mt-20">
          <button 
            onClick={handleLogout}
            className="w-full py-6 bg-slate-800/40 border-2 border-slate-700/50 hover:bg-slate-800/60 text-white rounded-[2rem] font-black text-2xl flex items-center justify-center space-x-4 transition-all active:scale-[0.98] group"
          >
            <LogOut size={28} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout Account</span>
          </button>
          
          <button 
            onClick={handleDeleteAccount}
            className="w-full py-4 text-risk/40 hover:text-risk font-black text-sm uppercase tracking-[0.2em] transition-all"
          >
            Permanently Delete Account
          </button>
        </div>
      </main>
    </div>
  );
};

// Helper for TrendingUp replacement in component
const TrendingUp = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default Profile;
