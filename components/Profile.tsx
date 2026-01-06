import React from 'react';
import { User, Shield, CreditCard, Bell, ChevronRight, LogOut, Settings, HelpCircle, Edit3 } from 'lucide-react';

const ProfileItem: React.FC<{ icon: React.ReactNode; label: string; value?: string; highlight?: boolean }> = ({ icon, label, value, highlight }) => (
  <div className="group flex items-center justify-between p-4 bg-[#121214] border border-[#27272a] mb-3 rounded-2xl hover:border-slate-600 transition-colors cursor-pointer active:scale-[0.99] duration-200">
    <div className="flex items-center space-x-4">
      <div className={`p-2 rounded-xl transition-colors ${highlight ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800/50 text-slate-400 group-hover:text-white group-hover:bg-slate-700'}`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{label}</span>
    </div>
    <div className="flex items-center space-x-3">
      {value && <span className="text-xs font-medium text-slate-500 group-hover:text-slate-400">{value}</span>}
      <ChevronRight size={16} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
    </div>
  </div>
);

const Profile: React.FC = () => {
  return (
    <div className="animate-fade-in pt-4 md:pt-0 max-w-2xl mx-auto w-full">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 text-center md:text-left">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-rose-500 shadow-2xl shadow-indigo-500/20">
            <div className="w-full h-full rounded-full bg-[#050505] border-[4px] border-[#050505] overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Gibbs" alt="Profile" className="w-full h-full bg-slate-800 object-cover" />
            </div>
          </div>
          <button className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white border-4 border-[#050505] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 translate-y-2">
            <Edit3 size={14} />
          </button>
        </div>
        
        <div className="flex-1 pt-1">
          <h2 className="text-3xl font-bold text-white mb-2">Trader One</h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 tracking-wide">
              PRO MEMBER
            </span>
            <span className="text-xs text-slate-500 font-mono bg-white/5 px-2 py-1 rounded-lg">ID: #88219</span>
          </div>
          <p className="text-sm text-slate-400 mt-4 max-w-xs mx-auto md:mx-0">
            Member since Oct 2023. Next billing date: <span className="text-slate-200">Nov 24, 2023</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 pl-1 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-slate-800"></span> General
          </h3>
          <ProfileItem icon={<Bell size={18} />} label="Notifications" value="On" />
          <ProfileItem icon={<CreditCard size={18} />} label="Subscription" value="Active" highlight />
          <ProfileItem icon={<Shield size={18} />} label="Security" />
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 pl-1 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-slate-800"></span> Support
          </h3>
          <ProfileItem icon={<Settings size={18} />} label="Preferences" />
          <ProfileItem icon={<HelpCircle size={18} />} label="Help Center" />
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-white/5">
        <button className="w-full py-4 rounded-2xl border border-rose-500/20 text-rose-500 font-bold text-sm hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-2 group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
        </button>
      </div>
      
      <div className="text-center mt-8 pb-8">
         <p className="text-[10px] text-slate-700 font-mono hover:text-indigo-500 transition-colors cursor-pointer">v2.4.0 • Gibbs Signals</p>
      </div>
    </div>
  );
};

export default Profile;