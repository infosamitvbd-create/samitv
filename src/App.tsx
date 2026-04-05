import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { BreakingNews } from './components/BreakingNews';
import { HeroSection } from './components/HeroSection';
import { Sidebar } from './components/Sidebar';
import { AboutUs } from './components/AboutUs';
import { OurFamily } from './components/OurFamily';
import { Media } from './components/Media';
import { NewsCategory } from './components/NewsCategory';
import { NewsDetail } from './components/NewsDetail';
import { AdminPanel } from './components/AdminPanel';
import { Home } from './components/Home';
import { LiveTV } from './components/LiveTV';
import { ContactUs } from './components/ContactUs';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Phone, Info, ShieldAlert, ArrowLeft, Lock, Facebook, Youtube } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('/');
  const [currentCategory, setCurrentCategory] = useState('');
  const [selectedNews, setSelectedNews] = useState<any>(null);

  const handleNavigate = (page: string) => {
    if (page.startsWith('/category/')) {
      setCurrentCategory(page.replace('/category/', ''));
      setCurrentPage('/category');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsClick = (news: any) => {
    setSelectedNews(news);
    setCurrentPage('/news-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case '/': return <Home onNavigate={handleNavigate} onNewsClick={handleNewsClick} />;
      case '/about': return <AboutUs key="about" />;
      case '/family': return <OurFamily key="family" />;
      case '/media': return <Media key="media" />;
      case '/live': return <LiveTV key="live" />;
      case '/contact': return <ContactUs key="contact" />;
      case '/admin': return <AdminPanel />;
      case '/news-detail': return <NewsDetail news={selectedNews} onBack={() => handleNavigate('/')} onNewsClick={handleNewsClick} />;
      case '/category': return <NewsCategory key={currentCategory} category={currentCategory} onBack={() => handleNavigate('/')} onNewsClick={handleNewsClick} />;
      default: return (
        <motion.div 
          key="placeholder"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="bg-white p-12 rounded-sm news-card-shadow text-center"
        >
          <Info size={48} className="mx-auto text-sami-blue mb-4" />
          <h2 className="text-2xl font-bold mb-2">{currentPage.replace('/', '').toUpperCase()} Page</h2>
          <p className="text-gray-500">This section is coming soon...</p>
          <button onClick={() => handleNavigate('/')} className="mt-6 bg-sami-blue text-white px-6 py-2 rounded-md">Back to Home</button>
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-sami-blue selection:text-white">
      <div className="print:hidden">
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        <Navbar 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
          currentCategory={currentCategory} 
        />
      </div>
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + currentCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-auto print:hidden">
        <BreakingNews />
        
        {/* App Download Section (Footer) */}
        <div className="bg-sami-light py-6 border-t border-sami-blue/20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl">
            <div className="flex items-center gap-4">
              <div className="bg-sami-blue p-3 rounded-xl text-white shadow-lg shadow-sami-blue/20">
                <Download size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-sami-dark">সামি টিভি অ্যাপ ডাউনলোড করুন</h3>
                <p className="text-xs text-gray-600">লাইভ টিভি এবং লেটেস্ট নিউজ পেতে আজই ডাউনলোড করুন</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-all hover:scale-105 shadow-md">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-6" />
                <div className="text-left">
                  <p className="text-[8px] uppercase font-bold opacity-70">Get it on</p>
                  <p className="text-sm font-bold">Google Play</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-sami-dark text-white py-12">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-1">
              <div className="bg-white p-2 rounded inline-block mb-4">
                <img 
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEherA1uXsmj4szGD1Fd-xiaMEiSWfMScY0dtSUBJ0EtbJJgGJ3g685mlKguqkyD1hlqBdecqT_3VT2evjJ-pAoUHTUAxEb9xndqYCFbXxq9YR89dIfzFBHogTf8CyryGgvbOYvnhFsgu5ugqCm9ngBLAv6EqTSBoY8siT7Di4N_mpZG0LRYCiGpheph7_jc/s320/mmmm.png" 
                  alt="Sami TV" 
                  className="h-16"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                দেশ-বিদেশের সংবাদ নির্ভুল ও বস্তুনিষ্ঠভাবে প্রকাশ করে সামী টিভি। সাংবাদিকতার নীতি মেনে সংবাদ সংগ্রহ ও প্রচারে বিশ্বাসী আমরা। এতে কোনো দল, গোষ্ঠী বা মতবাদের প্রতি পক্ষপাত করা হয় না। থাকে, বাংলায় কথা বলে । খবরের ভেতরের খবর ও বিশ্লেষণে সর্বোচ্চ উৎকর্ষতা বজায় রাখার চেষ্টা করে সামী টিভি ।
              </p>
              <div className="mt-6 flex gap-3">
                <a href="https://www.facebook.com/samitvbd/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-sami-blue transition-all">
                  <Facebook size={16} />
                </a>
                <a href="https://www.youtube.com/@stv2026Banglades" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-600 transition-all">
                  <Youtube size={16} />
                </a>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Phone size={16} className="text-sami-blue" />
                  <span>01912618994 / 01939080605</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <ShieldAlert size={16} className="text-red-500" />
                  <span>HOTLINE: (Coming Soon)</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 border-l-4 border-sami-blue pl-2">দ্রুত লিঙ্ক</h3>
              <ul className="text-sm text-gray-400 space-y-3">
                <li><button onClick={() => handleNavigate('/live')} className="hover:text-white transition-colors">লাইভ টিভি</button></li>
                <li><button onClick={() => handleNavigate('/terms')} className="hover:text-white transition-colors">শর্ত ও নিয়মাবলী</button></li>
                <li><button onClick={() => handleNavigate('/privacy')} className="hover:text-white transition-colors">গোপনীয়তা নীতি</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 border-l-4 border-sami-blue pl-2">বিভাগসমূহ</h3>
              <ul className="text-sm font-bold text-gray-400 grid grid-cols-2 gap-3">
                <li><button onClick={() => handleNavigate('/category/জাতীয়')} className="hover:text-white transition-colors">জাতীয়</button></li>
                <li><button onClick={() => handleNavigate('/category/রাজনীতি')} className="hover:text-white transition-colors">রাজনীতি</button></li>
                <li><button onClick={() => handleNavigate('/category/সারাদেশ')} className="hover:text-white transition-colors">সারাদেশ</button></li>
                <li><button onClick={() => handleNavigate('/category/খেলাধুলা')} className="hover:text-white transition-colors">খেলাধুলা</button></li>
                <li><button onClick={() => handleNavigate('/family')} className="hover:text-white transition-colors">আওয়ার ফ্যামিলি</button></li>
                <li><button onClick={() => handleNavigate('/media')} className="hover:text-white transition-colors">মিডিয়া</button></li>
                <li><button onClick={() => handleNavigate('/about')} className="hover:text-white transition-colors">আমাদের সম্পর্কে</button></li>
                <li><button onClick={() => handleNavigate('/contact')} className="hover:text-white transition-colors text-sami-blue">যোগাযোগ</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 border-l-4 border-sami-blue pl-2">সতর্কবার্তা</h3>
              <p className="text-xs text-red-400 leading-relaxed italic">
                "এই ওয়েবসাইটে কোন লেখা ছবি ভিডিও অনুমতি ছাড়া ব্যবহার করা বেআইনি।"
              </p>
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Developed By</p>
                <p className="text-sm font-bold text-white">Emran Hasan Sami</p>
                <p className="text-[10px] text-sami-blue">Website Developer</p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400 mb-2">সামী মাল্টিমিডিয়া লিমিটেডের একটি প্রতিষ্ঠান</p>
            <p className="text-xs text-gray-500">
              Website Developer by Emran Hasan Sami | &copy; {new Date().getFullYear()} SAMI TV. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Admin Floating Button */}
      <button 
        onClick={() => handleNavigate('/admin')}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-black transition-all z-40 group print:hidden"
        title="Admin Panel"
      >
        <Lock size={20} />
        <span className="absolute right-full mr-3 bg-black text-white px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">অ্যাডমিন প্যানেল</span>
      </button>
    </div>
  );
}
