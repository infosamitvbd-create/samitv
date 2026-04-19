import React from 'react';
import { Facebook, Youtube, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { SAMILogo } from './SAMILogo';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sami-dark text-white pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-center md:text-left">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl inline-block">
              <SAMILogo className="items-start" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              দেশ-বিদেশের সংবাদ নির্ভুল ও বস্তুনিষ্ঠভাবে প্রকাশ করে সামী টিভি। সাংবাদিকতার নীতি মেনে সংবাদ সংগ্রহ ও প্রচারে বিশ্বাসী আমরা।
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, color: 'hover:text-[#1877F2]', href: 'https://www.facebook.com/samitvbd' },
                { icon: Youtube, color: 'hover:text-[#FF0000]', href: 'https://www.youtube.com/@stv2026Banglades' },
                { icon: Twitter, color: 'hover:text-[#1DA1F2]', href: '#' },
                { icon: Instagram, color: 'hover:text-[#E4405F]', href: '#' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-gray-400 transition-colors ${social.color}`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-l-4 border-sami-red pl-3">গুরুত্বপূর্ণ লিঙ্ক</h3>
            <ul className="space-y-3">
              {[
                { label: 'লাইভ টিভি', path: '/live' },
                { label: 'ডাউনলিংক প্যারামিটার', path: '/downlink' },
                { label: 'শর্তাবলী', path: '/terms' },
                { label: 'গোপনীয়তা নীতি', path: '/privacy' }
              ].map((link) => (
                <li key={link.path}>
                  <button 
                    onClick={() => onNavigate(link.path)}
                    className="text-gray-400 hover:text-sami-red transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-l-4 border-sami-red pl-3">বিভাগসমূহ</h3>
            <ul className="grid grid-cols-2 gap-3">
              {['জাতীয়', 'রাজনীতি', 'আন্তর্জাতিক', 'বিশ্ব', 'বাণিজ্য', 'সারাদেশ', 'খেলাধুলা', 'বিনোদন'].map((cat) => (
                <li key={cat}>
                  <button 
                    onClick={() => onNavigate(`/category/${cat}`)}
                    className="text-gray-400 hover:text-sami-red transition-colors text-sm"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-l-4 border-sami-red pl-3">যোগাযোগ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={18} className="text-sami-red shrink-0" />
                <span>দিগপাইত, জামালপুর, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={18} className="text-sami-red shrink-0" />
                <span className="font-eng">01912618994</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={18} className="text-sami-red shrink-0" />
                <span className="font-eng">info.samitv.bd@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium font-eng">
          <p>© {currentYear} সামি টেলিভিশন। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <p>Developed by <span className="text-gray-400">Emran Hasan Sami</span></p>
            <button 
              onClick={() => onNavigate('/admin')}
              className="text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1"
              title="Admin Access"
            >
               অ্যাডমিন : <MapPin size={10} className="hidden" /> 🔒
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
