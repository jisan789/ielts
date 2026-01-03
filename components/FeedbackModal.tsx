
import React, { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, userName }) => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsSending(true);

    const message = `Feedback from ${userName || 'User'}: ${text}`;
    // Using the user provided bot token and chat id directly
    const url = `https://api.telegram.org/bot7878745985:AAER21EP6RNcePIQ34_2TS1Hwdh55DVbaKk/sendMessage?chat_id=6372563890&text=${encodeURIComponent(message)}`;

    try {
      await fetch(url);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setText('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to send feedback', error);
      alert('Could not send feedback. Please check your internet connection.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        
        <div className="mb-6">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl mb-4">
            <i className="fa-regular fa-comment-dots"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-900">Feedback</h3>
          <p className="text-slate-500 mt-1">Found a bug or have a suggestion? Let us know directly.</p>
        </div>

        {sent ? (
          <div className="py-10 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <i className="fa-solid fa-check"></i>
            </div>
            <h4 className="text-xl font-bold text-slate-900">Sent!</h4>
            <p className="text-slate-500 mt-1">Thanks for helping us improve.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 transition-all min-h-[140px] resize-none font-medium"
              placeholder="Type your message here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
            <button
              onClick={handleSubmit}
              disabled={isSending || !text.trim()}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none transition-all flex items-center justify-center space-x-2"
            >
              {isSending ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
