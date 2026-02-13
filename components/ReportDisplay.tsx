
import React, { useState } from 'react';
import type { LeadReport } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { EmailIcon } from './icons/EmailIcon';

interface ReportDisplayProps {
  report: LeadReport;
}

const ReportSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-brand-primary p-6 rounded-lg border border-gray-700/50 mt-4">
    <h3 className="text-xl font-semibold text-brand-accent mb-4 border-b border-gray-700 pb-2">{title}</h3>
    {children}
  </div>
);

const CopyToClipboard: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text-primary transition-colors">
      {copied ? <span className="text-xs text-green-400">অনুলিপি করা হয়েছে!</span> : <ClipboardIcon className="w-5 h-5" />}
    </button>
  );
};

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {

  const handleSendEmail = () => {
    const recipient = "shahariartahmid1107@gmail.com";
    const subject = `সম্পূর্ণ রিসার্চ পেপার: ${report.businessOverview.name}`;
    
    const body = `
=========================================
এআই লিড জেনারেশন রিসার্চ পেপার
=========================================

ব্যবসার নাম: ${report.businessOverview.name}
লিড স্কোর: ${report.leadScore}/10

--- ব্যবসার প্রোফাইল ---
শিল্প: ${report.businessOverview.industry}
অবস্থান: ${report.businessOverview.location}
ব্যবসার পর্যায়: ${report.businessOverview.businessStage}
ওয়েবসাইট: ${report.businessOverview.website}
ফেসবুক: ${report.businessOverview.facebookLink}
অন্যান্য সোশ্যাল মিডিয়া: ${report.businessOverview.socialMedia}

=========================================
নির্বাহী সারসংক্ষেপ
=========================================
${report.executiveSummary}

=========================================
চিহ্নিত প্রধান সমস্যাসমূহ
=========================================
${report.identifiedProblems.map(p => `• ${p}`).join('\n')}

=========================================
বৃদ্ধির সম্ভাব্য সুযোগ
=========================================
${report.growthOpportunities.map(o => `• ${o}`).join('\n')}

=========================================
প্রস্তাবিত পরিষেবা
=========================================
${report.recommendedServices}

=========================================
বিস্তারিত ডিজিটাল অডিট
=========================================
• ব্র্যান্ডিং: ${report.digitalAuditFindings.branding}
• বিষয়বস্তু (Content): ${report.digitalAuditFindings.content}
• এনগেজমেন্ট: ${report.digitalAuditFindings.engagement}
• ফানেল: ${report.digitalAuditFindings.funnel}
• বিজ্ঞাপন (Ads): ${report.digitalAuditFindings.ads}
• ওয়েবসাইট: ${report.digitalAuditFindings.website}

=========================================
আউটরিচ এর জন্য প্রস্তাবিত স্ক্রিপ্ট
=========================================

--- ইমেল সংস্করণ ---
${report.outreachScripts.emailVersion}

--- সোশ্যাল মিডিয়া ডিএম ---
${report.outreachScripts.shortDM}
    `;

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.trim())}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center p-6 bg-brand-primary rounded-lg border border-gray-700/50">
        <p className="text-sm text-brand-text-secondary uppercase tracking-widest">নির্বাহী সারসংক্ষেপ</p>
        <p className="mt-2 text-brand-text-primary">{report.executiveSummary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm bg-brand-primary p-4 rounded-lg border border-gray-700/50">
            <li className="font-bold text-lg text-brand-accent mb-2">ব্যবসার বিবরণ</li>
            <li><strong>নাম:</strong> {report.businessOverview.name}</li>
            <li><strong>শিল্প:</strong> {report.businessOverview.industry}</li>
            <li><strong>অবস্থান:</strong> {report.businessOverview.location}</li>
            <li><strong>ওয়েবসাইট:</strong> <a href={report.businessOverview.website} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline break-all">{report.businessOverview.website}</a></li>
            {report.businessOverview.facebookLink && report.businessOverview.facebookLink !== 'Data Not Available' && (
              <li>
                  <strong>ফেসবুক:</strong> <a href={report.businessOverview.facebookLink} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline break-all">{report.businessOverview.facebookLink}</a>
              </li>
            )}
            <li><strong>সোশ্যাল মিডিয়া:</strong> {report.businessOverview.socialMedia}</li>
             <li><strong>ব্যবসার পর্যায়:</strong> {report.businessOverview.businessStage}</li>
          </ul>
        <div className="bg-brand-primary p-4 rounded-lg border border-gray-700/50">
           <p className="font-bold text-lg text-brand-accent mb-2">ডিজিটাল অডিট</p>
           <div className="space-y-2 text-sm">
            <p><strong>ব্র্যান্ডিং:</strong> {report.digitalAuditFindings.branding}</p>
            <p><strong>বিষয়বস্তু:</strong> {report.digitalAuditFindings.content}</p>
            <p><strong>এনগেজমেন্ট:</strong> {report.digitalAuditFindings.engagement}</p>
            <p><strong>ফানেল:</strong> {report.digitalAuditFindings.funnel}</p>
            <p><strong>বিজ্ঞাপন:</strong> {report.digitalAuditFindings.ads}</p>
            <p><strong>ওয়েবসাইট:</strong> {report.digitalAuditFindings.website}</p>
        </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-brand-primary p-4 rounded-lg border border-gray-700/50">
            <p className="font-bold text-lg text-red-400 mb-2">চিহ্নিত সমস্যা</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-red-300">
                {report.identifiedProblems.map((problem, i) => <li key={i}>{problem}</li>)}
            </ul>
        </div>
        <div className="bg-brand-primary p-4 rounded-lg border border-gray-700/50">
            <p className="font-bold text-lg text-green-400 mb-2">বৃদ্ধির সুযোগ</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-green-300">
                {report.growthOpportunities.map((opp, i) => <li key={i}>{opp}</li>)}
            </ul>
        </div>
      </div>
      
      <ReportSection title="প্রস্তাবিত পরিষেবা">
        <p className="text-sm">{report.recommendedServices}</p>
      </ReportSection>
      
      <ReportSection title="আউটরিচ স্ক্রিপ্ট">
        <div className="space-y-6">
            <div className="relative bg-brand-primary p-4 rounded-lg border border-gray-700">
                <CopyToClipboard text={report.outreachScripts.shortDM} />
                <h4 className="font-semibold text-brand-text-primary mb-2">শর্ট ডিএম / সোশ্যাল মিডিয়া</h4>
                <p className="text-sm whitespace-pre-wrap font-mono">{report.outreachScripts.shortDM}</p>
            </div>
             <div className="relative bg-brand-primary p-4 rounded-lg border border-gray-700">
                <CopyToClipboard text={report.outreachScripts.emailVersion} />
                <h4 className="font-semibold text-brand-text-primary mb-2">পেশাদার ইমেল</h4>
                <p className="text-sm whitespace-pre-wrap font-mono">{report.outreachScripts.emailVersion}</p>
            </div>
        </div>
      </ReportSection>

      {report.sources && report.sources.length > 0 && (
        <ReportSection title="উৎস">
          <ul className="list-disc list-inside space-y-2 text-sm">
            {report.sources.map((source, i) => (
              <li key={i}>
                <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">
                  {source.web.title || source.web.uri}
                </a>
              </li>
            ))}
          </ul>
        </ReportSection>
      )}

      <div className="text-center pt-4">
        <button
          onClick={handleSendEmail}
          className="flex items-center gap-2 mx-auto bg-brand-accent text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent-hover transition-colors duration-300"
        >
          <EmailIcon className="w-5 h-5" />
          এই রিপোর্টটি ইমেল করুন
        </button>
      </div>
    </div>
  );
};
