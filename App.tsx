
import React, { useState, useEffect } from 'react';
import { CriteriaForm } from './components/CriteriaForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SparklesIcon } from './components/icons/SparklesIcon';
import type { LeadReport, UserCriteria, HistoryEntry } from './types';
import { generateLeadReport } from './services/geminiService';
import { ReportCard } from './components/ReportCard';
import { HistoryView } from './components/HistoryView';
import { ArchiveBoxIcon } from './components/icons/ArchiveBoxIcon';
import { SearchIcon } from './components/icons/SearchIcon';


const App: React.FC = () => {
  const [reports, setReports] = useState<LeadReport[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'needed' | 'ready'>('checking');
  const [currentView, setCurrentView] = useState<'form' | 'reports' | 'history'>('form');
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // Load history from localStorage on initial load
    try {
      const savedHistory = localStorage.getItem('leadGenHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("হিস্টরি লোড করতে ব্যর্থ হয়েছে", e);
    }

    // Check for API key
    const checkApiKey = async () => {
      if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeyStatus(hasKey ? 'ready' : 'needed');
      } else {
        setApiKeyStatus('needed');
      }
    };
    const timeoutId = setTimeout(checkApiKey, 200);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSelectKey = async () => {
    if (typeof window.aistudio?.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setApiKeyStatus('ready');
      setError(null);
    } else {
      setError("API কী নির্বাচন করার সুবিধাটি এই মুহূর্তে উপলব্ধ নয়।");
    }
  };

  const handleGenerateReport = async (criteria: UserCriteria) => {
    setIsLoading(true);
    setError(null);
    setReports(null);
    try {
      const generatedReports = await generateLeadReport(criteria);
      setReports(generatedReports);
      
      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        timestamp: new Date().toLocaleString('bn-BD'),
        criteria,
        reports: generatedReports,
      };
      
      setHistory(prevHistory => {
        const updatedHistory = [newEntry, ...prevHistory];
        try {
          localStorage.setItem('leadGenHistory', JSON.stringify(updatedHistory));
        } catch (e) {
          console.error("হিস্টরি সংরক্ষণ করতে ব্যর্থ হয়েছে", e);
          setError("আপনার ব্রাউজারের স্টোরেজ পূর্ণ হওয়ায় হিস্টরি সংরক্ষণ করা যায়নি।");
        }
        return updatedHistory;
      });

      setCurrentView('reports');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'একটি অজানা ত্রুটি ঘটেছে।';
      console.error(err);
      if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('API key not valid')) {
        setError('আপনার নির্বাচিত API কী কাজ করছে না। অনুগ্রহ করে একটি বিলিং-সক্ষম প্রকল্প থেকে একটি নতুন, বৈধ কী নির্বাচন করুন।');
        setApiKeyStatus('needed');
      } else {
        setError(errorMessage);
        setCurrentView('form');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryEntry = (entry: HistoryEntry) => {
    setReports(entry.reports);
    setError(null);
    setCurrentView('reports');
  };

  const handleClearHistory = () => {
    if (window.confirm("আপনি কি আপনার সম্পূর্ণ হিস্টরি মুছে ফেলতে নিশ্চিত?")) {
        setHistory([]);
        localStorage.removeItem('leadGenHistory');
    }
  };

  const renderMainContent = () => {
    if (apiKeyStatus === 'checking') return <LoadingSpinner />;

    if (apiKeyStatus === 'needed') {
      return (
        <div className="bg-brand-secondary p-8 rounded-xl shadow-2xl border border-gray-700/50 text-center max-w-lg mx-auto">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center mb-6">
              <p className="font-bold">প্রমাণীকরণ সমস্যা</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          <h2 className="text-2xl font-bold text-brand-text-primary mb-4">API কী প্রয়োজন</h2>
          <p className="text-brand-text-secondary mb-6">এই অ্যাপটি ব্যবহার করার জন্য, আপনাকে একটি বিলিং-সক্ষম Google Cloud প্রকল্প থেকে আপনার নিজের Gemini API কী নির্বাচন করতে হবে।</p>
          <button onClick={handleSelectKey} className="w-full bg-brand-accent text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-accent-hover transition-colors">API কী নির্বাচন করুন</button>
          <p className="text-xs text-brand-text-secondary mt-4"><a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">বিলিং ডকুমেন্টেশন</a> দেখুন।</p>
        </div>
      );
    }

    if (isLoading) return <LoadingSpinner />;

    if (currentView === 'history') {
      return <HistoryView history={history} onSelect={handleSelectHistoryEntry} onClear={handleClearHistory} />;
    }

    if (currentView === 'reports' && reports) {
      return (
        <div className="space-y-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brand-text-primary">আপনার জন্য {reports.length}টি লিড পাওয়া গেছে</h2>
          </div>
          {reports.map((report, index) => <ReportCard key={index} report={report} />)}
        </div>
      );
    }

    // Default to 'form' view
    return (
        <>
            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center mb-6">
                    <p className="font-bold">রিপোর্ট তৈরি ব্যর্থ হয়েছে</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
            <CriteriaForm onSubmit={handleGenerateReport} />
        </>
    );
  };

  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <SparklesIcon className="w-8 h-8 text-brand-accent" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary">Automatic Lead Agent</h1>
          </div>
          <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">আপনার আদর্শ গ্রাহককে সংজ্ঞায়িত করুন, এবং আমাদের এআই এজেন্টকে একটি সম্পূর্ণ আউটরিচ পরিকল্পনা তৈরি করতে দিন।</p>
        </header>
        
        {apiKeyStatus === 'ready' && (
          <nav className="flex justify-center gap-4 mb-8">
            <button onClick={() => setCurrentView('form')} className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${currentView === 'form' ? 'bg-brand-accent text-white' : 'bg-brand-secondary hover:bg-gray-700/50'}`}>
                <SearchIcon className="w-5 h-5" />
                নতুন সার্চ
            </button>
            <button onClick={() => setCurrentView('history')} className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${currentView === 'history' ? 'bg-brand-accent text-white' : 'bg-brand-secondary hover:bg-gray-700/50'}`}>
                <ArchiveBoxIcon className="w-5 h-5" />
                হিস্টরি দেখুন ({history.length})
            </button>
          </nav>
        )}

        <div className="max-w-4xl mx-auto">
          {renderMainContent()}
        </div>
      </main>
      <footer className="text-center py-6">
        <p className="text-brand-text-secondary text-sm">Gemini AI দ্বারা চালিত</p>
      </footer>
    </div>
  );
};

export default App;