
import React, { useState } from 'react';
import type { LeadReport } from '../types';
import { ReportDisplay } from './ReportDisplay';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface ReportCardProps {
  report: LeadReport;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-brand-secondary rounded-xl border border-gray-700/50 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-800/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div>
          <h3 className="text-lg font-bold text-brand-text-primary">{report.businessOverview.name}</h3>
          <p className="text-sm text-brand-text-secondary">{report.businessOverview.location}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-brand-text-secondary">লিড স্কোর</p>
            <p className="font-bold text-xl text-brand-accent">{report.leadScore}/10</p>
          </div>
          <ChevronDownIcon
            className={`w-6 h-6 text-brand-text-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {isExpanded && (
        <div className="p-6 border-t border-gray-700/50">
          <ReportDisplay report={report} />
        </div>
      )}
    </div>
  );
};
