import React, { useState } from 'react';
import { Bell, Moon, Smartphone, Mail, Shield, User } from 'lucide-react';

const Toggle: React.FC<{ label: string; description?: string; enabled: boolean; onChange: () => void }> = ({ label, description, enabled, onChange }) => (
  <div className="flex items-center justify-between py-4">
    <div>
      <h3 className="text-sm font-medium text-slate-900">{label}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });
  
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Manage your account preferences and notifications.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="text-indigo-600" size={20} />
            <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <Toggle 
              label="Push Notifications" 
              description="Receive instant alerts for new signals."
              enabled={notifications.push} 
              onChange={() => setNotifications({...notifications, push: !notifications.push})} 
            />
            <Toggle 
              label="Email Digest" 
              description="Daily summary of performance and active trades."
              enabled={notifications.email} 
              onChange={() => setNotifications({...notifications, email: !notifications.email})} 
            />
            <Toggle 
              label="SMS Alerts" 
              description="Get critical trade updates via text message."
              enabled={notifications.sms} 
              onChange={() => setNotifications({...notifications, sms: !notifications.sms})} 
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="text-indigo-600" size={20} />
            <h2 className="text-lg font-bold text-slate-800">Account & Appearance</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <Toggle 
              label="Dark Mode" 
              description="Switch between light and dark themes."
              enabled={darkMode} 
              onChange={() => setDarkMode(!darkMode)} 
            />
             <div className="py-4 flex justify-between items-center">
               <div>
                 <h3 className="text-sm font-medium text-slate-900">Trading Platform</h3>
                 <p className="text-sm text-slate-500 mt-1">Default platform for trade execution links.</p>
               </div>
               <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm p-2 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                 <option>MetaTrader 4</option>
                 <option>MetaTrader 5</option>
                 <option>TradingView</option>
                 <option>cTrader</option>
               </select>
             </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;