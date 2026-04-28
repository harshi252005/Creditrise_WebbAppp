import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Building, CreditCard, Save, ArrowLeft } from 'lucide-react';
import { dataService } from '../services/api';
import { useAuth } from '../services/AuthContext';
import Navbar from '../components/Navbar';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    pan: '',
    address: '',
    income: '',
    employment: '',
    company: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await dataService.getProfile(user.id);
        if (response.data.success) {
          const d = response.data;
          setFormData({
            name: d.name || '',
            email: d.email || '',
            phone: d.phone || '',
            dob: d.dob || '',
            pan: d.pan || '',
            address: d.address || '',
            income: d.income || '',
            employment: d.employment || '',
            company: d.company || ''
          });
        }
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await dataService.updateProfile(user.id, formData);
      if (response.data.status === 'success') {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => navigate('/profile'), 1500);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-primary font-black text-2xl uppercase">Loading Details...</div>;

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-10">
      <Navbar title="Edit Profile" />

      <main className="p-6 md:p-10 max-w-4xl mx-auto space-y-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {message.text && (
            <div className={`p-4 rounded-2xl border text-sm font-bold ${
              message.type === 'success' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-risk/10 border-risk/20 text-risk'
            }`}>
              {message.text}
            </div>
          )}

          {/* Personal Section */}
          <section className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-xl font-black text-white flex items-center space-x-3">
              <User size={20} className="text-primary" />
              <span>Personal Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest pl-2">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-white font-bold focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest pl-2">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} readOnly className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-slate-500 font-bold outline-none cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest pl-2">Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-white font-bold focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest pl-2">Date of Birth</label>
                <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-white font-bold focus:border-primary outline-none transition-all" />
              </div>
            </div>
          </section>

          {/* Identity & Address */}
          <section className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-xl font-black text-white flex items-center space-x-3">
              <ShieldCheck size={20} className="text-secondary" />
              <span>Identity & Location</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest pl-2">PAN Card Number</label>
                <input name="pan" value={formData.pan} onChange={handleChange} className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-white font-bold focus:border-primary outline-none tracking-widest" placeholder="ABCDE1234F" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest pl-2">Residential Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-white font-bold focus:border-primary outline-none transition-all" />
              </div>
            </div>
          </section>

          {/* Professional Section */}
          <section className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-xl font-black text-white flex items-center space-x-3">
              <Briefcase size={20} className="text-warning" />
              <span>Professional Details</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest pl-2">Monthly Income</label>
                <input name="income" value={formData.income} onChange={handleChange} className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-white font-bold focus:border-primary outline-none transition-all" placeholder="₹50,000" />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest pl-2">Employment Type</label>
                <select name="employment" value={formData.employment} onChange={handleChange} className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-white font-bold focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                  <option value="">Select Category</option>
                  <option value="Salaried">Salaried</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Student">Student</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-slate-400 text-xs font-black uppercase tracking-widest pl-2">Current Employer/Organization</label>
                <input name="company" value={formData.company} onChange={handleChange} className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-white font-bold focus:border-primary outline-none transition-all" />
              </div>
            </div>
          </section>

          <div className="flex space-x-4 pt-10">
            <button 
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 py-6 bg-slate-800/40 border-2 border-slate-700/50 text-white rounded-[2rem] font-black text-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="flex-1 py-6 bg-gradient-to-r from-primary to-accent text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center space-x-3"
            >
              {saving ? <RefreshCcw className="animate-spin" /> : <Save size={24} />}
              <span>SAVE CHANGES</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

// Simple icon shim if ShieldCheck is missing from imports list (I added it to write_to_file)
const ShieldCheck = ({ size, className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

export default EditProfile;
