import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, ChevronRight, Zap, Target, ArrowRight } from 'lucide-react';
import { dataService } from '../services/api';
import { useAuth } from '../services/AuthContext';
import Navbar from '../components/Navbar';

const GrowthPredictor = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [months, setMonths] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      try {
        const response = await dataService.getGrowthPrediction(user.id, months);
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch growth prediction", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [user.id, months]);

  if (loading && !data) return <div className="p-20 text-center animate-pulse text-primary font-black text-2xl">CALCULATING TRAJECTORY...</div>;

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-10">
      <Navbar title="Growth Predictor" />

      <main className="p-6 md:p-10 max-w-4xl mx-auto space-y-10">
        {/* Header Card */}
        <section className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-10 rounded-[3rem] text-center space-y-4">
          <div className="w-20 h-20 bg-primary/20 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <TrendingUp size={40} />
          </div>
          <h2 className="text-4xl font-black text-white">Future Score Projection</h2>
          <p className="text-slate-400 font-bold italic">Based on your current {data?.monthly_rate} pts/mo growth rate</p>
        </section>

        {/* Prediction Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] flex flex-col items-center justify-center space-y-2">
             <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Current Score</p>
             <h3 className="text-6xl font-black text-white">{data?.current_score}</h3>
           </div>
           <div className="bg-primary border-4 border-primary/20 p-8 rounded-[2.5rem] flex flex-col items-center justify-center space-y-2 shadow-2xl shadow-primary/20">
             <p className="text-white/70 text-xs font-black uppercase tracking-widest">Predicted Score</p>
             <h3 className="text-7xl font-black text-white">{data?.predicted_score}</h3>
             <div className="bg-white/20 px-4 py-1 rounded-full text-xs font-black text-white">
               +{data?.predicted_score - data?.current_score} Points
             </div>
           </div>
        </div>

        {/* Timeline Selector */}
        <section className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-black text-white">Timeline</h4>
            <div className="flex bg-slate-900 rounded-2xl p-1 border border-slate-700">
               {[3, 6, 12].map(m => (
                 <button 
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                    months === m ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                 >
                   {m}M
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            {data?.trajectory.map((score, i) => (
              <div key={i} className="flex items-center group">
                 <div className="w-16 text-slate-500 text-xs font-black uppercase tracking-widest">{i === 0 ? 'Now' : `M${i}`}</div>
                 <div className="flex-1 h-12 bg-slate-900/60 rounded-2xl border border-slate-800/50 flex items-center px-6 relative overflow-hidden group-hover:border-primary/30 transition-all">
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all duration-1000" 
                      style={{ width: `${(score / 900) * 100}%` }}
                    />
                    <span className="relative z-10 text-white font-black">{score}</span>
                    <div className="ml-auto relative z-10 flex items-center text-[10px] font-black text-secondary">
                      {i > 0 && `+${score - data.trajectory[i-1]}`}
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Plan */}
        <section className="bg-secondary/10 border-2 border-secondary/20 p-10 rounded-[3rem] space-y-6">
          <div className="flex items-center space-x-4">
             <div className="p-3 bg-secondary text-slate-900 rounded-2xl">
               <Target size={24} />
             </div>
             <h4 className="text-2xl font-black text-white">How to reach faster?</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-2">
               <p className="text-secondary font-black text-sm uppercase">Strategy 1</p>
               <p className="text-white font-bold italic">Pay all EMIs 5 days early to unlock "Speed Bonus" (+5 pts/mo)</p>
            </div>
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-2">
               <p className="text-secondary font-black text-sm uppercase">Strategy 2</p>
               <p className="text-white font-bold italic">Keep usage below 10% for "Elite Utilization" (+3 pts/mo)</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GrowthPredictor;
