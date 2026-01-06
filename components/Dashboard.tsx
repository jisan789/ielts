import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Activity, Zap, ChevronRight, BarChart3, Globe, Clock } from 'lucide-react';
import { MOCK_SIGNALS } from '../constants';

const Dashboard: React.FC<{ onViewChange: (view: any) => void }> = ({ onViewChange }) => {
  const activeSignals = MOCK_SIGNALS.filter(s => s.status === 'ACTIVE').length;
  
  // Dynamic Time & Session State
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate Forex Session based on UTC Hours
  const sessionName = useMemo(() => {
    const utcHour = currentTime.getUTCHours();
    // Weekends check (Day 0 is Sunday, 6 is Saturday)
    const day = currentTime.getUTCDay();
    if (day === 0 || day === 6) return 'Market Closed';

    const activeSessions: string[] = [];

    // Approximate UTC Sessions
    // Sydney: 21:00 - 06:00
    if (utcHour >= 21 || utcHour < 6) activeSessions.push('Sydney');
    // Tokyo: 00:00 - 09:00
    if (utcHour >= 0 && utcHour < 9) activeSessions.push('Tokyo');
    // London: 07:00 - 16:00
    if (utcHour >= 7 && utcHour < 16) activeSessions.push('London');
    // New York: 12:00 - 21:00
    if (utcHour >= 12 && utcHour < 21) activeSessions.push('New York');

    if (activeSessions.length === 0) return 'Quiet Session';
    
    // Handle specific overlaps cleanly
    if (activeSessions.includes('London') && activeSessions.includes('New York')) return 'London / NY Session';
    if (activeSessions.includes('Tokyo') && activeSessions.includes('London')) return 'Tokyo / London Session';
    if (activeSessions.includes('Sydney') && activeSessions.includes('Tokyo')) return 'Sydney / Tokyo Session';

    return `${activeSessions[0]} Session`;
  }, [currentTime]);

  const localTime = currentTime.toLocaleTimeString([], { hour12: false });

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Mobile Header (Hidden on Desktop) */}
      <div className="md:hidden flex justify-between items-center pt-2 px-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Gibbs<span className="text-indigo-500">.</span></h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold">
            TR
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-end border-b border-white/5 pb-6">
        <div>
           <h2 className="text-3xl font-bold text-white">Dashboard</h2>
           <p className="text-slate-500 mt-1">Welcome back, here is your market overview.</p>
        </div>
        <div className="flex gap-3">
           <div className="px-4 py-2 rounded-lg bg-[#121214] border border-white/5 flex items-center gap-2 text-sm text-slate-400">
              <Globe size={14} /> {sessionName}
           </div>
           <div className="px-4 py-2 rounded-lg bg-[#121214] border border-white/5 flex items-center gap-2 text-sm text-indigo-400 font-mono">
              <Clock size={14} /> {localTime}
           </div>
        </div>
      </div>

      {/* Grid Layout for Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Hero Card */}
        <div className="lg:col-span-2 relative w-full">
          <div className="absolute top-4 left-4 right-4 h-full bg-indigo-600/20 blur-3xl rounded-full -z-10"></div>
          
          <div className="matte-card rounded-[2rem] p-6 md:p-8 overflow-hidden relative h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-10 md:opacity-20 pointer-events-none">
              <BarChart3 size={120} className="text-white transform rotate-12 translate-x-4 -translate-y-4" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-6">
                <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Pro Account
                </span>
              </div>
              
              <div className="space-y-2 mb-8">
                <p className="text-slate-400 text-sm font-medium">Monthly Win Rate</p>
                <div className="flex items-end gap-4">
                  <span className="text-5xl md:text-7xl font-bold text-white tracking-tighter">78<span className="text-indigo-500">%</span></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm transition-transform hover:scale-105">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Active Signals</p>
                  <p className="text-2xl font-bold text-white">{activeSignals}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm transition-transform hover:scale-105">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Pips</p>
                  <p className="text-2xl font-bold text-emerald-400">+480</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats / Market Status (Visible on Desktop as Card) */}
        <div className="hidden lg:flex flex-col gap-6">
           <div className="matte-card rounded-[2rem] p-6 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Activity size={48} className="text-indigo-500 mb-4" />
              <h3 className="text-xl font-bold text-white">Market Volatility</h3>
              <p className="text-sm text-slate-400 mt-2">High impact news expected in 2 hours. Trade with caution.</p>
           </div>
           <div className="matte-card rounded-[2rem] p-6 flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                 <button onClick={() => onViewChange('signals')} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold text-slate-300 transition-colors">
                    View Signals
                 </button>
                 <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold text-slate-300 transition-colors">
                    History
                 </button>
              </div>
           </div>
        </div>

      </div>

      {/* Market Status Strip (Mobile Only) */}
      <div className="lg:hidden bg-[#121214] border-y border-white/5 py-3 -mx-5 px-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className={`w-2 h-2 rounded-full ${sessionName === 'Market Closed' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
            {sessionName !== 'Market Closed' && (
              <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-300">{sessionName}</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">{localTime}</span>
      </div>

      {/* Recent Activity Section */}
      <div>
        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <button 
            onClick={() => onViewChange('signals')}
            className="flex items-center text-sm text-indigo-400 font-medium hover:text-indigo-300 transition-colors group"
          >
            View All <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_SIGNALS.slice(0, 3).map((signal) => (
            <div 
              key={signal.id} 
              className="group matte-card rounded-2xl p-5 flex justify-between items-center hover:border-indigo-500/30 transition-all duration-300 cursor-pointer hover:bg-[#16161a]"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                  signal.type === 'BUY' 
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500/10' 
                    : 'bg-rose-500/5 border-rose-500/20 text-rose-500 group-hover:bg-rose-500/10'
                }`}>
                  {signal.type === 'BUY' ? <TrendingUp size={22} /> : <TrendingUp size={22} className="transform scale-y-[-1]" />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{signal.pair}</h3>
                  <p className={`text-[11px] font-bold uppercase tracking-wide mt-0.5 ${
                     signal.type === 'BUY' ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {signal.type}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-mono mb-2">{signal.timestamp}</div>
                <div className={`text-[10px] font-bold px-2.5 py-1 rounded-md border inline-block ${
                  signal.status === 'ACTIVE' 
                    ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' 
                    : 'border-slate-700 text-slate-500 bg-slate-800/50'
                }`}>
                  {signal.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;