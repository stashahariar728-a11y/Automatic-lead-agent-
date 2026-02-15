
import React, { useState } from 'react';
import type { UserCriteria } from '../types';
import { SearchIcon } from './icons/SearchIcon';

interface CriteriaFormProps {
  onSubmit: (criteria: UserCriteria) => void;
}

export const CriteriaForm: React.FC<CriteriaFormProps> = ({ onSubmit }) => {
  const [criteria, setCriteria] = useState<UserCriteria>({
    niche: 'Boutique Coffee Shops',
    location: 'Austin, Texas',
    targetProblems: 'low foot traffic on weekdays, inconsistent social media presence, poor local SEO ranking',
    intendedService: 'Local SEO optimization and Social Media Management package',
    leadScoreThreshold: 7,
    businessStage: 'All Stages',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCriteria(prev => ({ ...prev, [name]: value }));
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCriteria(prev => ({ ...prev, leadScoreThreshold: parseInt(e.target.value, 10) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(criteria);
  };

  return (
    <div className="bg-brand-secondary p-8 rounded-xl shadow-2xl border border-gray-700/50">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="niche" className="block text-sm font-medium text-brand-text-secondary mb-2">নিশ / শিল্প</label>
            <input type="text" name="niche" id="niche" value={criteria.niche} onChange={handleChange}
              className="w-full bg-brand-primary border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-accent focus:outline-none"
              placeholder="যেমন, SaaS স্টার্টআপ, স্থানীয় রেস্তোরাঁ" required />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-brand-text-secondary mb-2">অবস্থান</label>
            <input type="text" name="location" id="location" value={criteria.location} onChange={handleChange}
              className="w-full bg-brand-primary border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-accent focus:outline-none"
              placeholder="যেমন, ঢাকা, বাংলাদেশ" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-text-secondary mb-2">ব্যবসার পর্যায়</label>
          <div className="bg-brand-primary p-2 rounded-lg border border-gray-600 flex flex-wrap gap-2">
              <label className={`flex-1 text-center cursor-pointer px-4 py-2 rounded-md text-sm transition-colors ${criteria.businessStage === 'All Stages' ? 'bg-brand-accent text-white font-semibold' : 'hover:bg-gray-700/50'}`}>
                  <input type="radio" name="businessStage" value="All Stages" checked={criteria.businessStage === 'All Stages'} onChange={handleChange} className="sr-only" />
                  সব পর্যায়
              </label>
              <label className={`flex-1 text-center cursor-pointer px-4 py-2 rounded-md text-sm transition-colors ${criteria.businessStage === 'Startup' ? 'bg-brand-accent text-white font-semibold' : 'hover:bg-gray-700/50'}`}>
                  <input type="radio" name="businessStage" value="Startup" checked={criteria.businessStage === 'Startup'} onChange={handleChange} className="sr-only" />
                  স্টার্টআপ
              </label>
              <label className={`flex-1 text-center cursor-pointer px-4 py-2 rounded-md text-sm transition-colors ${criteria.businessStage === 'Growing' ? 'bg-brand-accent text-white font-semibold' : 'hover:bg-gray-700/50'}`}>
                  <input type="radio" name="businessStage" value="Growing" checked={criteria.businessStage === 'Growing'} onChange={handleChange} className="sr-only" />
                  ক্রমবর্ধমান
              </label>
              <label className={`flex-1 text-center cursor-pointer px-4 py-2 rounded-md text-sm transition-colors ${criteria.businessStage === 'Established' ? 'bg-brand-accent text-white font-semibold' : 'hover:bg-gray-700/50'}`}>
                  <input type="radio" name="businessStage" value="Established" checked={criteria.businessStage === 'Established'} onChange={handleChange} className="sr-only" />
                  প্রতিষ্ঠিত
              </label>
          </div>
        </div>
        <div>
          <label htmlFor="targetProblems" className="block text-sm font-medium text-brand-text-secondary mb-2">লক্ষ্যযুক্ত সমস্যা (কমা দ্বারা পৃথক করুন)</label>
          <textarea name="targetProblems" id="targetProblems" value={criteria.targetProblems} onChange={handleChange} rows={3}
            className="w-full bg-brand-primary border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-accent focus:outline-none"
            placeholder="যেমন, পুরনো ওয়েবসাইট, অনলাইন বিজ্ঞাপন নেই" required />
        </div>
        <div>
          <label htmlFor="intendedService" className="block text-sm font-medium text-brand-text-secondary mb-2">আপনার পরিষেবা অফার</label>
          <input type="text" name="intendedService" id="intendedService" value={criteria.intendedService} onChange={handleChange}
            className="w-full bg-brand-primary border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-accent focus:outline-none"
            placeholder="যেমন, ওয়েব ডিজাইন এবং এসইও প্যাকেজ" required />
        </div>
        <div>
          <label htmlFor="leadScoreThreshold" className="block text-sm font-medium text-brand-text-secondary mb-2">
            ন্যূনতম লিড স্কোর: <span className="font-bold text-brand-accent">{criteria.leadScoreThreshold}/10</span>
          </label>
          <input type="range" name="leadScoreThreshold" id="leadScoreThreshold" min="1" max="10" value={criteria.leadScoreThreshold} onChange={handleScoreChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-accent" />
        </div>
        <div className="pt-4">
          <button type="submit"
            className="w-full flex items-center justify-center gap-2 bg-brand-accent text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-accent-hover transition-colors duration-300 transform hover:scale-105 shadow-lg shadow-brand-accent/20">
            <SearchIcon className="w-5 h-5" />
            উচ্চ-মানের লিড খুঁজুন
          </button>
        </div>
      </form>
    </div>
  );
};
