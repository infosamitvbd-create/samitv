import React from 'react';

export const SAMILogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQ5UOEGSzZlZ-agaH9fVQiJVMVyMhv6aNEabwKq4kQwFEktnew6PgR7tfNMT-jOAwmfv6-JyQIvtx728t9h2OOIA8VirN8O6MBAB8ikV7jF5FYHU40mz1vEuHlgjVR863rTTc34-sHqGb3KAsGeWEVHEYVOfFsrAs7T-vQW6YmrqoFv0wV6CtnJx-buiSE/s1600/NEW%20LOGO.png" 
        alt="Sami TV Logo" 
        className="h-20 w-auto object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.03)]"
        referrerPolicy="no-referrer"
      />
      <div className="text-sami-red font-bold text-sm mt-1">সামি টেলিভিশন</div>
      <div className="text-gray-500 text-[10px]">হৃদয়ের নতুন প্রজন্ম</div>
    </div>
  );
};
