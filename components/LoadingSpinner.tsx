
import React from 'react';

const loadingMessages = [
  "আপনার জন্য ৫টি সেরা লিড খোঁজা হচ্ছে...",
  "ব্যবসাগুলির ডিজিটাল উপস্থিতি বিশ্লেষণ করা হচ্ছে...",
  "সম্ভাব্যতা এবং দুর্বলতা মূল্যায়ন করা হচ্ছে...",
  "প্রতিটি লিডের জন্য বিস্তারিত রিপোর্ট তৈরি করা হচ্ছে...",
  "চূড়ান্ত প্রতিবেদন সংকলন করা হচ্ছে...",
];

export const LoadingSpinner: React.FC = () => {
  const [message, setMessage] = React.useState(loadingMessages[0]);

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setMessage(loadingMessages[index]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-brand-secondary rounded-xl shadow-2xl border border-gray-700/50">
        <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-semibold text-brand-text-primary mb-2">এআই এজেন্ট কাজ করছে</h2>
        <p className="text-brand-text-secondary animate-subtle-pulse transition-all duration-500">{message}</p>
    </div>
  );
};
