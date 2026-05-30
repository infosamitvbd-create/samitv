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
      <div className="border-b border-gray-100 bg-[#fdfdfd] py-1.5 px-4 font-sans">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[14px] font-medium text-gray-700 flex flex-wrap justify-center items-center gap-1"
          >
            <span>ঢাকা, </span>
            <span>{bnDate}</span>
            <span className="mx-1 text-gray-300">|</span>
            <span>{getBengaliMonthDay()} {getBengaliYear(today)}</span>
            <span className="mx-1 text-gray-300">|</span>
            <span>{getHijriDate()}</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <motion.button 
              onClick={() => onNavigate('/live')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-sami-red text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE TV
              <PlayCircle size={14} className="group-hover:scale-110 transition-transform" />
            </motion.button>
            <div className="h-4 w-[1px] bg-gray-300 mx-1 hidden md:block"></div>
            <div className="flex items-center gap-2">
              {[
                { icon: Facebook, color: 'bg-[#1877F2]', href: 'https://www.facebook.com/samitvbd' },
                { icon: Youtube, color: 'bg-[#FF0000]', href: 'https://www.youtube.com/@stv2026Banglades' },
                { icon: Twitter, color: 'bg-[#1DA1F2]', href: '#' },
                { icon: Linkedin, color: 'bg-[#0A66C2]', href: '#' }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.05 * i, ease: "easeOut" }}
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  className={`w-7 h-7 flex items-center justify-center rounded-full ${social.color} text-white hover:opacity-80 transition-all`}
                >
                  <social.icon size={14} />
                </motion.a>
              ))}
            </div>
            <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 text-gray-700 hover:text-sami-red transition-colors"
            >
              <Search size={22} className="stroke-[2.5px]" />
            </button>
          </motion.div>
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
          <motion.div 
            className="flex-shrink-0 cursor-pointer" 
            onClick={() => onNavigate('/')}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <SAMILogo className="scale-100 origin-center lg:origin-left" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="hidden sm:flex flex-col border-l-2 border-sami-red/20 pl-6 py-1"
          >
            <motion.h1 
              className="text-2xl font-black text-sami-dark leading-none tracking-tighter uppercase font-eng"
              whileHover={{ scale: 1.015, originX: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 15 }}
            >
              SAMI MULTIMEDIA <span className="text-sami-red">LTD.</span>
            </motion.h1>
            <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-[0.3em] font-eng">
              SAMI NETWORK BANGLADESH
            </p>
            <div className="flex items-center gap-3 mt-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 bg-gray-900 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest font-eng"
              >
                <span className="w-1.5 h-1.5 bg-sami-red rounded-full animate-pulse"></span>
                Digital Edition
              </motion.div>
              <span className="text-[11px] text-gray-500 font-bold italic tracking-wide">
                বাংলায় কথা বলে...
              </span>
            </div>
          </motion.div>
        </div>
        
        {/* Header Ad Slot (Commercial Advertisement Space) */}
        <motion.div 
          onClick={() => onNavigate('/contact')}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-grow w-full lg:max-w-[728px] h-[90px] bg-black rounded-lg border border-gray-700/40 shadow-md overflow-hidden group relative cursor-pointer select-none"
          title="বিজ্ঞাপন"
        >
          {/* Breathing image with continuous animation */}
          <motion.img 
            src="https://tpc.googlesyndication.com/simgad/7639802920549966978" 
            alt="Advertisement" 
            animate={{
              scale: [1, 1.015, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full object-contain sm:object-cover transition-transform duration-700"
            referrerPolicy="no-referrer"
          />

          {/* Premium Animated Shimmer Shine Overlay */}
          <motion.div
            initial={{ left: '-150%' }}
            animate={{ left: '150%' }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "linear"
            }}
            className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"
          />

          {/* Subtle Border pulse glow */}
          <div className="absolute inset-0 border border-red-500/0 group-hover:border-red-500/20 rounded-lg pointer-events-none transition-colors duration-500" />

          {/* Sponsored Badge */}
          <div className="absolute top-1 right-1 bg-black/75 backdrop-blur-sm text-[8px] font-black text-white/90 px-1.5 py-0.5 rounded uppercase tracking-widest pointer-events-none border border-white/10 z-10 shadow-sm">
            Sponsored Ad
          </div>
        </motion.div>
      </div>
    </header>
  );
};
