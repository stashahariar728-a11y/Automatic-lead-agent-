
import React, { useState } from 'react';
import { CriteriaForm } from './components/CriteriaForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SparklesIcon } from './components/icons/SparklesIcon';
import type { LeadReport, UserCriteria } from './types';
import { generateLeadReport } from './services/geminiService';
import { ReportCard } from './components/ReportCard';

const App: React.FC = () => {
  const [reports, setReports] = useState<LeadReport[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async (criteria: UserCriteria) => {
    setIsLoading(true);
    setError(null);
    setReports(null);
    try {
      const generatedReports = await generateLeadReport(criteria);
      setReports(generatedReports);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'একটি অজানা ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setReports(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <SparklesIcon className="w-8 h-8 text-brand-accent" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary">
              Automatic Lead Agent
            </h1>
          </div>
          <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
            আপনার আদর্শ গ্রাহককে সংজ্ঞায়িত করুন, এবং আমাদের এআই এজেন্টকে একটি সম্পূর্ণ আউটরিচ পরিকল্পনা আবিষ্কার, যোগ্যতা অর্জন এবং তৈরি করতে দিন।
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
              <p className="font-bold">রিপোর্ট তৈরি ব্যর্থ হয়েছে</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={handleStartOver}
                className="mt-4 bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors duration-300"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          ) : reports ? (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-text-primary">আপনার জন্য {reports.length}টি লিড পাওয়া গেছে</h2>
                <button
                  onClick={handleStartOver}
                  className="mt-4 bg-brand-accent text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent-hover transition-colors duration-300"
                >
                  নতুন করে খুঁজুন
                </button>
              </div>
              {reports.map((report, index) => (
                <ReportCard key={index} report={report} />
              ))}
            </div>
          ) : (
            <CriteriaForm onSubmit={handleGenerateReport} />
          )}
        </div>
      </main>
      <footer className="text-center py-6">
        <p className="text-brand-text-secondary text-sm">Gemini AI দ্বারা চালিত</p>
      </footer>
    </div>
  );
};

export default App;
