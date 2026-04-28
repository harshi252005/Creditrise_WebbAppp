import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Upload, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { dataService } from '../services/api';
import { useAuth } from '../services/AuthContext';
import Navbar from '../components/Navbar';

const ConfirmPayment = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const emi = location.state?.emi;

  const [timing, setTiming] = useState('on_time');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!emi) {
    return <div className="p-10 text-center text-slate-400">No EMI data found. Please go back.</div>;
  }

  const timingOptions = [
    { id: 'early_3', label: 'Paid 3+ days before due date', points: '+8', color: 'text-secondary', bg: 'bg-secondary/10' },
    { id: 'early_1', label: 'Paid 1-2 days before due date', points: '+5', color: 'text-secondary', bg: 'bg-secondary/10' },
    { id: 'on_time', label: 'Paid on due date', points: '+3', color: 'text-primary', bg: 'bg-primary/10' },
    { id: 'late', label: 'Paid late', points: '-15', color: 'text-risk', bg: 'bg-risk/10' },
  ];

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const selectedOption = timingOptions.find(opt => opt.id === timing);
      const points = selectedOption ? parseInt(selectedOption.points.replace('+', '')) : 0;
      
      const response = await dataService.updateEmiStatus(emi.id, points);
      if (response.data.success) {
        navigate('/loans');
      } else {
        setError(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-10">
      <Navbar title="Confirm EMI Payment" />

      <main className="p-6 space-y-8 md:p-10 max-w-2xl mx-auto">
        {/* EMI Info Card */}
        <section className="bg-gradient-to-br from-primary to-accent p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute -bottom-4 -right-4 text-white/5 rotate-12 transition-transform group-hover:scale-110">
            <CreditCard size={180} />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center space-x-5">
              <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-xl">
                <CreditCard className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white leading-none">{emi.bank_name}</h2>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                    Active
                  </span>
                  <p className="text-white/70 text-sm font-bold">Loan Account</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/20 grid grid-cols-2 gap-8 shadow-inner">
              <div className="space-y-1">
                <p className="text-white/60 text-xs font-black uppercase tracking-wider">EMI Amount</p>
                <p className="text-3xl font-black text-white">₹{emi.emi_amount.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-white/60 text-xs font-black uppercase tracking-wider">Due Date</p>
                <p className="text-2xl font-black text-white">{new Date(emi.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 px-2">
            <div className="p-2 bg-primary/20 text-primary rounded-xl">
               <Calendar size={20} />
            </div>
            <h3 className="text-xl font-black text-white">When did you pay the EMI?</h3>
          </div>

          <div className="space-y-3">
            {timingOptions.map(opt => (
              <label 
                key={opt.id}
                className={`flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer ${
                  timing === opt.id 
                    ? 'bg-slate-800 border-primary shadow-lg shadow-primary/10' 
                    : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    timing === opt.id ? 'border-primary' : 'border-slate-600'
                  }`}>
                    {timing === opt.id && <div className="w-3 h-3 bg-primary rounded-full" />}
                  </div>
                  <span className="text-white font-bold text-lg leading-tight">{opt.label}</span>
                </div>
                <div className={`px-4 py-2 rounded-2xl ${opt.bg} ${opt.color} text-xs font-black`}>
                  {opt.points} points
                </div>
                <input 
                  type="radio" 
                  name="timing" 
                  value={opt.id} 
                  checked={timing === opt.id}
                  onChange={() => setTiming(opt.id)}
                  className="hidden"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Upload Receipt */}
        <section className="bg-slate-800/40 border-2 border-slate-700/50 p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-primary/20 text-primary rounded-xl">
                <Upload size={20} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-white leading-tight">Upload<br/>Payment Receipt</h4>
              </div>
            </div>
            <span className="text-primary text-sm font-black uppercase tracking-widest'">(Optional)</span>
          </div>

          <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center space-y-4 hover:bg-primary/10 transition-all cursor-pointer">
            <div className="p-4 bg-primary/20 text-primary rounded-full">
              <Upload size={32} />
            </div>
            <div>
              <p className="text-primary text-xl font-black">Click to upload receipt</p>
              <p className="text-primary/60 text-sm font-bold uppercase tracking-tighter mt-1">PNG, JPG, or PDF (Max 5MB)</p>
            </div>
          </div>
        </section>

        {/* Impact Info */}
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-[2rem] flex items-start space-x-5">
          <div className="p-3 bg-primary/20 rounded-2xl text-primary shrink-0">
            <Info size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-black text-lg">Score Impact</h4>
            <p className="text-slate-400 text-sm font-medium italic leading-relaxed">
              Paying your EMIs on time or early significantly boosts your credit score. Late payments can severely damage your creditworthiness.
            </p>
          </div>
        </div>

        {error && <p className="text-risk text-center font-bold">{error}</p>}

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full py-5 bg-slate-800 border-2 border-slate-700 rounded-[1.5rem] text-slate-500 font-black text-2xl flex items-center justify-center space-x-4 hover:border-primary hover:text-primary transition-all group active:scale-95 disabled:opacity-50"
        >
          <CheckCircle className="group-hover:text-primary transition-colors" size={28} />
          <span>{loading ? 'Confirming...' : 'Confirm Payment'}</span>
        </button>
      </main>
    </div>
  );
};

export default ConfirmPayment;
