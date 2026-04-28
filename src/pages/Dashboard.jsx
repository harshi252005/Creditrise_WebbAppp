import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, Zap, AlertTriangle, ChevronRight, Calendar, CreditCard, MessageSquare, RefreshCw } from 'lucide-react';
import { dataService } from '../services/api';
import { useAuth } from '../services/AuthContext';
import Navbar from '../components/Navbar';
import DashboardSkeleton from '../components/DashboardSkeleton';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading, error, success

  const fetchDashboard = async () => {
    if (!user?.id) return;
    
    setStatus('loading');
    try {
      const response = await dataService.getDashboard(user.id);
      if (response.data.success) {
        setData(response.data);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Failed to fetch dashboard', err);
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-10 bg-black min-h-screen">
      <Navbar />
      
      <main className="p-6 space-y-8 md:p-10 max-w-5xl mx-auto">
        {status === 'error' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-risk/10 rounded-3xl flex items-center justify-center text-risk mb-6">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Failed to Load Dashboard</h2>
            <button 
              onClick={fetchDashboard}
              className="flex items-center space-x-3 bg-white text-black px-8 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95"
            >
              <RefreshCw size={20} />
              <span>Try Again</span>
            </button>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-white">Dashboard</h2>
                <p className="text-slate-500 font-medium">Overview of your financial health</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-900/50 border border-slate-800 p-2 rounded-2xl">
                <div className="px-4 py-2 bg-primary/20 text-primary rounded-xl text-xs font-black uppercase tracking-tighter">
                  {status === 'loading' ? <div className="h-4 w-12 bg-primary/30 animate-pulse rounded" /> : `Level ${data?.level || 1}`}
                </div>
                <div className="px-4 py-2 text-slate-400 text-xs font-black uppercase tracking-tighter">
                  {status === 'loading' ? <div className="h-4 w-12 bg-slate-800 animate-pulse rounded" /> : `${data?.xp || 0} XP`}
                </div>
              </div>
            </section>

            {/* Credit Score Card */}
            <section 
              onClick={() => navigate('/analysis')}
              className={`bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-all duration-500 ${status === 'loading' ? 'animate-pulse' : ''}`}
            >
              {/* Animated Background Elements */}
              <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-10">
                <div className="flex-1">
                  <p className="text-slate-500 text-xs font-black tracking-[0.2em] uppercase mb-8">Current Credit Score</p>
                  
                  <div className="flex items-end space-x-4 mb-4">
                    {status === 'loading' ? (
                      <div className="h-28 w-44 bg-slate-800 rounded-2xl animate-pulse mb-2" />
                    ) : (
                      <>
                        <h2 className="text-[7rem] font-black text-white leading-none tracking-tighter">{data?.score || 700}</h2>
                        <div className="mb-4">
                          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-black ${
                            data?.score_change?.startsWith('+') ? 'bg-secondary/20 text-secondary' : 'bg-risk/20 text-risk'
                          }`}>
                            {data?.score_change?.startsWith('+') ? <TrendingUp size={14} /> : <AlertTriangle size={14} />}
                            <span>{data?.score_change || '+0'}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {status !== 'loading' && (
                    <p className="text-slate-500 font-bold ml-1 text-sm flex items-center">
                      Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </p>
                  )}
                  
                  {/* Zones */}
                  <div className="mt-12 flex flex-wrap gap-3">
                    {['Elite', 'Improving', 'Risk'].map(zone => (
                      <div key={zone} className={`px-5 py-3 rounded-2xl border flex items-center space-x-3 transition-all ${
                        data?.zone === zone ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-slate-800/50 border-slate-700/30 text-slate-500'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${data?.zone === zone ? 'bg-primary' : 'bg-slate-700'}`} />
                        <span className="text-sm font-black uppercase tracking-tighter">{zone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:w-72 space-y-6">
                  <div className="bg-slate-950/50 backdrop-blur-sm border border-slate-700/30 p-6 rounded-[2rem] flex flex-col justify-between h-full min-h-[160px]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-warning/20 rounded-2xl text-warning">
                        <Zap size={24} />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Tip</span>
                    </div>
                    {status === 'loading' ? (
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-slate-800 rounded animate-pulse" />
                      </div>
                    ) : (
                      <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                        "{data?.advice || 'Monitor your spending to maintain score'}"
                      </p>
                    )}
                    <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between group-hover:text-primary transition-colors">
                      <span className="text-xs font-black uppercase tracking-tighter">Detailed Analysis</span>
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Info Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-primary/5">
                  <CreditCard size={80} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start mb-10">
                    <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                      <TrendingUp size={28} />
                    </div>
                    <div className="text-right">
                      <h3 className="text-5xl font-black text-white leading-none mb-1">
                        {status === 'loading' ? <div className="h-10 w-20 bg-slate-800 animate-pulse rounded" /> : `${data?.credit_utilization || 0}%`}
                      </h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Utilization</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-1000 ease-out" 
                        style={{ width: `${data?.credit_utilization || 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                      <span>Usage Level</span>
                      <span className={data?.credit_utilization > 30 ? 'text-risk' : 'text-secondary'}>
                        {status === 'loading' ? 'Loading...' : (data?.credit_utilization > 30 ? 'High' : 'Healthy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-orange-500/5">
                  <Zap size={80} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start mb-10">
                    <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500">
                      <Zap size={28} />
                    </div>
                    <div className="text-right">
                      <h3 className="text-5xl font-black text-white leading-none mb-1">
                        {status === 'loading' ? <div className="h-10 w-16 bg-slate-800 animate-pulse rounded" /> : (data?.streak || 0)}
                      </h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Weeks Streak</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl">
                    <span className="text-lg">🔥</span>
                    <p className="text-sm text-orange-500 font-black italic">
                      {status === 'loading' ? 'Calculating your streak...' : 'Maintaining an incredible track record!'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Upcoming EMI Card */}
            <section 
              onClick={() => navigate('/loans')}
              className="bg-warning/5 border border-warning/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between group cursor-pointer hover:bg-warning/10 transition-all duration-300"
            >
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start space-x-2 text-warning font-black uppercase tracking-widest text-[10px] mb-4">
                  <Calendar size={14} />
                  <span>Upcoming Due Payment</span>
                </div>
                <h4 className="text-5xl font-black text-white mb-2 leading-none">
                  {status === 'loading' ? <div className="h-10 w-40 bg-slate-800 animate-pulse rounded mx-auto md:mx-0" /> : `₹${(data?.pending_emi_amount || 0).toLocaleString()}`}
                </h4>
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <p className="text-slate-400 text-sm font-semibold">{status === 'loading' ? 'Loading...' : (data?.next_due_date || 'No upcoming due')}</p>
                  <div className="w-1 h-1 bg-slate-700 rounded-full" />
                  <p className="text-slate-500 text-xs font-black uppercase tracking-tighter">View Details</p>
                </div>
              </div>

              <div className="mt-8 md:mt-0 flex items-center space-x-4">
                 <div className="p-6 bg-warning rounded-full text-slate-900 shadow-2xl shadow-warning/20 group-hover:scale-110 transition-transform duration-500">
                   <ChevronRight size={32} />
                 </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <div className="flex items-center justify-between mb-6 px-2">
                <h5 className="text-xl font-black text-white italic">Quick Actions</h5>
                <div className="h-px flex-1 bg-slate-800 mx-6 opacity-30" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Growth Predictor', icon: TrendingUp, path: '/growth', color: 'primary', tag: 'Projection' },
                  { label: 'Score Simulator', icon: Zap, path: '/simulator', color: 'warning', tag: 'Simulation' },
                  { label: 'AI Coach', icon: MessageSquare, path: '/coach', color: 'slate', tag: 'Advisor', hiddenMob: true }
                ].map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button 
                      key={idx}
                      onClick={() => navigate(action.path)}
                      className={`bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl text-left hover:bg-slate-800 transition-all group relative overflow-hidden hover:border-${action.color}/30 ${action.hiddenMob ? 'hidden md:block' : ''}`}
                    >
                      <div className={`p-3 bg-${action.color}/10 rounded-2xl text-${action.color} w-fit mb-4 group-hover:bg-${action.color} group-hover:text-white transition-all duration-300`}>
                        <Icon size={24} />
                      </div>
                      <p className="text-white font-bold mb-1">{action.label}</p>
                      <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{action.tag}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
