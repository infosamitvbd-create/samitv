import React from 'react';
import { Facebook, Youtube, Twitter, Instagram, Linkedin, MapPin, Calendar, Search } from 'lucide-react';
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
            <div className="flex items-center gap-2">
              {[
                { icon: Facebook, color: 'bg-[#1877F2]', href: 'https://www.facebook.com/samitvbd/' },
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
              className="p-1 text-gray-700 hover:text-red-600 transition-colors"
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
                  className="w-full bg-white border-2 border-red-100 rounded-xl py-4 pl-6 pr-16 text-lg focus:outline-none focus:border-red-600 transition-all shadow-xl shadow-red-600/5"
                />
                <button className="absolute right-2 top-2 bottom-2 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                  <Search size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Header Row: Logo & Ad */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-between gap-8 max-w-7xl">
        {/* Logo Section */}
        <div className="flex-shrink-0 cursor-pointer transform hover:scale-105 transition-transform duration-300" onClick={() => onNavigate('/')}>
          <SAMILogo className="scale-100 origin-center lg:origin-left" />
        </div>
        
        {/* Header Ad */}
        <div className="flex-grow w-full lg:max-w-[728px] h-[90px] bg-gray-50 rounded-lg border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center group relative cursor-pointer">
           <img 
              src="https://images.weserv.nl/?url=https://www.globaltvbd.com/uploads/ads/2021_Finalsss_For_GTV-016.jpg" 
              alt="Header Ad" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
           />
           
           <div className="absolute top-1 right-2 font-bold text-white/50 uppercase tracking-widest text-[8px] z-10 pointer-events-none font-eng">
              Advertisement
           </div>
        </div>
      </div>
    </header>
  );
};
