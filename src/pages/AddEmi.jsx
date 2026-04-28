import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Sparkles, Calendar, Lightbulb, CheckCircle } from 'lucide-react';
import { dataService } from '../services/api';
import { useAuth } from '../services/AuthContext';
import Navbar from '../components/Navbar';

const AddEmi = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bank_name: '',
    emi_amount: '',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmi = async (e) => {
    e.preventDefault();
    if (!formData.bank_name || !formData.emi_amount || !formData.due_date) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await dataService.addEmi(user.id, formData);
      if (response.status === 201) {
        navigate('/loans');
      } else {
        setError(response.data.error || 'Failed to add EMI');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-10">
      <Navbar title="Add EMI" />
      
      <main className="p-6 space-y-8 md:p-10 max-w-2xl mx-auto">
        <header className="text-center space-y-2">
          <p className="text-slate-400 text-lg font-medium">Add your loan or credit card EMI details</p>
        </header>

        {/* Promo Card */}
        <section className="bg-gradient-to-br from-primary to-primary/80 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 p-8 text-white/10">
            <CheckCircle size={80} />
          </div>
          <div className="relative z-10">
            <p className="text-primary-foreground/70 text-sm font-black uppercase tracking-widest mb-2">Track Your EMIs</p>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">Stay on Top</h2>
            <p className="text-primary-foreground/90 text-sm font-bold max-w-[200px]">
              Never miss a payment and boost your credit score
            </p>
          </div>
        </section>

        <form onSubmit={handleAddEmi} className="space-y-6">
          {error && (
            <div className="bg-risk/10 border border-risk/20 text-risk text-sm p-4 rounded-2xl font-bold">
              {error}
            </div>
          )}

          {/* Bank Name */}
          <div className="space-y-2">
            <label className="text-white text-lg font-black ml-2">Bank Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary transition-colors text-slate-500">
                <CreditCard size={24} />
              </div>
              <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                className="block w-full pl-14 pr-6 py-5 bg-slate-800/50 border-2 border-slate-700/50 rounded-[1.5rem] text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-xl font-bold"
                placeholder="Enter bank name"
                required
              />
            </div>
          </div>

          {/* EMI Amount */}
          <div className="space-y-2">
            <label className="text-white text-lg font-black ml-2">EMI Amount</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-secondary">
                <Sparkles size={24} />
              </div>
              <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                <span className="text-white text-xl font-black">₹</span>
              </div>
              <input
                type="number"
                name="emi_amount"
                value={formData.emi_amount}
                onChange={handleChange}
                className="block w-full pl-20 pr-6 py-5 bg-slate-800/50 border-2 border-slate-700/50 rounded-[1.5rem] text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-xl font-bold"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-white text-lg font-black ml-2">Due Date</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-warning">
                <Calendar size={24} />
              </div>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="block w-full pl-14 pr-6 py-5 bg-slate-800/50 border-2 border-slate-700/50 rounded-[1.5rem] text-white focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-xl font-bold [color-scheme:dark]"
                required
              />
            </div>
          </div>

          {/* Pro Tip Card */}
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-[2rem] flex items-start space-x-5">
            <div className="p-3 bg-primary/20 rounded-2xl text-primary shrink-0">
              <Lightbulb size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-black text-lg">💡 Pro Tip</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-medium italic">
                Setting up auto-pay for EMIs can improve your credit score by ensuring timely payments and building a positive payment history.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-black rounded-[1.5rem] shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 text-xl mt-4"
          >
            {loading ? 'Adding EMI...' : 'Add EMI'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddEmi;
