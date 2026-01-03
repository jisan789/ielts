import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { UserProfile, ChatMessage, PersonaType, SessionMode } from '../types';
import { decodeAudioData, decodeBase64, encodeBase64 } from '../services/gemini';
import { PERSONA_CONFIGS, SYSTEM_PROMPT_BASE, MODE_INSTRUCTIONS } from '../constants';

interface LiveModeProps {
  profile: UserProfile;
  mode: SessionMode;
  onClose: (history: ChatMessage[]) => void;
}

interface TranscriptLine {
  role: 'user' | 'model';
  text: string;
}

const LiveMode: React.FC<LiveModeProps> = ({ profile, mode, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([]);
  const [activeUserText, setActiveUserText] = useState("");
  const [activeModelText, setActiveModelText] = useState("");
  const [inputVolume, setInputVolume] = useState(0); 
  const [errorState, setErrorState] = useState<string | null>(null);
  
  const persona = PERSONA_CONFIGS[PersonaType.EMMA];
  const modeInstruction = MODE_INSTRUCTIONS[mode];

  // Buffers for cumulative session history to pass back to App
  const sessionMessagesRef = useRef<ChatMessage[]>([]);
  const currentInputRef = useRef("");
  const currentOutputRef = useRef("");

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  useEffect(() => {
    const startLiveSession = async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: `${SYSTEM_PROMPT_BASE} \n Role: Professional IELTS Speaking Examiner (${persona.name}) \n ${modeInstruction} \n Candidate: ${profile.name} \n Target Band: ${profile.level} \n Goals: ${profile.goals.join(', ')} \n REMEMBER: You are developed by Jisan.`,
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {}
          },
          callbacks: {
            onopen: () => {
              setIsConnecting(false);
              const source = audioContextRef.current!.createMediaStreamSource(stream);
              const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) {
                  sum += inputData[i] * inputData[i];
                }
                const rms = Math.sqrt(sum / inputData.length);
                const volume = Math.min(100, rms * 500);
                setInputVolume(volume);

                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                  data: encodeBase64(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(audioContextRef.current!.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              if (message.serverContent?.outputTranscription) {
                const text = message.serverContent.outputTranscription.text;
                currentOutputRef.current += text;
                setActiveModelText(prev => prev + text);
              }

              if (message.serverContent?.inputTranscription) {
                const text = message.serverContent.inputTranscription.text;
                currentInputRef.current += text;
                setActiveUserText(prev => prev + text);
              }

              if (message.serverContent?.turnComplete) {
                if (currentInputRef.current) {
                  const msg: ChatMessage = {
                    id: `live-user-${Date.now()}`,
                    role: 'user',
                    text: currentInputRef.current,
                    timestamp: new Date()
                  };
                  sessionMessagesRef.current.push(msg);
                  // Fixed type error by explicitly typing role
                  setTranscriptLines(prev => [...prev, { role: 'user' as const, text: currentInputRef.current }].slice(-10));
                  currentInputRef.current = "";
                  setActiveUserText("");
                }
                if (currentOutputRef.current) {
                  const msg: ChatMessage = {
                    id: `live-model-${Date.now()}`,
                    role: 'model',
                    text: currentOutputRef.current,
                    timestamp: new Date()
                  };
                  sessionMessagesRef.current.push(msg);
                  // Fixed type error by explicitly typing role
                  setTranscriptLines(prev => [...prev, { role: 'model' as const, text: currentOutputRef.current }].slice(-10));
                  currentOutputRef.current = "";
                  setActiveModelText("");
                }
              }

              const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (base64Audio) {
                setIsSpeaking(true);
                const ctx = outputAudioContextRef.current!;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) setIsSpeaking(false);
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setIsSpeaking(false);
                currentOutputRef.current = "";
                currentInputRef.current = "";
                setActiveUserText("");
                setActiveModelText("");
              }
            },
            onerror: (e) => {
                console.error("Live Session Error", e);
                setErrorState("Session disconnected. You may have reached the API rate limit or experienced a network issue.");
                setIsConnecting(false);
            },
            onclose: (e) => {
                console.log("Live Session Closed", e);
                if (e.code !== 1000) { 
                    setErrorState("Connection closed unexpectedly. Please check your rate limits.");
                    setIsConnecting(false);
                }
            }
          }
        });

        sessionRef.current = await sessionPromise;
      } catch (e) {
        console.error("Live Session Connect failed", e);
        setErrorState("Failed to connect. The service might be temporarily unavailable due to high traffic (Rate Limit).");
        setIsConnecting(false);
      }
    };

    startLiveSession();

    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
      if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    };
  }, [profile, mode, onClose]);

  const handleEndCall = () => {
    onClose(sessionMessagesRef.current);
  };

  if (errorState) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white p-6">
            <div className="bg-red-900/20 border border-red-500/50 rounded-3xl p-8 max-w-md text-center space-y-6 animate-in fade-in zoom-in-95">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-red-900/50">
                    <i className="fa-solid fa-server text-3xl"></i>
                </div>
                <h3 className="text-2xl font-black text-red-100">Connection Error</h3>
                <p className="text-red-200/70">{errorState}</p>
                <button onClick={handleEndCall} className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all">
                    Close Session
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white p-6 overflow-hidden safe-area-inset">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] transition-opacity duration-1000 ${isSpeaking ? 'opacity-100' : 'opacity-40'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] transition-opacity duration-1000 ${isSpeaking ? 'opacity-40' : 'opacity-100'}`}></div>
      </div>

      <div className="relative z-10 h-16 flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            {mode === SessionMode.EXAM ? 'EXAM LIVE' : 'PRACTICE LIVE'}
          </span>
        </div>
        <div className="text-center">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Developed by Jisan</span>
        </div>
        <button onClick={handleEndCall} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10">
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="relative flex items-center justify-center w-64 h-64">
          
          <svg className="absolute w-full h-full -rotate-90 transform overflow-visible" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/10" />
            {!isSpeaking && !isConnecting && (
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * inputVolume) / 100}
                strokeLinecap="round"
                className="text-indigo-400 transition-all duration-75 ease-out drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]"
              />
            )}
            
            {isSpeaking && (
               <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="283"
                className="text-emerald-400 animate-pulse"
                style={{ strokeDashoffset: 150 }}
              />
            )}
          </svg>

          <div className={`relative w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-[0_0_80px_rgba(79,70,229,0.4)] transition-all duration-500 ${isSpeaking ? 'scale-110 shadow-indigo-500/60' : 'scale-100'}`}>
            <div className={`absolute inset-0 rounded-full bg-white/20 animate-ping pointer-events-none ${isSpeaking ? 'block' : 'hidden'}`}></div>
            
            {isConnecting ? (
              <i className="fa-solid fa-circle-notch fa-spin text-4xl md:text-5xl"></i>
            ) : isSpeaking ? (
              <div className="flex items-end space-x-2 h-10 md:h-12">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 md:w-2 bg-white rounded-full animate-bounce"
                    style={{ 
                      height: `${40 + Math.random() * 60}%`,
                      animationDuration: `${0.6 + Math.random() * 0.4}s`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
            ) : (
              <div className="relative flex flex-col items-center">
                <i className={`fa-solid fa-microphone text-4xl md:text-5xl transition-transform duration-75 ${inputVolume > 10 ? 'scale-110' : 'scale-100'}`}></i>
                {inputVolume > 5 && (
                  <span className="absolute -bottom-6 text-[10px] font-black uppercase tracking-widest text-indigo-200 animate-pulse">Speaking</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">{persona.name}</h2>
          <p className={`text-sm md:text-base font-bold transition-all duration-500 ${isSpeaking ? 'text-indigo-400' : 'text-slate-500'}`}>
             {isConnecting ? 'Connecting...' : isSpeaking ? 'Examiner is speaking...' : 'Listening to you...'}
          </p>
        </div>

        {!isConnecting && (
          <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 min-h-[140px] flex flex-col justify-center items-center text-center">
            {activeModelText ? (
                <div className="text-base md:text-lg opacity-90 animate-pulse text-indigo-300 font-semibold leading-relaxed">
                  <span className="opacity-50 text-[10px] uppercase font-black mr-2 tracking-widest block mb-1 text-center">{persona.name}</span>
                  {activeModelText}
                </div>
            ) : (
                transcriptLines.filter(line => line.role === 'model').length > 0 ? (
                    <div className="text-base md:text-lg animate-in fade-in slide-in-from-bottom-2 duration-300 text-indigo-300 font-semibold leading-relaxed">
                       <span className="opacity-50 text-[10px] uppercase font-black mr-2 tracking-widest block mb-1 text-center">{persona.name}</span>
                       {transcriptLines.filter(line => line.role === 'model').slice(-1)[0].text}
                    </div>
                ) : (
                    <div className="text-sm text-white/30 italic">Conversation started...</div>
                )
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 h-28 flex justify-center items-start pt-4">
        <button 
          onClick={handleEndCall} 
          className="group flex flex-col items-center space-y-2"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/40 transition-all active:scale-90 border-4 border-red-500/30">
            <i className="fa-solid fa-phone-slash text-xl md:text-2xl"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">End Test</span>
        </button>
      </div>
    </div>
  );
};

export default LiveMode;