import React from 'react';
import { Facebook, Youtube, Twitter, Instagram, Linkedin, MapPin, Calendar } from 'lucide-react';
import { SAMILogo } from './SAMILogo';

export const Header: React.FC<{ 
  onNavigate: (page: string) => void;
  currentPage: string;
}> = ({ onNavigate, currentPage }) => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const dateString = today.toLocaleDateString('bn-BD', options);

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 max-w-7xl">
        {/* Logo Section */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('/')}>
          <SAMILogo className="scale-75 sm:scale-90 lg:scale-100 origin-center lg:origin-left" />
        </div>
        
        {/* Info & Quick Links Section */}
        <div className="flex flex-col items-center gap-3 w-full lg:w-auto">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-sami-red" />
              <span>দিগপাইত, জামালপুর</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} className="text-sami-red" />
              <span>{dateString}</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            <button 
              onClick={() => onNavigate('/live')} 
              className={`text-[9px] sm:text-[10px] px-2 py-1 rounded transition-all shadow-sm font-bold ${
                currentPage === '/live' ? 'bg-sami-teal text-white' : 'bg-sami-red text-white hover:bg-red-700'
              }`}
            >
              লাইভ টিভি
            </button>
            <button 
              onClick={() => onNavigate('/downlink')} 
              className={`text-[9px] sm:text-[10px] px-2 py-1 rounded transition-all shadow-sm font-bold ${
                currentPage === '/downlink' ? 'bg-sami-teal text-white' : 'bg-sami-red text-white hover:bg-red-700'
              }`}
            >
              ডাউনলিংক প্যারামিটার
            </button>
            <button 
              onClick={() => onNavigate('/terms')} 
              className={`text-[9px] sm:text-[10px] px-2 py-1 rounded transition-all border font-bold ${
                currentPage === '/terms' ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
              }`}
            >
              শর্তাবলী
            </button>
            <button 
              onClick={() => onNavigate('/privacy')} 
              className={`text-[9px] sm:text-[10px] px-2 py-1 rounded transition-all border font-bold ${
                currentPage === '/privacy' ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
              }`}
            >
              গোপনীয়তা
            </button>
          </div>
        </div>

        {/* Social Icons Section */}
        <div className="flex items-center gap-3">
          <a href="https://www.facebook.com/samitvbd/" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-[#3b5998] text-white hover:opacity-80 transition-opacity shadow-sm">
            <Facebook size={14} />
          </a>
          <a href="https://www.youtube.com/@stv2026Banglades" target="_blank" rel="noopener noreferrer" className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-[#ff0000] text-white hover:opacity-80 transition-opacity shadow-sm">
            <Youtube size={14} />
          </a>
          <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-[#1da1f2] text-white hover:opacity-80 transition-opacity shadow-sm">
            <Twitter size={14} />
          </a>
          <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-[#e1306c] text-white hover:opacity-80 transition-opacity shadow-sm">
            <Instagram size={14} />
          </a>
          <a href="#" className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-[#0077b5] text-white hover:opacity-80 transition-opacity shadow-sm">
            <Linkedin size={14} />
          </a>
        </div>
      </div>
    </header>
  );
};
