
import React from 'react';
import type { HistoryEntry } from '../types';

interface HistoryViewProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="bg-brand-secondary p-8 rounded-xl shadow-2xl border border-gray-700/50 text-center">
        <h2 className="text-2xl font-bold text-brand-text-primary mb-4">কোনো হিস্টরি নেই</h2>
        <p className="text-brand-text-secondary">আপনি এখনো কোনো লিড জেনারেট করেননি। নতুন সার্চ করে শুরু করুন।</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-secondary p-6 rounded-xl shadow-2xl border border-gray-700/50">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-brand-text-primary">সার্চ হিস্টরি</h2>
        <button onClick={onClear} className="text-sm bg-red-800/50 text-red-300 hover:bg-red-700/50 py-1 px-3 rounded-lg transition-colors">
          হিস্টরি মুছুন
        </button>
      </div>
      <ul className="space-y-4">
        {history.map((entry) => (
          <li key={entry.id}>
            <button
              onClick={() => onSelect(entry)}
              className="w-full text-left bg-brand-primary p-4 rounded-lg border border-gray-700 hover:border-brand-accent transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-brand-text-primary">{entry.criteria.niche}</p>
                  <p className="text-sm text-brand-text-secondary">{entry.criteria.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-brand-text-secondary">{entry.timestamp}</p>
                  <span className="text-sm mt-1 inline-block bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded-full">
                    {entry.reports.length} টি লিড
                  </span>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
