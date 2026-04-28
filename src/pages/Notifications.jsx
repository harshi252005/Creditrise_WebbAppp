import React, { useState, useEffect } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle2, Flame, ChevronRight, Inbox } from 'lucide-react';
import { dataService } from '../services/api';
import { useAuth } from '../services/AuthContext';
import Navbar from '../components/Navbar';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await dataService.getNotifications(user.id);
        setNotifications(response.data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user.id]);

  const getIcon = (iconName, tint) => {
    switch(iconName) {
      case 'check': return <CheckCircle2 size={24} style={{ color: tint }} />;
      case 'warning': return <AlertTriangle size={24} style={{ color: tint }} />;
      case 'fire': return <Flame size={24} style={{ color: tint }} />;
      default: return <Info size={24} style={{ color: tint }} />;
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-warning font-black text-2xl uppercase tracking-widest">Checking Notifications...</div>;

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-10">
      <Navbar title="Notifications" />

      <main className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="p-10 bg-slate-800/40 rounded-full text-slate-700">
              <Inbox size={80} />
            </div>
            <h3 className="text-2xl font-black text-white">All Caught Up!</h3>
            <p className="text-slate-500 font-bold max-w-xs">No new notifications at the moment. We'll let you know when something needs your attention.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`bg-slate-800/40 border-l-4 p-8 rounded-[2rem] transition-all hover:bg-slate-800/60 flex items-start space-x-6 relative overflow-hidden group ${
                notif.is_read ? 'border-slate-700' : 'border-primary'
              }`}
            >
              {!notif.is_read && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#337BFF]" />
              )}
              
              <div className="p-4 bg-slate-900/60 rounded-2xl shrink-0 group-hover:scale-110 transition-transform">
                {getIcon(notif.icon, notif.icon_tint)}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="text-xl font-black text-white leading-tight">{notif.title}</h4>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{notif.time}</span>
                </div>
                <p className="text-slate-400 font-bold italic leading-relaxed">{notif.body}</p>
                
                {!notif.is_read && (
                  <button className="text-primary text-[10px] font-black uppercase tracking-widest mt-4 hover:underline">
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default Notifications;
