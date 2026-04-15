import React from 'react';
import { Facebook, Youtube, Twitter, Instagram, Linkedin, MapPin, Calendar, Search } from 'lucide-react';
import { SAMILogo } from './SAMILogo';

export const Header: React.FC<{ 
  onNavigate: (page: string) => void;
  currentPage: string;
}> = ({ onNavigate, currentPage }) => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const dateString = today.toLocaleDateString('bn-BD', options);

  return (
    <header className="bg-white border-b border-gray-100 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 max-w-7xl">
        {/* Logo Section */}
        <div className="flex-shrink-0 cursor-pointer transform hover:scale-105 transition-transform duration-300" onClick={() => onNavigate('/')}>
          <SAMILogo className="scale-90 sm:scale-100 origin-center lg:origin-left" />
        </div>
        
        {/* Info & Search Section */}
        <div className="flex flex-col items-center lg:items-end gap-4 w-full lg:w-auto">
          <div className="flex flex-wrap justify-center items-center gap-6 text-[13px] font-bold text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-sami-red" />
              <span>দিগপাইত, জামালপুর</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-sami-red" />
              <span>{dateString}</span>
            </div>
          </div>
          
          {/* Professional Search Bar */}
          <div className="relative w-full max-w-sm group">
            <input 
              type="text" 
              placeholder="সংবাদ খুঁজুন..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-sami-red/20 focus:border-sami-red transition-all"
            />
            <button className="absolute right-1 top-1 bottom-1 px-4 bg-sami-red text-white rounded-full hover:bg-red-700 transition-colors shadow-sm">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Social Icons Section */}
        <div className="flex items-center gap-2">
          {[
            { icon: Facebook, color: 'bg-[#1877F2]', href: 'https://www.facebook.com/samitvbd/' },
            { icon: Youtube, color: 'bg-[#FF0000]', href: 'https://www.youtube.com/@stv2026Banglades' },
            { icon: Twitter, color: 'bg-[#1DA1F2]', href: '#' },
            { icon: Instagram, color: 'bg-[#E4405F]', href: '#' },
            { icon: Linkedin, color: 'bg-[#0A66C2]', href: '#' }
          ].map((social, i) => (
            <a 
              key={i}
              href={social.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`w-10 h-10 flex items-center justify-center rounded-xl ${social.color} text-white hover:scale-110 transition-all shadow-md`}
            >
              <social.icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};
