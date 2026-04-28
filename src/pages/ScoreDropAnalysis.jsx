import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Calendar, CheckCircle2, ChevronLeft, Info, TrendingDown, ShieldAlert, Sparkles } from 'lucide-react';
import { dataService } from '../services/api';
import { useAuth } from '../services/AuthContext';
import Navbar from '../components/Navbar';

const ScoreDropAnalysis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dataService.getScoreDropAnalysis(user.id);
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch score drop analysis", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  if (loading) return <div className="p-10 text-center animate-pulse text-risk font-black text-2xl uppercase tracking-widest">Analyzing Score Drop...</div>;

  if (!data || data.drop_value === 0) {
    return (
      <div className="flex-1 overflow-y-auto pb-24 h-full flex flex-col items-center justify-center p-10 text-center space-y-6">
        <div className="p-8 bg-secondary/10 text-secondary rounded-[3rem] shadow-2xl">
          <CheckCircle2 size={80} />
        </div>
        <h2 className="text-3xl font-black text-white">Your Score is Stable!</h2>
        <p className="text-slate-400 font-bold max-w-md">We haven't detected any significant score drops recently. Keep up the good work!</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-10">
      <Navbar title="Score Drop Analysis" />

      <main className="p-6 space-y-10 md:p-10 max-w-5xl mx-auto">
        {/* Red Drop Card */}
        <section className="bg-gradient-to-br from-risk to-red-900/80 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 text-white/10 group-hover:text-white/20 transition-all">
            <TrendingDown size={140} />
          </div>
          
          <div className="relative z-10">
            <p className="text-red-100 text-sm font-black uppercase tracking-widest mb-4">Your Score Dropped By</p>
            <h2 className="text-9xl font-black text-white leading-none tracking-tighter mb-4">-{data.drop_value}</h2>
            <p className="text-red-100/70 font-bold text-xl ml-2 mb-10">This Month's Impact</p>

            {/* Comparison Box */}
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 flex items-center justify-between shadow-inner">
              <div className="space-y-1">
                <p className="text-white/60 text-xs font-black uppercase tracking-wider">Previous Score</p>
                <p className="text-4xl font-black text-white">{data.previous_score}</p>
              </div>
              <div className="p-4 bg-white/10 rounded-full text-white/50">
                <ArrowRight size={32} />
              </div>
              <div className="space-y-1 text-right">
                <p className="text-white/60 text-xs font-black uppercase tracking-wider">Current Score</p>
                <p className="text-4xl font-black text-white">{data.current_score}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Reason Section */}
        <section className="bg-slate-800/40 border-2 border-slate-700/50 p-10 rounded-[3rem] space-y-8">
          <div className="flex items-center space-x-5">
            <div className="p-4 bg-warning/20 text-warning rounded-3xl">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-2xl font-black text-white">Primary Reason</h3>
          </div>

          <div className="bg-warning/5 border border-warning/20 p-8 rounded-[2.5rem] space-y-4">
            <h4 className="text-xl font-black text-warning tracking-tight">{data.primary_reason_title}</h4>
            <p className="text-slate-300 font-bold italic leading-relaxed text-lg">
              {data.primary_reason_desc}
            </p>
          </div>
        </section>

        {/* Contributing Factors */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-white px-4">Contributing Factors</h3>
          <div className="space-y-4">
            {data.contributing_factors.map((factor, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-slate-800/60 transition-all">
                <div className="flex items-center space-x-5">
                  <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]`} style={{ color: factor.color }} />
                  <span className="text-xl font-bold text-white">{factor.title}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                   Impact: <span style={{ color: factor.color }}>{factor.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recovery Timeline */}
        <section className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-2 border-secondary/20 p-10 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 relative overflow-hidden">
          <div className="absolute top-0 left-0 p-8 text-secondary/5 -translate-x-1/4 -translate-y-1/4">
            <Calendar size={200} />
          </div>
          
          <div className="relative z-10 flex items-center space-x-6">
            <div className="p-5 bg-secondary text-slate-950 rounded-[2rem] shadow-xl shadow-secondary/20">
              <Calendar size={32} strokeWidth={3} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white">Recovery Timeline</h4>
              <p className="text-secondary/70 font-bold italic text-sm">Estimated time to bounce back</p>
            </div>
          </div>
          <div className="relative z-10 text-center md:text-right">
             <span className="text-6xl font-black text-secondary tracking-tighter">{data.recovery_timeline_days} Days</span>
             <p className="text-secondary/50 text-xs font-black uppercase tracking-widest mt-2">Consistent behavior required</p>
          </div>
        </section>

        {/* Recovery Action Plan */}
        <section className="space-y-6">
           <h3 className="text-2xl font-black text-white px-4">Recovery Action Plan</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {data.action_plan.map((action, idx) => (
               <div key={idx} className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] flex flex-col h-full space-y-6 shadow-xl hover:shadow-primary/5 transition-all">
                 <div className="flex justify-between items-start">
                   <div className="w-10 h-10 bg-primary/20 text-primary flex items-center justify-center rounded-2xl font-black text-xl">
                      {idx + 1}
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
                     {action.timeline}
                   </span>
                 </div>
                 <div className="flex-1 space-y-2">
                   <h5 className="text-lg font-black text-white">{action.title}</h5>
                   <p className="text-slate-500 text-sm font-bold italic leading-relaxed">{action.desc}</p>
                 </div>
                 <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center space-x-3">
                    <Sparkles className="text-primary shrink-0" size={16} />
                    <span className="text-primary text-xs font-black uppercase tracking-widest">Potential: {action.impact}</span>
                 </div>
               </div>
             ))}
           </div>
        </section>

        {/* Prevention Tips */}
        <section className="bg-slate-800/40 border border-slate-700/50 p-12 rounded-[3.5rem] space-y-8">
           <h3 className="text-3xl font-black text-white flex items-center space-x-4">
             <Info className="text-primary" size={32} />
             <span>Prevention Tips</span>
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                "Set up autopay for all credit cards and loans.",
                "Check your credit report twice a month.",
                "Keep credit utilization below 30% per card.",
                "Space out new loan applications by at least 6 months."
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start space-x-4 group">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-1 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-slate-400 font-bold italic text-lg leading-relaxed">{tip}</p>
                </div>
              ))}
           </div>
        </section>
      </main>
    </div>
  );
};

export default ScoreDropAnalysis;
