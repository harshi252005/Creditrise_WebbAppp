import React, { useState, useEffect } from 'react';
import { Shield, Info, CheckCircle, Sparkles, TrendingUp, CreditCard, Clock, PieChart, Activity, AlertCircle, Bookmark, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import { dataService } from '../services/api';
import { useAuth } from '../services/AuthContext';

const FactorCard = ({ factor }) => {
  // Map icon strings to Lucide components
  const getIcon = (iconName) => {
    switch(iconName) {
      case 'check': return <CheckCircle size={24} />;
      case 'chart': return <PieChart size={24} />;
      case 'calendar': return <Clock size={24} />;
      case 'card': return <CreditCard size={24} />;
      case 'sparkle': return <Sparkles size={24} />;
      default: return <Activity size={24} />;
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/30 shadow-inner" style={{ color: factor.color }}>
            {getIcon(factor.icon)}
          </div>
          <div>
            <h4 className="text-xl font-black text-white leading-none mb-1">{factor.title}</h4>
            <p className="text-slate-500 text-sm font-medium">{factor.description}</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-slate-900/60 border border-slate-700/30 rounded-2xl text-white text-xs font-black uppercase tracking-widest">
          {factor.weight}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-slate-400 text-xs font-black uppercase tracking-tighter">Health Score</span>
          <span className="text-white font-black text-lg">{factor.score}</span>
        </div>
        <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
          <div 
            className="h-full transition-all duration-1000 ease-out" 
            style={{ width: `${factor.progress}%`, backgroundColor: factor.color }}
          />
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[1.5rem] p-6 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-bold">{factor.detail_1_key}</span>
          <span className="text-white font-black uppercase">{factor.detail_1_val}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-bold">{factor.detail_2_key}</span>
          <span className="text-white font-black uppercase">{factor.detail_2_val}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-bold">{factor.detail_3_key}</span>
          <span className="text-white font-black uppercase">{factor.detail_3_val}</span>
        </div>
      </div>
    </div>
  );
};

const CreditReport = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dataService.getCreditReport(user.id);
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch credit report", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  if (loading) return <div className="p-20 text-center animate-pulse text-secondary font-black text-3xl uppercase tracking-[0.5em]">Generating Report...</div>;

  if (!data) return <div className="p-20 text-center text-risk font-black">Error loading credit report.</div>;

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-10">
      <Navbar title="Detailed Analysis" />

      <main className="p-6 space-y-10 md:p-10 max-w-5xl mx-auto">
        {/* Main Score Card */}
        <section className="bg-gradient-to-br from-indigo-600 to-primary p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 text-white/10 group-hover:text-white/15 transition-colors">
            <TrendingUp size={140} />
          </div>
          
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-black uppercase tracking-widest mb-4">Current Credit Standing</p>
            <div className="flex items-end space-x-6 mb-2">
              <h2 className="text-9xl font-black text-white leading-none tracking-tighter">{data.credit_score}</h2>
              <div className="mb-4">
                <span className="px-6 py-2 bg-secondary text-slate-950 rounded-full text-lg font-black shadow-2xl shadow-secondary/20">
                  {data.zone}
                </span>
              </div>
            </div>
            <p className="text-white/60 font-bold text-xl ml-2 mb-10">Calculated based on 5 parameters</p>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 inline-flex items-center space-x-4">
              <Zap className="text-yellow-400" size={24} fill="currentColor" />
              <p className="text-white font-black italic">
                Your profile is {data.zone === "Elite" ? "optimized for best lending rates!" : "constantly improving."}
              </p>
            </div>
          </div>
        </section>

        {/* Factors Description */}
        <div className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2rem] flex items-center space-x-6">
          <div className="p-4 bg-primary/20 text-primary rounded-2xl border border-primary/20 shadow-inner">
            <PieChart size={32} />
          </div>
          <p className="text-slate-400 text-lg font-bold italic leading-relaxed">
            Your credit score is calculated based on these 5 key factors. Each contributes differently to your overall score.
          </p>
        </div>

        {/* Factors Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {factors.map((factor, idx) => (
            <FactorCard key={idx} factor={factor} />
          ))}
        </section>

        {/* Quick Tips */}
        <section className="bg-gradient-to-br from-warning/10 to-warning/5 border-2 border-warning/20 p-12 rounded-[3.5rem] space-y-8">
          <div className="flex items-center space-x-5">
            <div className="p-4 bg-warning text-slate-900 rounded-3xl shadow-xl shadow-warning/20">
              <Sparkles size={32} strokeWidth={3} />
            </div>
            <h3 className="text-3xl font-black text-white">Quick Tips to Improve</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950/40 p-6 rounded-3xl border border-warning/10 space-y-3">
              <div className="w-10 h-10 bg-warning/20 text-warning flex items-center justify-center rounded-full font-black text-xl">1</div>
              <p className="text-slate-300 font-bold leading-relaxed italic">Pay all EMIs 2-3 days before due date.</p>
            </div>
            <div className="bg-slate-950/40 p-6 rounded-3xl border border-warning/10 space-y-3">
              <div className="w-10 h-10 bg-warning/20 text-warning flex items-center justify-center rounded-full font-black text-xl">2</div>
              <p className="text-slate-300 font-bold leading-relaxed italic">Keep credit utilization below 30%</p>
            </div>
            <div className="bg-slate-950/40 p-6 rounded-3xl border border-warning/10 space-y-3">
              <div className="w-10 h-10 bg-warning/20 text-warning flex items-center justify-center rounded-full font-black text-xl">3</div>
              <p className="text-slate-300 font-bold leading-relaxed italic">Avoid multiple loan applications.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreditReport;
