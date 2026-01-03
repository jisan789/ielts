
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage, PersonaType, SessionMode } from '../types';
import { getGeminiChatResponse } from '../services/gemini';
import { PERSONA_CONFIGS } from '../constants';

interface ChatInterfaceProps {
  profile: UserProfile;
  mode: SessionMode;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onEndSession: () => void;
  onStartLive: () => void;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ profile, mode, messages, setMessages, onEndSession, onStartLive, onBack }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCorrectionId, setShowCorrectionId] = useState<string | null>(null);
  const [rateLimitHit, setRateLimitHit] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const persona = PERSONA_CONFIGS[PersonaType.EMMA];

  useEffect(() => {
    const greet = async () => {
      setIsLoading(true);
      try {
        const res = await getGeminiChatResponse(profile, mode, `Initiate IELTS Speaking session. Welcome Candidate ${profile.name}. Mode: ${mode}`, []);
        const botMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'model',
          text: res.reply,
          timestamp: new Date()
        };
        setMessages([botMsg]);
      } catch (e: any) {
         if (e.message?.includes('429') || e.message?.includes('ResourceExhausted')) {
          setRateLimitHit(true);
        }
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (messages.length === 0) greet();
  }, [profile, mode, setMessages, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, rateLimitHit]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setRateLimitHit(false);

    try {
      const res = await getGeminiChatResponse(profile, mode, input, [...messages, userMsg]);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: res.reply,
        timestamp: new Date(),
        correction: res.correction || undefined
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes('429') || e.message?.includes('ResourceExhausted')) {
        setRateLimitHit(true);
      }
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Dynamic Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xl shadow-sm ${mode === SessionMode.EXAM ? 'bg-rose-50 border-rose-100' : 'bg-indigo-50 border-indigo-100'}`}>
               {mode === SessionMode.EXAM ? '⏱️' : '👩‍🏫'}
            </div>
            <div>
              <div className="font-bold text-slate-900 leading-tight">{persona.name}</div>
              <div className={`flex items-center text-[10px] uppercase tracking-wider font-black ${mode === SessionMode.EXAM ? 'text-rose-600' : 'text-emerald-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${mode === SessionMode.EXAM ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                {mode === SessionMode.EXAM ? 'Exam In Progress' : 'Practice Mode'}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <button 
             onClick={onStartLive}
             className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-all animate-pulse"
             title="Voice Call (Recommended)"
           >
             <i className="fa-solid fa-phone"></i>
           </button>
           <button 
             onClick={onEndSession}
             className="px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-bold shadow-md hover:bg-slate-800 transition-all"
           >
             Finish
           </button>
        </div>
      </header>

      {/* Message History */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30 md:px-20 lg:px-72 custom-scrollbar"
      >
        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group`}>
            {(idx === 0 || messages[idx-1].role !== msg.role) && (
               <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 px-2">
                 {msg.role === 'user' ? 'Candidate' : 'Examiner'}
               </div>
            )}
            
            <div className={`relative max-w-[88%] md:max-w-[80%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
              <div className={`px-5 py-3.5 rounded-3xl shadow-sm text-[15px] leading-relaxed transition-all duration-300 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>

              {msg.correction && (
                <button 
                  onClick={() => setShowCorrectionId(showCorrectionId === msg.id ? null : msg.id)}
                  className="mt-2 flex items-center space-x-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[11px] font-bold border border-amber-100 hover:bg-amber-100 transition-all group-hover:scale-105 active:scale-95"
                >
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  <span>Correction Available</span>
                </button>
              )}

              {showCorrectionId === msg.id && msg.correction && (
                <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-2xl shadow-lg animate-in fade-in zoom-in-95 duration-200 origin-top-left max-w-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Better Alternative</span>
                    <button onClick={() => setShowCorrectionId(null)} className="text-amber-800/50 hover:text-amber-800"><i className="fa-solid fa-xmark"></i></button>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="line-through text-slate-400 opacity-80 block mb-1">"{msg.correction.original}"</span>
                      <span className="font-bold text-amber-900 block">"{msg.correction.corrected}"</span>
                    </div>
                    <p className="text-xs text-amber-800/80 italic leading-relaxed">{msg.correction.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {rateLimitHit && (
          <div className="flex justify-center p-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 max-w-md w-full shadow-lg flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div>
                <h4 className="font-bold text-red-800">Chat Limit Reached</h4>
                <p className="text-sm text-red-600/80 mt-1">You've hit the text chat rate limit. The examiner can still speak with you in Live Mode.</p>
              </div>
              <button 
                onClick={onStartLive}
                className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold shadow-md hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
              >
                <i className="fa-solid fa-phone"></i>
                <span>Switch to Live Voice</span>
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-400 p-2 ml-4">
             <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
             <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
             <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
             <span className="text-xs font-medium ml-2">Examiner is grading...</span>
          </div>
        )}
      </div>

      {/* Better Input Area */}
      <div className="p-4 md:p-6 bg-white border-t border-slate-100 md:px-20 lg:px-72">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onStartLive}
            className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-500 rounded-2xl hover:text-indigo-600 transition-all border border-slate-100"
            title="Start Voice Mode"
          >
            <i className="fa-solid fa-microphone"></i>
          </button>
          <div className="flex-1 relative flex items-center group">
            <input
              ref={inputRef}
              type="text"
              disabled={rateLimitHit}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 pr-14 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all font-medium text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={rateLimitHit ? "Chat disabled temporarily..." : "Type your answer..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || rateLimitHit}
              className={`absolute right-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !rateLimitHit ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-200 text-slate-400'
              }`}
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;