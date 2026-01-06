import React from 'react';
import { MOCK_SIGNALS } from '../constants';
import { Target, Shield, Clock, BarChart2, Filter, Search } from 'lucide-react';

const Signals: React.FC = () => {
  return (
    <div className="min-h-full animate-fade-in">
      {/* Header Area */}
      <div className="sticky top-0 z-30 pt-4 pb-4 bg-[#050505]/95 backdrop-blur-xl mb-6 border-b border-white/5 md:border-none md:static md:bg-transparent md:p-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 mb-4">
           <div>
             <h1 className="text-2xl md:text-3xl font-bold text-white">Market Signals</h1>
             <p className="text-slate-400 text-sm mt-1 hidden md:block">Real-time trading opportunities</p>
           </div>
           
           <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search pair..." 
                  className="w-full bg-[#121214] border border-[#27272a] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
             </div>
             <button className="p-2.5 rounded-xl bg-[#121214] border border-[#27272a] text-slate-400 hover:text-white transition-colors">
                <Filter size={18} />
             </button>
           </div>
        </div>

        {/* Filters Scroll */}
        <div className="flex space-x-3 px-1 overflow-x-auto no-scrollbar md:flex-wrap">
          {['All Signals', 'Major Pairs', 'Gold & Metals', 'Crypto Assets', 'Scalping'].map((filter, i) => (
            <button 
              key={filter} 
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                i === 0 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-[#1c1c1f] text-slate-400 border border-[#303036] hover:bg-[#252529] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 px-1 pb-24 md:pb-0">
        {MOCK_SIGNALS.map((signal) => (
          <div key={signal.id} className="matte-card rounded-[1.5rem] overflow-hidden relative group hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 hover:-translate-y-1">
            
            {/* Status Pulse */}
            {signal.status === 'ACTIVE' && (
              <div className="absolute top-4 right-4 flex h-2.5 w-2.5 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </div>
            )}

            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2 ${
              signal.type === 'BUY' ? 'bg-emerald-500' : 'bg-rose-500'
            }`}></div>

            <div className="p-5 pl-7 h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{signal.pair}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      signal.type === 'BUY' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {signal.type}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center font-medium bg-white/5 px-2 py-0.5 rounded-md">
                      <Clock size={10} className="mr-1" /> {signal.timestamp}
                    </span>
                  </div>
                </div>
                
                <div className="text-right mt-1">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Entry</span>
                  <span className="text-lg font-mono font-medium text-white bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">{signal.entryPrice}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5 flex-1">
                <div className="bg-[#0a0a0c] rounded-xl p-3 border border-white/5 relative overflow-hidden group/item">
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Take Profit</span>
                    <Target size={12} className="text-emerald-500" />
                  </div>
                  <div className="mt-1 text-base font-mono font-medium text-emerald-400 relative z-10">
                    {signal.takeProfit}
                  </div>
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                </div>
                
                <div className="bg-[#0a0a0c] rounded-xl p-3 border border-white/5 relative overflow-hidden group/item">
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Stop Loss</span>
                    <Shield size={12} className="text-rose-500" />
                  </div>
                  <div className="mt-1 text-base font-mono font-medium text-rose-400 relative z-10">
                    {signal.stopLoss}
                  </div>
                  <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                </div>
              </div>
              
              {/* Action */}
              <button className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors shadow-lg shadow-white/5 flex items-center justify-center gap-2 group/btn">
                <span>Copy Signal</span>
                <span className="opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="py-8 text-center">
        <div className="inline-block w-12 h-1 bg-slate-800 rounded-full mb-3"></div>
        <p className="text-sm text-slate-600 font-medium">You're all caught up for now</p>
      </div>
    </div>
  );
};

export default Signals;