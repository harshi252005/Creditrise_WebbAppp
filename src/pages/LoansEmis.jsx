import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, CreditCard, ChevronLeft, Lightbulb, CheckCircle, Clock } from 'lucide-react';
import { dataService } from '../services/api';
import { useAuth } from '../services/AuthContext';
import Navbar from '../components/Navbar';

const EMICard = ({ emi, onPay }) => {
  const isPaid = emi.status === 'paid';
  
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 p-7 rounded-[2rem] space-y-6 group hover:border-primary/30 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-xl font-bold text-white">{emi.bank_name}</h4>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/20">
              Active
            </span>
            <span className="text-slate-500 text-sm font-medium">
              {isPaid ? 'Payment Completed' : 'Upcoming Payment'}
            </span>
          </div>
        </div>
        {isPaid && (
          <div className="p-2 bg-secondary/20 text-secondary rounded-full">
            <CheckCircle size={20} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-700/20">
          <div className="p-2 bg-secondary/15 text-secondary rounded-xl">
            <CreditCard size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-500 tracking-wider">EMI Amt</p>
            <p className="text-lg font-black text-white">₹{emi.emi_amount.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-700/20">
          <div className="p-2 bg-warning/15 text-warning rounded-xl">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Due Date</p>
            <p className="text-lg font-black text-white">{new Date(emi.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
          </div>
        </div>
      </div>

      {!isPaid && (
        <button
          onClick={() => onPay(emi)}
          className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          Mark as Paid
        </button>
      )}
    </div>
  );
};

const LoansEmis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [emis, setEmis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmis = async () => {
      try {
        const response = await dataService.getEmis(user.id);
        setEmis(response.data);
      } catch (err) {
        console.error('Failed to fetch EMIs', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchEmis();
    }
  }, [user]);

  const upcomingEmis = emis.filter(e => e.status !== 'paid');
  const paidEmis = emis.filter(e => e.status === 'paid');
  const totalPending = upcomingEmis.reduce((sum, e) => sum + e.emi_amount, 0);

  const handlePay = (emi) => {
    navigate('/confirm-payment', { state: { emi } });
  };

  if (loading) return <div className="flex items-center justify-center h-full text-slate-400">Loading EMIs...</div>;

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-10">
      <Navbar title="My Loans & EMIs" />

      <main className="p-6 space-y-10 md:p-10 max-w-5xl mx-auto">
        {/* Total Pending Card */}
        <section className="bg-risk/10 border-2 border-risk/20 p-10 rounded-[3rem] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 text-risk/10 group-hover:text-risk/20 transition-colors">
            <CreditCard size={100} />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div>
              <p className="text-risk/80 text-sm font-black uppercase tracking-widest mb-2">Total Pending EMIs</p>
              <h2 className="text-7xl font-black text-white tracking-tighter">₹{totalPending.toLocaleString()}</h2>
              <p className="text-risk/60 text-lg font-bold mt-2">{upcomingEmis.length} payments due</p>
            </div>

            <div className="bg-risk/20 backdrop-blur-md p-4 rounded-2xl border border-risk/30 flex items-center space-x-4">
              <div className="p-2 bg-warning rounded-lg text-slate-900">
                <Lightbulb size={20} />
              </div>
              <p className="text-risk/90 text-xs font-bold leading-relaxed">
                Pay on time to boost your credit score by 20-30 points!
              </p>
            </div>
          </div>
        </section>

        {/* Add New EMI Button */}
        <button 
          onClick={() => navigate('/add-emi')}
          className="w-full bg-slate-800/40 border-2 border-slate-700/50 border-dashed p-8 rounded-[2.5rem] flex items-center justify-center space-x-6 hover:bg-slate-800/60 hover:border-primary/50 transition-all group"
        >
          <div className="p-4 bg-primary/20 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition-all scale-110">
            <Plus size={32} strokeWidth={3} />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-black text-white">Add New EMI</h3>
            <p className="text-slate-500 font-bold">Track your loan payments easily</p>
          </div>
        </button>

        {/* Upcoming EMIs Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black text-white">Upcoming EMIs</h3>
            <div className="px-4 py-2 bg-warning/15 border border-warning/30 rounded-full flex items-center space-x-2">
              <Clock className="text-warning" size={16} />
              <span className="text-warning text-sm font-black">{upcomingEmis.length} Due</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEmis.length > 0 ? (
              upcomingEmis.map(emi => (
                <EMICard key={emi.id} emi={emi} onPay={handlePay} />
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-slate-800/20 rounded-[2rem] border border-slate-700/50">
                <p className="text-slate-500 font-bold">No upcoming EMIs. You're all clear! 🚀</p>
              </div>
            )}
          </div>
        </section>

        {/* Payment History Section */}
        {paidEmis.length > 0 && (
          <section className="space-y-6 opacity-80">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-black text-white">Payment History</h3>
              <div className="px-4 py-2 bg-secondary/15 border border-secondary/30 rounded-full flex items-center space-x-2">
                <CheckCircle className="text-secondary" size={16} />
                <span className="text-secondary text-sm font-black">{paidEmis.length} Paid</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paidEmis.map(emi => (
                <EMICard key={emi.id} emi={emi} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default LoansEmis;
