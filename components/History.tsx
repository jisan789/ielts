import React, { useState } from 'react';
import { MOCK_HISTORY } from '../constants';
import { Filter, Calendar, ChevronDown } from 'lucide-react';

const History: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'WIN' | 'LOSS'>('ALL');

  const filteredHistory = filter === 'ALL' 
    ? MOCK_HISTORY 
    : MOCK_HISTORY.filter(item => item.result === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Trade History</h1>
          <p className="text-slate-500">Past performance and closed trades.</p>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="ALL">All Results</option>
              <option value="WIN">Wins Only</option>
              <option value="LOSS">Losses Only</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
          </div>
          <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded-lg text-sm hover:bg-slate-50">
            <Calendar size={16} />
            <span>Date Range</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pair</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Entry</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Close</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pips</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm text-slate-600">{item.date}</td>
                  <td className="p-4 text-sm font-medium text-slate-800">{item.pair}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      item.type === 'BUY' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{item.entryPrice.toFixed(4)}</td>
                  <td className="p-4 text-sm text-slate-600">{item.closePrice.toFixed(4)}</td>
                  <td className={`p-4 text-sm font-bold ${item.pips > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.pips > 0 ? '+' : ''}{item.pips}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.result === 'WIN' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredHistory.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No trade history found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default History;