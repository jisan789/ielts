
import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import ChatInterface from './components/ChatInterface';
import SessionSummary from './components/SessionSummary';
import LiveMode from './components/LiveMode';
import Dashboard from './components/Dashboard';
import FeedbackModal from './components/FeedbackModal';
import { UserProfile, ChatMessage, SessionMode } from './types';

export enum ViewState {
  ONBOARDING,
  DASHBOARD,
  CHAT,
  SUMMARY
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.ONBOARDING);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [sessionMode, setSessionMode] = useState<SessionMode>(SessionMode.PRACTICE);
  const [showFeedback, setShowFeedback] = useState(false);

  // Load profile from local storage if exists
  useEffect(() => {
    const saved = localStorage.getItem('fluentify_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        setView(ViewState.DASHBOARD);
      } catch (e) {
        console.error("Failed to parse saved profile", e);
      }
    }
  }, []);

  const handleOnboardingComplete = (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem('fluentify_profile', JSON.stringify(p));
    setView(ViewState.DASHBOARD);
  };

  const handleStartChat = (mode: SessionMode) => {
    setSessionMode(mode);
    setMessages([]); // Ensure clean state
    setView(ViewState.CHAT);
  };

  const handleEndSession = () => {
    setView(ViewState.SUMMARY);
  };

  const handleRestart = () => {
    setMessages([]); // Reset messages for new session
    setView(ViewState.DASHBOARD);
  };

  const addMessages = (newMsgs: ChatMessage[]) => {
    setMessages(prev => [...prev, ...newMsgs]);
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 transition-colors duration-500 flex flex-col">
      <main className="flex-1">
        {view === ViewState.ONBOARDING && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        
        {view === ViewState.DASHBOARD && profile && (
          <Dashboard 
            profile={profile} 
            onStartChat={handleStartChat}
            onOpenFeedback={() => setShowFeedback(true)}
          />
        )}

        {view === ViewState.CHAT && profile && (
          <>
            <ChatInterface 
              profile={profile}
              mode={sessionMode}
              messages={messages}
              setMessages={setMessages}
              onEndSession={handleEndSession} 
              onStartLive={() => setIsLiveMode(true)}
              onBack={() => setView(ViewState.DASHBOARD)}
            />
            {isLiveMode && (
              <LiveMode 
                profile={profile}
                mode={sessionMode} 
                onClose={(callHistory) => {
                  addMessages(callHistory);
                  setIsLiveMode(false);
                }} 
              />
            )}
          </>
        )}

        {view === ViewState.SUMMARY && (
          <SessionSummary history={messages} onRestart={handleRestart} />
        )}

        <FeedbackModal 
          isOpen={showFeedback} 
          onClose={() => setShowFeedback(false)} 
          userName={profile?.name} 
        />
      </main>
      
      {/* Footer with Credits and Feedback */}
      <footer className="py-8 text-center bg-white border-t border-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <span>Developed by</span>
            <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">Jisan</span>
          </div>
          
          <button 
            onClick={() => setShowFeedback(true)}
            className="group flex items-center space-x-2 px-5 py-2.5 bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-200 rounded-full text-slate-500 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <i className="fa-regular fa-comment-dots group-hover:scale-110 transition-transform text-lg"></i>
            <span className="text-xs font-bold">Submit Feedback</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
