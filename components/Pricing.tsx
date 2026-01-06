import React from 'react';
import { Check, X } from 'lucide-react';

const PricingCard: React.FC<{ 
  name: string; 
  price: string; 
  features: string[]; 
  isPopular?: boolean; 
  buttonVariant?: 'primary' | 'outline' 
}> = ({ name, price, features, isPopular, buttonVariant = 'outline' }) => (
  <div className={`relative p-8 bg-white rounded-2xl border flex flex-col ${
    isPopular ? 'border-indigo-500 shadow-xl scale-105 z-10' : 'border-slate-200 shadow-sm'
  }`}>
    {isPopular && (
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
        Most Popular
      </div>
    )}
    <h3 className="text-xl font-bold text-slate-900 mb-2">{name}</h3>
    <div className="mb-6">
      <span className="text-4xl font-extrabold text-slate-900">{price}</span>
      {price !== 'Free' && <span className="text-slate-500">/month</span>}
    </div>
    <ul className="space-y-4 mb-8 flex-1">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start">
          <Check size={18} className="text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
          <span className="text-slate-600 text-sm">{feature}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
      buttonVariant === 'primary' 
        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
        : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
    }`}>
      {price === 'Free' ? 'Get Started' : 'Subscribe Now'}
    </button>
  </div>
);

const Pricing: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Transparent Pricing</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Choose the plan that fits your trading style. Unlock premium signals and deeper analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <PricingCard 
          name="Starter" 
          price="Free" 
          features={[
            "3 Signals per week",
            "Major pairs only (EUR/USD, GBP/USD)",
            "Standard entry/exit levels",
            "Email notifications",
            "Community Support"
          ]} 
        />
        <PricingCard 
          name="Pro Trader" 
          price="$49" 
          isPopular={true}
          buttonVariant="primary"
          features={[
            "Unlimited Daily Signals",
            "All Forex Majors & Minors",
            "Detailed Risk Analysis",
            "Instant Push Notifications",
            "Priority Email Support",
            "Weekly Market Outlook"
          ]} 
        />
        <PricingCard 
          name="VIP Elite" 
          price="$99" 
          features={[
            "Everything in Pro",
            "Gold (XAU) & Indices Signals",
            "1-on-1 Strategy Calls",
            "Exclusive Discord Access",
            "Early Access to Features",
            "Institutional Data Feed"
          ]} 
        />
      </div>

      <div className="mt-16 text-center">
        <p className="text-slate-500 text-sm">
          All plans include a 7-day money-back guarantee. No questions asked.
        </p>
      </div>
    </div>
  );
};

export default Pricing;