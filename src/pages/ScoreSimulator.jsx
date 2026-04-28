import React, { useState } from 'react';
import { Zap, RefreshCcw, Layout, ChevronRight, PieChart, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { dataService } from '../services/api';
import { useAuth } from '../services/AuthContext';
import Navbar from '../components/Navbar';

const ScoreSimulator = () => {
  const { user } = useAuth();
  const [params, setParams] = useState({
    user_id: user.id,
    credit_utilization: 30,
    payment_history: 'good',
    inquiries: 1
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const simulate = async () => {
    setLoading(true);
    try {
      const response = await dataService.simulateScore(params);
      setResult(response.data);
    } catch (err) {
      console.error("Simulation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-10">
      <Navbar title="Score Simulator" />

      <main className="p-6 md:p-10 max-w-4xl mx-auto space-y-10">
        {/* Results Billboard */}
        <section className={`relative overflow-hidden p-12 rounded-[3.5rem] transition-all duration-700 ${
          result ? 'bg-gradient-to-br from-indigo-600 to-primary' : 'bg-slate-800/40 border border-slate-700/50'
        }`}>
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            {result ? (
              <>
                <p className="text-white/60 text-sm font-black uppercase tracking-widest">Simulated Future Score</p>
                <div className="flex items-center space-x-6">
                  <h2 className="text-9xl font-black text-white leading-none tracking-tighter animate-in zoom-in duration-500">{result.predicted_score}</h2>
                </div>
                <div className="mt-4 flex flex-col items-center space-y-4">
                   <div className="px-8 py-3 bg-white text-primary rounded-full text-xl font-black shadow-2xl">
                     {result.zone} Range
                   </div>
                   <p className="text-white/80 font-bold italic">
                     {result.predicted_score > result.base_score 
                        ? `A potential gain of ${result.predicted_score - result.base_score} points!` 
                        : `Your score might drop by ${result.base_score - result.predicted_score} points.`
                     }
                   </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-slate-900/60 rounded-[2rem] flex items-center justify-center text-slate-600 mb-4 animate-pulse">
                  <Zap size={48} />
                </div>
                <h3 className="text-3xl font-black text-white">Ready to Simulate?</h3>
                <p className="text-slate-500 font-bold max-w-xs italic">Change the parameters below to see how they impact your credit health.</p>
              </>
            )}
          </div>
        </section>

        {/* Simulator Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Left: Inputs */}
           <section className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] space-y-8">
             <div className="space-y-4">
               <label className="flex justify-between items-center">
                 <span className="text-slate-300 font-black text-sm uppercase tracking-widest">Credit Usage</span>
                 <span className="text-primary font-black text-lg">{params.credit_utilization}%</span>
               </label>
               <input 
                 type="range" min="0" max="100" step="5"
                 value={params.credit_utilization}
                 onChange={(e) => setParams({...params, credit_utilization: parseInt(e.target.value)})}
                 className="w-full h-3 bg-slate-900 rounded-full appearance-none cursor-pointer accent-primary"
               />
               <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase">
                 <span>Conservative</span>
                 <span>aggressive</span>
               </div>
             </div>

             <div className="space-y-4">
               <label className="text-slate-300 font-black text-sm uppercase tracking-widest">Payment History</label>
               <div className="grid grid-cols-1 gap-3">
                 {[
                   { id: 'early', label: 'Paid 5+ Days Early', icon: <CheckCircle2 size={16} />, color: 'text-secondary' },
                   { id: 'on_time', label: 'On Time Payment', icon: <CheckCircle2 size={16} />, color: 'text-primary' },
                   { id: 'late', label: 'Late Payment (>3 Days)', icon: <AlertTriangle size={16} />, color: 'text-risk' }
                 ].map(opt => (
                   <button 
                    key={opt.id}
                    onClick={() => setParams({...params, payment_history: opt.id})}
                    className={`flex items-center space-x-3 p-4 rounded-2xl border transition-all ${
                      params.payment_history === opt.id 
                        ? 'bg-slate-900 border-primary text-white' 
                        : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700'
                    }`}
                   >
                     <div className={params.payment_history === opt.id ? opt.color : 'text-slate-700'}>
                       {opt.icon}
                     </div>
                     <span className="text-sm font-bold">{opt.label}</span>
                   </button>
                 ))}
               </div>
             </div>

             <div className="space-y-4">
               <label className="flex justify-between items-center">
                 <span className="text-slate-300 font-black text-sm uppercase tracking-widest">Hard Inquiries</span>
                 <span className="text-white font-black text-lg">{params.inquiries}</span>
               </label>
               <input 
                 type="number" min="0" max="10"
                 value={params.inquiries}
                 onChange={(e) => setParams({...params, inquiries: parseInt(e.target.value)})}
                 className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white font-black focus:outline-none focus:border-primary"
               />
               <p className="text-[10px] text-slate-600 font-bold italic">New credit applications within 6 months</p>
             </div>

             <button 
               onClick={simulate}
               disabled={loading}
               className="w-full py-6 bg-gradient-to-r from-primary to-accent text-white rounded-[2rem] font-black text-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center space-x-3"
             >
               {loading ? <RefreshCcw className="animate-spin" /> : <Zap fill="currentColor" />}
               <span>RUN SIMULATION</span>
             </button>
           </section>

           {/* Right: Insight */}
           <section className="space-y-6">
              <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] space-y-4">
                 <div className="flex items-center space-x-3 text-warning">
                   <AlertTriangle size={24} />
                   <h4 className="text-lg font-black uppercase italic">Sim Insights</h4>
                 </div>
                 <p className="text-slate-400 font-bold italic leading-relaxed">
                   Did you know? Payment history accounts for <strong className="text-white">35%</strong> of your total score. 
                   Even a single late payment can wipe out 6 months of hard work.
                 </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] space-y-4">
                 <div className="flex items-center space-x-3 text-secondary">
                   <CheckCircle2 size={24} />
                   <h4 className="text-lg font-black uppercase italic">Recommendation</h4>
                 </div>
                 <p className="text-slate-400 font-bold italic leading-relaxed">
                   Based on your selection, aim for <strong className="text-white">Under 20%</strong> utilization to see the 
                   highest potential score bump in the shortest time.
                 </p>
              </div>
           </section>
        </div>
      </main>
    </div>
  );
};

export default ScoreSimulator;
