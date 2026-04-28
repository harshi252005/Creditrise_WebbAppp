import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Brain, Lightbulb, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { dataService } from '../services/api';
import { useAuth } from '../services/AuthContext';
import Navbar from '../components/Navbar';

const AICoach = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: "Hello! I'm your AI Credit Coach. I've analyzed your credit profile. How can I help you boost your score today?",
      options: true
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestions = [
    "How can I improve my score?",
    "What affects my credit score?",
    "Why did my score drop?",
    "How to build credit from scratch?",
    "How long does it take?"
  ];

  const handleSend = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: messageText }]);
    setInput('');
    setLoading(true);

    try {
      // Fetch advice from backend to use as a basis for bot response
      const response = await dataService.getAiAdvisor(user.id);
      const advice = response.data.advice || [];
      
      let botResponse = "";
      if (messageText.toLowerCase().includes("improve")) {
        botResponse = `Based on your profile, here's what you should focus on:\n\n${advice.map(a => `• ${a}`).join('\n')}\n\nConsistency is key! Most users see a 20-30 point jump in 3 months.`;
      } else if (messageText.toLowerCase().includes("drop")) {
        botResponse = "Credit scores can drop due to missed payments, high credit card usage, or new loan inquiries. Let's check your recent activity together.";
      } else {
        botResponse = "That's a great question! Maintaining on-time payments and keeping your credit utilization below 30% are the two most important factors for your credit health.";
      }

      // Simulate AI thinking
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
        setLoading(false);
      }, 1000);

    } catch (err) {
      setMessages(prev => [...prev, { type: 'bot', text: "I'm having trouble connecting to my knowledge base. But remember: pay on time!" }]);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0A122A]">
      <Navbar title="AI Credit Coach" />
      
      {/* Bot Status */}
      <div className="flex items-center justify-center py-4 bg-slate-900/40 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_rgba(0,208,118,0.5)]" />
          <span className="text-secondary text-sm font-black uppercase tracking-widest">Active & Online</span>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-5 duration-500`}
          >
            <div className={`flex items-start space-x-4 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl ${
                msg.type === 'bot' 
                  ? 'bg-gradient-to-br from-primary to-accent text-white' 
                  : 'bg-slate-800 text-primary border border-slate-700'
              }`}>
                {msg.type === 'bot' ? <Sparkles size={24} /> : <User size={24} />}
              </div>
              <div className={`p-6 rounded-[2rem] shadow-xl ${
                msg.type === 'bot' 
                  ? 'bg-slate-800/80 text-white rounded-tl-none border-t border-l border-white/5' 
                  : 'bg-primary text-white rounded-tr-none shadow-primary/20'
              }`}>
                <p className="text-lg font-bold leading-relaxed whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 p-6 rounded-[2rem] rounded-tl-none flex space-x-2 items-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Suggestion Chips */}
      <section className="bg-slate-900/60 backdrop-blur-xl border-t border-slate-800 p-4">
        <div className="flex space-x-3 overflow-x-auto pb-4 px-2 no-scrollbar">
          {suggestions.map((s, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(s)}
              className="whitespace-nowrap px-6 py-3 bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/50 rounded-full text-sm font-black transition-all active:scale-95 shadow-lg"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="relative mt-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your credit..."
            className="w-full pl-8 pr-20 py-6 bg-slate-800 border-2 border-slate-700/50 rounded-[2rem] text-white text-lg font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder-slate-600 shadow-2xl"
          />
          <button 
            onClick={() => handleSend()}
            className="absolute right-3 top-3 bottom-3 w-14 bg-gradient-to-br from-primary to-accent text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <Send size={24} />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-4 pb-2">
          AI Coach can make mistakes. Always verify with your actual credit report.
        </p>
      </section>
    </div>
  );
};

export default AICoach;
