import React, { useState } from 'react';
import { Home, Zap, User, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Signals from './components/Signals';
import Profile from './components/Profile';
import { ViewState, NavItem } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Home', icon: <Home size={24} strokeWidth={2.5} /> },
    { id: 'signals', label: 'Signals', icon: <Zap size={24} strokeWidth={2.5} /> },
    { id: 'profile', label: 'Profile', icon: <User size={24} strokeWidth={2.5} /> },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onViewChange={setCurrentView} />;
      case 'signals': return <Signals />;
      case 'profile': return <Profile />;
      default: return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#050505] text-slate-200 overflow-hidden">
      
      {/* --- Desktop Sidebar (Hidden on Mobile) --- */}
      <aside className="hidden md:flex flex-col w-72 h-full border-r border-white/5 bg-[#08080a] p-6 z-20">
        <div className="mb-12 pl-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
             <Zap size={18} className="text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Gibbs<span className="text-indigo-500">.</span></h1>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                currentView === item.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <div className={`${currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {item.icon}
              </div>
              <span className="font-semibold tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto">
          <div className="bg-[#121214] p-4 rounded-2xl border border-white/5 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Gibbs" alt="User" className="w-full h-full rounded-full bg-black" />
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-white truncate">Trader One</p>
               <p className="text-xs text-indigo-400">Pro Plan</p>
             </div>
             <LogOut size={16} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 h-full relative flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-24 md:pb-8">
            {renderContent()}
          </div>
        </div>

        {/* --- Mobile Bottom Nav (Hidden on Desktop) --- */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-50">
           {/* Gradient fade */}
           <div className="h-8 bg-gradient-to-b from-transparent to-[#050505] w-full pointer-events-none"></div>
           
           <div className="nav-blur pb-safe pt-2">
            <div className="flex justify-around items-center h-20 px-6">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className="relative flex flex-col items-center justify-center w-16 h-full group"
                  >
                    {isActive && (
                      <div className="absolute -top-2 w-8 h-1 bg-indigo-500 rounded-b-lg shadow-[0_0_10px_rgba(99,102,241,0.6)] animate-pulse"></div>
                    )}
                    
                    <div className={`transition-all duration-300 transform ${
                      isActive 
                        ? 'text-white translate-y-0 scale-110' 
                        : 'text-slate-600 hover:text-slate-400 translate-y-1'
                    }`}>
                      {item.icon}
                    </div>
                    
                    <span className={`text-[10px] font-bold mt-1 tracking-wide transition-all duration-300 ${
                      isActive ? 'text-indigo-400 opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;