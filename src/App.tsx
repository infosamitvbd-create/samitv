import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { SAMILogo } from './components/SAMILogo';
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
import { Footer } from './components/Footer';
import { DownlinkParameters } from './components/DownlinkParameters';
import { TermsAndConditions } from './components/TermsAndConditions';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { motion, AnimatePresence } from 'motion/react';
import { Info, ArrowLeft, Lock } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentCategory, setCurrentCategory] = useState('');
  const [selectedNews, setSelectedNews] = useState<any>(null);

  const handleNavigate = (page: string) => {
    navigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsClick = (news: any) => {
    setSelectedNews(news);
    navigate(`/news/${news.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-sami-red selection:text-white">
      <div className="print:hidden">
        <Header onNavigate={handleNavigate} currentPage={location.pathname} />
        <Navbar 
          onNavigate={handleNavigate} 
          currentPage={location.pathname} 
          currentCategory={currentCategory} 
        />
      </div>
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home onNavigate={handleNavigate} onNewsClick={handleNewsClick} />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/family" element={<OurFamily />} />
              <Route path="/media" element={<Media />} />
              <Route path="/live" element={<LiveTV />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/downlink" element={<DownlinkParameters />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/news/:newsId" element={<NewsDetail news={selectedNews} onBack={() => handleNavigate('/')} onNewsClick={handleNewsClick} />} />
              <Route path="/category/:category" element={<CategoryWrapper onNavigate={handleNavigate} onNewsClick={handleNewsClick} setCurrentCategory={setCurrentCategory} />} />
              <Route path="*" element={
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="bg-white p-12 rounded-sm news-card-shadow text-center"
                >
                  <Info size={48} className="mx-auto text-sami-red mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
                  <p className="text-gray-500">The page you are looking for does not exist.</p>
                  <button onClick={() => handleNavigate('/')} className="mt-6 bg-sami-red text-white px-6 py-2 rounded-md">Back to Home</button>
                </motion.div>
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-auto print:hidden">
        <BreakingNews />
        <Footer onNavigate={handleNavigate} />
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

function CategoryWrapper({ onNavigate, onNewsClick, setCurrentCategory }: any) {
  const { category } = useParams();
  useEffect(() => {
    if (category) setCurrentCategory(category);
  }, [category, setCurrentCategory]);
  
  return <NewsCategory key={category} category={category || ''} onBack={() => onNavigate('/')} onNewsClick={onNewsClick} />;
}
