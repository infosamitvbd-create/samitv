import React from 'react';
import { Facebook, Youtube, Twitter, Instagram, Linkedin, MapPin, Calendar, Search, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SAMILogo } from './SAMILogo';

export const Header: React.FC<{ 
  onNavigate: (page: string) => void;
  currentPage: string;
}> = ({ onNavigate, currentPage }) => {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const today = new Date();
  
  // Bengali Date Logic
  const bnOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const bnDate = today.toLocaleDateString('bn-BD', bnOptions);
  
  // Rough Hijri & Bengali Year Calculation
  // In a real app, one would use a library like 'hijri-converter' or 'moment-hijri'
  // For design purposes, we'll provide an approximate calculation or stable display
  const getBengaliYear = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let bnYear = year - 593;
    if (month < 4 || (month === 4 && day < 14)) bnYear -= 1;
    return bnYear.toLocaleString('bn-BD');
  };

  const getHijriDate = () => {
    // This is a placeholder for the Hijri date as shown in the static image logic
    return '০ জিলকদ ১৪৪৭'; 
  };

  const getBengaliMonthDay = () => {
    return '৫ বৈশাখ';
  };

  return (
    <header className="bg-white">
      {/* Top Bar */}
      <div className="border-b border-gray-100 bg-[#fdfdfd] py-1.5 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2 max-w-7xl">
          <div className="text-[14px] font-medium text-gray-700 flex flex-wrap justify-center items-center gap-1">
            <span>ঢাকা, </span>
            <span>{bnDate}</span>
            <span className="mx-1 text-gray-300">|</span>
            <span>{getBengaliMonthDay()} {getBengaliYear(today)}</span>
            <span className="mx-1 text-gray-300">|</span>
            <span>{getHijriDate()}</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('/live')}
              className="flex items-center gap-2 bg-sami-red text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE TV
              <PlayCircle size={14} className="group-hover:scale-110 transition-transform" />
            </button>
            <div className="h-4 w-[1px] bg-gray-300 mx-1 hidden md:block"></div>
            <div className="flex items-center gap-2">
              {[
                { icon: Facebook, color: 'bg-[#1877F2]', href: 'https://www.facebook.com/samitvbd' },
                { icon: Youtube, color: 'bg-[#FF0000]', href: 'https://www.youtube.com/@stv2026Banglades' },
                { icon: Twitter, color: 'bg-[#1DA1F2]', href: '#' },
                { icon: Linkedin, color: 'bg-[#0A66C2]', href: '#' }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`w-7 h-7 flex items-center justify-center rounded-full ${social.color} text-white hover:opacity-80 transition-all`}
                >
                  <social.icon size={14} />
                </a>
              ))}
            </div>
            <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 text-gray-700 hover:text-sami-red transition-colors"
            >
              <Search size={22} className="stroke-[2.5px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-50 border-b border-gray-200"
          >
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <div className="relative">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="সংবাদ খুঁজুন..."
                  className="w-full bg-white border-2 border-sami-accent rounded-xl py-4 pl-6 pr-16 text-lg focus:outline-none focus:border-sami-red transition-all shadow-xl shadow-sami-red/5"
                />
                <button className="absolute right-2 top-2 bottom-2 px-6 bg-sami-red text-white rounded-lg hover:bg-sami-purple transition-colors shadow-lg shadow-sami-red/20">
                  <Search size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Header Row: Logo & Ad */}
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row items-center justify-between gap-8 max-w-7xl">
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <div className="flex-shrink-0 cursor-pointer transform hover:scale-105 transition-transform duration-300" onClick={() => onNavigate('/')}>
            <SAMILogo className="scale-100 origin-center lg:origin-left" />
          </div>
          <div className="hidden sm:flex flex-col border-l-2 border-sami-red/20 pl-6 py-1">
            <h1 className="text-2xl font-black text-sami-dark leading-none tracking-tighter uppercase font-eng">
              SAMI MULTIMEDIA <span className="text-sami-red">LTD.</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-[0.3em] font-eng">
              SAMI NETWORK BANGLADESH
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 bg-gray-900 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest font-eng">
                <span className="w-1.5 h-1.5 bg-sami-red rounded-full animate-pulse"></span>
                Digital Edition
              </div>
              <span className="text-[11px] text-gray-500 font-bold italic tracking-wide">
                বাংলায় কথা বলে...
              </span>
            </div>
          </div>
        </div>
        
        {/* Header Ad replaced with beautiful Eid Mubarak Shubeccha Banner */}
        <div 
          onClick={() => onNavigate('/festival-poster')}
          className="flex-grow w-full lg:max-w-[728px] h-[90px] bg-gradient-to-r from-[#3a0007] via-[#800511] to-[#200004] rounded-lg border-2 border-amber-400/60 shadow-md overflow-hidden flex items-center justify-between p-4 sm:p-5 group relative cursor-pointer select-none"
          title="এখানে ক্লিক করে নিজের পোস্টার তৈরি করুন"
        >
          {/* Ornaments & Background Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          
          {/* Small Corner Ornaments */}
          <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-amber-400/40 pointer-events-none" />
          <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-amber-400/40 pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-amber-400/40 pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-amber-400/40 pointer-events-none" />

          {/* Left section: Elegant Festival Moon icon decoration */}
          <div className="relative flex items-center gap-2.5 z-10 shrink-0">
            <div className="relative">
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-450 bg-amber-400"></span>
              </span>
              <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.1)]">
                <svg className="w-5 h-5 text-amber-300 fill-amber-300/10 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              </div>
            </div>
            
            <div className="hidden md:flex flex-col items-start leading-none gap-0.5">
              <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">পবিত্র ঈদ উৎসব</span>
              <span className="text-[11px] font-black text-white/90">শুভেচ্ছা বাণী</span>
            </div>
          </div>

          {/* Center text: Elegant Greetings Header text */}
          <div className="flex-grow text-center relative z-10 flex flex-col justify-center gap-0.5 px-2">
            <div className="text-[10px] sm:text-[11px] font-bold text-amber-100/90 leading-none">
              দেশ ও বিদেশে সর্বস্তরের ধর্মপ্রাণ মুসলিম ভাই-বোনদের জানাই
            </div>
            <div className="text-base sm:text-lg lg:text-xl font-black bg-gradient-to-r from-white via-amber-100 to-yellow-250 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-sans leading-tight">
              পবিত্র ঈদ-উল-আযহার শুভেচ্ছা ও ঈদ মোবারক
            </div>
            <div className="text-[9px] font-bold text-gray-300/85 leading-none">
              — সামি টেলিভিশন পরিবারের পক্ষ থেকে শুভেচ্ছা
            </div>
          </div>

          {/* Right section: Highlighted interactive buttons */}
          <div className="relative flex items-center z-10 shrink-0 gap-2">
            <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-yellow-400 hover:to-amber-500 text-red-950 font-black text-xs rounded shadow-md border border-yellow-200 transition-all cursor-pointer transform group-hover:scale-105">
              ঈদ মোবারক
            </div>
          </div>

          <div className="absolute top-1 right-2 font-bold text-white/20 uppercase tracking-widest text-[6px] z-10 pointer-events-none font-eng">
            SAMI TV SPECIAL
          </div>
        </div>
      </div>
    </header>
  );
};
