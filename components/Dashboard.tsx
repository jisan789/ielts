
import React from 'react';
import { UserProfile, PersonaType, SessionMode } from '../types';
import { PERSONA_CONFIGS } from '../constants';

interface DashboardProps {
  profile: UserProfile;
  onStartChat: (mode: SessionMode) => void;
  onOpenFeedback: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, onStartChat, onOpenFeedback }) => {
  const persona = PERSONA_CONFIGS[PersonaType.EMMA];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700">
      {/* Header section */}
      <div className="text-center bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
          IELTS Prep, {profile.name} <span className="inline-block hover:animate-spin origin-bottom-right cursor-default">👋</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium">Choose your mode to begin.</p>
      </div>

      {/* Mode Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Practice Mode Card */}
        <div 
          onClick={() => onStartChat(SessionMode.PRACTICE)}
          className="group relative cursor-pointer overflow-hidden bg-white hover:bg-indigo-50/50 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 hover:border-indigo-200 transition-all duration-300 shadow-xl shadow-slate-200/50 hover:shadow-indigo-200/40 active:scale-[0.98]"
        >
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-indigo-200/40 transition-colors"></div>
          
          <div className="relative z-10 flex flex-col h-full items-start">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            
            <div className="mb-auto">
              <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black tracking-widest uppercase mb-3">
                Beginner Friendly
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight mb-3 group-hover:text-indigo-900 transition-colors">Practice Mode</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Relaxed environment. Get immediate feedback, corrections, and tips from {persona.name}. Perfect for improving specific skills.
              </p>
            </div>

            <div className="mt-8 flex items-center text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <span>Start Practice</span>
              <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>
        </div>

        {/* Exam Mode Card */}
        <div 
          onClick={() => onStartChat(SessionMode.EXAM)}
          className="group relative cursor-pointer overflow-hidden bg-white hover:bg-rose-50/50 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 hover:border-rose-200 transition-all duration-300 shadow-xl shadow-slate-200/50 hover:shadow-rose-200/40 active:scale-[0.98]"
        >
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-rose-200/40 transition-colors"></div>
          
          <div className="relative z-10 flex flex-col h-full items-start">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
              <i className="fa-solid fa-stopwatch"></i>
            </div>
            
            <div className="mb-auto">
              <div className="inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-[10px] font-black tracking-widest uppercase mb-3">
                Real Simulation
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight mb-3 group-hover:text-rose-900 transition-colors">Mock Exam</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Strict conditions. No interruptions or immediate corrections. Simulates the real IELTS test pressure.
              </p>
            </div>

            <div className="mt-8 flex items-center text-rose-600 font-bold text-sm bg-rose-50 px-4 py-2 rounded-full group-hover:bg-rose-600 group-hover:text-white transition-all">
              <span>Start Exam</span>
              <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>
        </div>

      </div>

      {/* Enhanced Feedback Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl shadow-slate-900/20 group">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-600 rounded-full blur-[80px] opacity-30 translate-y-1/3 translate-x-1/4"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900 to-transparent z-0"></div>

        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-4 max-w-xl">
             <div className="inline-flex items-center space-x-2.5 text-indigo-300 text-[11px] font-black uppercase tracking-[0.2em] mb-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.5)]"></span>
                <span>We Value Your Input</span>
             </div>
             
             <h3 className="text-3xl md:text-4xl font-black leading-tight text-white tracking-tight">
               Help improve this AI?
             </h3>
             
             <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-md mx-auto md:mx-0">
               Found a bug or have a feature request for Jisan? Send it directly to the developer to help make this tool better.
             </p>
          </div>

          <button 
            onClick={onOpenFeedback}
            className="flex-shrink-0 px-8 py-5 bg-white text-slate-950 rounded-2xl font-bold shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-3 group-hover:ring-4 ring-white/10"
          >
            <i className="fa-regular fa-paper-plane text-indigo-600 text-xl group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300"></i>
            <span className="tracking-tight">Send Feedback</span>
          </button>
        </div>
      </div>

      {/* Credits Section */}
      <div className="pt-8 flex flex-col items-center justify-center space-y-4">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="text-center group cursor-default">
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-2 opacity-70 group-hover:opacity-100 transition-opacity">Exclusive Platform</p>
          <h3 className="text-xl font-black text-slate-700 tracking-tighter group-hover:text-indigo-600 transition-colors">
            Developed by Jisan
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
