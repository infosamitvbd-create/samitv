import React from 'react';
import { Facebook, Youtube, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Layout, Tv, Smartphone } from 'lucide-react';
import { SAMILogo } from './SAMILogo';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-white pt-12 pb-6 mt-auto border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-center md:text-left">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="bg-white p-3 rounded-xl inline-block shadow-2xl shadow-black/20">
              <SAMILogo className="items-start" />
            </div>
            <p className="text-gray-400 text-[14px] leading-relaxed font-medium">
              দেশ-বিদেশের সর্বশেষ সংবাদ নির্ভুল ও বস্তুনিষ্ঠভাবে প্রকাশ করে সামী টিভি। সাংবাদিকতার মূলনীতি মেনে সত্যের সন্ধানে আমরা সদা তৎপর।
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {[
                { icon: Facebook, color: 'bg-white/5 hover:bg-[#1877F2]', href: 'https://www.facebook.com/samitvbd' },
                { icon: Youtube, color: 'bg-white/5 hover:bg-[#FF0000]', href: 'https://www.youtube.com/@stv2026Banglades' },
                { icon: Twitter, color: 'bg-white/5 hover:bg-[#1DA1F2]', href: '#' },
                { icon: Instagram, color: 'bg-white/5 hover:bg-[#E4405F]', href: '#' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 ${social.color}`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-5 flex items-center gap-3 justify-center md:justify-start">
              <span className="w-1.5 h-5 bg-sami-red rounded-full"></span>
              গুরুত্বপূর্ণ লিঙ্ক
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'সরাসরি সম্প্রচার (LIVE)', path: '/live' },
                { label: 'ডাউনলিংক প্যারামিটার', path: '/downlink' },
                { label: 'শর্তাবলী ও নীতিমালা', path: '/terms' },
                { label: 'গোপনীয়তা নীতি', path: '/privacy' }
              ].map((link) => (
                <li key={link.path}>
                  <button 
                    onClick={() => onNavigate(link.path)}
                    className="text-gray-400 hover:text-sami-red transition-all text-[14px] font-medium hover:translate-x-1 block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-5 flex items-center gap-3 justify-center md:justify-start">
              <span className="w-1.5 h-5 bg-sami-red rounded-full"></span>
              বিভাগসমূহ
            </h3>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-2">
              {['জাতীয়', 'রাজনীতি', 'আন্তর্জাতিক', 'জামালপুর', 'সরিষাবাড়ী', 'সারাদেশ', 'খেলাধুলা', 'বিনোদন'].map((cat) => (
                <li key={cat}>
                  <button 
                    onClick={() => onNavigate(`/category/${cat}`)}
                    className="text-gray-400 hover:text-sami-red transition-all text-[14px] font-medium hover:translate-x-1"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-3 justify-center md:justify-start">
              <span className="w-1.5 h-5 bg-sami-red rounded-full"></span>
              যোগাযোগ
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start justify-center md:justify-start gap-4 text-gray-400 text-[14px]">
                <div className="bg-white/5 p-2 rounded-lg shrink-0">
                  <MapPin size={18} className="text-sami-red" />
                </div>
                <span className="pt-1">দিগপাইত, জামালপুর, বাংলাদেশ</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-4 text-gray-400 text-[14px]">
                <div className="bg-white/5 p-2 rounded-lg shrink-0">
                  <Phone size={18} className="text-sami-red" />
                </div>
                <span className="font-eng pt-1">01912618994</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-4 text-gray-400 text-[14px]">
                <div className="bg-white/5 p-2 rounded-lg shrink-0">
                  <Mail size={18} className="text-sami-red" />
                </div>
                <span className="font-eng pt-1">info.samitv.bd@gmail.com</span>
              </li>
            </ul>

            <div className="pt-2 space-y-3">
               <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Official Apps</h4>
               <div className="grid grid-cols-1 gap-2">
                 <button 
                   onClick={() => onNavigate('/download-app')}
                   className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-2 rounded-xl transition-all group"
                 >
                   <div className="bg-sami-red p-2 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-red-900/20">
                     <Layout size={16} className="text-white" />
                   </div>
                   <div className="text-left">
                     <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-1">Get it on</p>
                     <p className="text-[12px] font-black text-white">Android App</p>
                   </div>
                 </button>

                 <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-3 py-2 rounded-xl opacity-40 cursor-not-allowed">
                   <div className="bg-gray-700 p-2 rounded-lg">
                     <Smartphone size={16} className="text-white" />
                   </div>
                   <div className="text-left">
                     <p className="text-[9px] text-gray-600 font-bold uppercase tracking-wider leading-none mb-1">Coming Soon</p>
                     <p className="text-[12px] font-black text-gray-400">iOS App Store</p>
                   </div>
                 </div>
                 
                 <button 
                   onClick={() => onNavigate('/android-tv')}
                   className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-2 rounded-xl transition-all group"
                 >
                   <div className="bg-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/20">
                     <Tv size={16} className="text-white" />
                   </div>
                   <div className="text-left">
                     <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-1">Download for</p>
                     <p className="text-[12px] font-black text-white">Android TV App</p>
                   </div>
                 </button>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] text-gray-500 font-medium">
          <p className="text-center md:text-left">© {currentYear} সামি টেলিভিশন। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex flex-wrap justify-center items-center gap-4 font-eng">
            <p>DEVELOPED BY <span className="text-gray-300 font-bold">Emran Hasan Sami</span></p>
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <button 
                onClick={() => onNavigate('/admin')}
                className="text-gray-600 hover:text-white transition-colors flex items-center gap-1.5"
                title="Admin Access"
              >
                 অ্যাডমিন প্যানেল 🔒
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
