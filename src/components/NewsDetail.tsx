import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, User, Share2, Tag, Printer, MapPin, Facebook, Twitter, MessageCircle, Copy, Check, ChevronRight, Download, Bookmark, Eye, ThumbsUp, ArrowUp, Home as HomeIcon, Layout } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where, doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

interface NewsDetailProps {
  news: any;
  onBack: () => void;
  onNewsClick?: (news: any) => void;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ news: initialNews, onBack, onNewsClick }) => {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState<any>(initialNews);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [sidebarAds, setSidebarAds] = useState<any[]>([]);
  const [contentAds, setContentAds] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(!initialNews);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'latest' | 'popular'>('latest');
  const newsRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!initialNews && newsId) {
      setLoading(true);
      const fetchNews = async () => {
        try {
          const docRef = doc(db, 'news', newsId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setNews({ id: docSnap.id, ...docSnap.data() });
          }
        } catch (error) {
          console.error("Error fetching news:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchNews();
    } else {
      setNews(initialNews);
      setLoading(false);
    }
  }, [newsId, initialNews]);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setLatestNews(allNews.filter(item => item.id !== news?.id).slice(0, 5));
      setRelatedNews(allNews.filter(item => item.id !== news?.id && item.category === news?.category).slice(0, 3));
    });
    return () => unsubscribe();
  }, [news?.id, news?.category]);

  useEffect(() => {
    const qSidebar = query(collection(db, 'ads'), where('position', '==', 'sidebar'), where('active', '==', true), limit(2));
    const unsubscribeSidebar = onSnapshot(qSidebar, (snapshot) => {
      setSidebarAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qContent = query(collection(db, 'ads'), where('position', '==', 'content'), where('active', '==', true), limit(1));
    const unsubscribeContent = onSnapshot(qContent, (snapshot) => {
      setContentAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeSidebar();
      unsubscribeContent();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sami-blue"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">সংবাদটি খুঁজে পাওয়া যায়নি</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-sami-blue font-bold">হোমে ফিরে যান</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        useCORS: true,
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `${news.title || 'news'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Download Error: ", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return time;
  };

  const shareUrl = window.location.href;
  const shareTitle = news.title;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-red-600 z-[70] origin-left"
        style={{ scaleX }}
      />

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-white text-gray-900 border border-gray-200 rounded-full shadow-2xl z-50 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 print:hidden">
        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="lg:col-span-8 bg-white print:shadow-none print:p-0"
        >
          {/* Breadcrumb Bar */}
          <div className="flex items-center gap-0 mb-6 bg-gray-100 p-0 rounded-sm overflow-hidden print:hidden">
            <button 
              onClick={() => navigate('/')}
              className="bg-[#d9232d] text-white px-4 py-2 flex items-center gap-2 text-sm font-bold hover:bg-red-700 transition-colors"
            >
              <HomeIcon size={16} />
              Home
            </button>
            <div className="bg-[#777] text-white px-4 py-2 flex items-center gap-2 text-sm font-bold">
              <Layout size={16} />
              {news.category}
            </div>
          </div>

          <div ref={newsRef} className="bg-white">
            <div className="p-0">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#004a7c] leading-tight mb-6 tracking-tight">
                {news.title}
              </h1>

              {/* Meta Info Section */}
              <div className="flex items-start gap-4 py-4 border-y border-gray-100 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  <img 
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQ5UOEGSzZlZ-agaH9fVQiJVMVyMhv6aNEabwKq4kQwFEktnew6PgR7tfNMT-jOAwmfv6-JyQIvtx728t9h2OOIA8VirN8O6MBAB8ikV7jF5FYHU40mz1vEuHlgjVR863rTTc34-sHqGb3KAsGeWEVHEYVOfFsrAs7T-vQW6YmrqoFv0wV6CtnJx-buiSE/s1600/NEW%20LOGO.png" 
                    alt="Reporter"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-gray-700">{news.journalistName || 'Reporter Name'}</p>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 font-medium">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-gray-400" />
                      <span>আপডেট টাইম : {news.createdAt?.toDate ? news.createdAt.toDate().toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'সোমবার, ১৬ মার্চ, ২০২৬'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={12} className="text-gray-400" />
                      <span>৭৫ বার পঠিত</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative mb-8">
                <div className="w-full rounded-sm overflow-hidden shadow-sm">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Print Button */}
              <div className="mb-6 print:hidden">
                <button 
                  onClick={handlePrint}
                  className="bg-[#3c9c84] text-white px-4 py-1.5 rounded-sm flex items-center gap-2 text-sm font-bold hover:bg-[#2d7a68] transition-colors shadow-sm"
                >
                  <Printer size={16} />
                  প্রিন্ট নিউজ
                </button>
              </div>

              {/* Content Body */}
              <div className="prose prose-lg max-w-none text-gray-800 leading-[1.8] whitespace-pre-wrap font-sans text-lg mb-12">
                {news.content}
              </div>

              {/* Content Ad */}
              {contentAds.length > 0 && (
                <div className="my-16 p-4 bg-gray-50 rounded-sm border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4 text-center">বিজ্ঞাপন</p>
                  <a 
                    href={contentAds[0].link || '#'} 
                    target={contentAds[0].link ? "_blank" : "_self"} 
                    rel="noopener noreferrer"
                    className="block rounded-sm overflow-hidden shadow-xl hover:scale-[1.01] transition-transform"
                  >
                    <img 
                      src={contentAds[0].imageUrl} 
                      alt={contentAds[0].title} 
                      className="w-full h-auto" 
                      referrerPolicy="no-referrer" 
                    />
                  </a>
                </div>
              )}

              {/* Tags */}
              <div className="pt-10 border-t border-gray-50 flex flex-wrap gap-3 print:hidden">
                <div className="flex items-center gap-2 text-gray-400 text-sm mr-2">
                  <Tag size={18} />
                  <span className="font-black uppercase tracking-widest">ট্যাগ:</span>
                </div>
                {['সামি টিভি', news.category, 'ব্রেকিং নিউজ', 'জামালপুর সংবাদ'].map(tag => (
                  <span key={tag} className="bg-gray-50 text-gray-600 px-5 py-2 rounded-full text-xs font-bold hover:bg-sami-blue hover:text-white transition-all cursor-pointer border border-gray-100">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related News Section */}
          {relatedNews.length > 0 && (
            <div className="bg-gray-50 p-8 sm:p-10 border-t border-gray-100 print:hidden">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                সম্পর্কিত সংবাদ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-sm news-card-shadow overflow-hidden group cursor-pointer"
                    onClick={() => onNewsClick?.(item)}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-sami-blue transition-colors">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8 print:hidden">
          {/* Tabbed News Sidebar */}
          <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
            <div className="flex bg-gray-100">
              <button 
                onClick={() => setActiveSidebarTab('latest')}
                className={`flex-1 py-3 text-sm font-bold transition-all ${activeSidebarTab === 'latest' ? 'bg-white text-gray-900 border-t-2 border-sami-red' : 'text-gray-500 hover:text-gray-700'}`}
              >
                সর্বশেষ সংবাদ
              </button>
              <button 
                onClick={() => setActiveSidebarTab('popular')}
                className={`flex-1 py-3 text-sm font-bold transition-all ${activeSidebarTab === 'popular' ? 'bg-white text-gray-900 border-t-2 border-sami-red' : 'text-gray-500 hover:text-gray-700'}`}
              >
                জনপ্রিয় সংবাদ
              </button>
            </div>
            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {latestNews.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-3 group cursor-pointer pb-4 border-b border-gray-50 last:border-0"
                  onClick={() => onNewsClick?.(item)}
                >
                  <div className="w-20 h-14 shrink-0 rounded-sm overflow-hidden bg-gray-100">
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-sami-red transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advertisements Sidebar */}
          {sidebarAds.length > 0 ? (
            sidebarAds.map((ad) => (
              <a 
                key={ad.id} 
                href={ad.link || '#'} 
                target={ad.link ? "_blank" : "_self"} 
                rel="noopener noreferrer"
                className="block bg-white rounded-sm news-card-shadow overflow-hidden group"
              >
                <div className="relative">
                  <img 
                    src={ad.imageUrl} 
                    alt={ad.title} 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest backdrop-blur-sm">বিজ্ঞাপন</div>
                </div>
              </a>
            ))
          ) : (
            <div className="bg-gray-50 rounded-sm p-8 text-center border-2 border-dashed border-gray-200">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-4">বিজ্ঞাপন</p>
              <div className="aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-3">
                <ThumbsUp size={32} className="opacity-20" />
                <span className="text-xs font-bold">এখানে বিজ্ঞাপন দিন</span>
              </div>
            </div>
          )}
        </aside>
      </div>
      {/* Professional Print/Download Template (Hidden in UI, visible in Print/Download) */}
      <div className="fixed left-[-9999px] top-0 print:static print:left-0">
        <div 
          ref={printRef} 
          className="w-[800px] bg-white p-8 border border-gray-300 font-sans text-gray-900"
          style={{ minHeight: '1000px' }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQ5UOEGSzZlZ-agaH9fVQiJVMVyMhv6aNEabwKq4kQwFEktnew6PgR7tfNMT-jOAwmfv6-JyQIvtx728t9h2OOIA8VirN8O6MBAB8ikV7jF5FYHU40mz1vEuHlgjVR863rTTc34-sHqGb3KAsGeWEVHEYVOfFsrAs7T-vQW6YmrqoFv0wV6CtnJx-buiSE/s1600/NEW%20LOGO.png" 
              alt="Sami TV Logo" 
              className="h-24 w-auto"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Date Bar */}
          <div className="bg-[#1a4731] text-white py-2 px-4 text-center text-sm font-bold mb-6">
            প্রিন্ট এর তারিখ: {new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })} || 
            প্রকাশের তারিখ: {news.createdAt?.toDate ? news.createdAt.toDate().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' }) : '১৬ মার্চ, ২০২৬'}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-[#004a7c] leading-tight mb-8 border-b-2 border-gray-100 pb-4">
            {news.title}
          </h1>

          {/* Content with Image Wrapping */}
          <div className="clearfix">
            <div className="float-left w-[45%] mr-6 mb-4">
              <img 
                src={news.imageUrl} 
                alt={news.title} 
                className="w-full h-auto rounded-sm shadow-sm border border-gray-200"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-lg leading-[1.8] text-justify whitespace-pre-wrap">
              {news.content}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm font-bold text-gray-700">
              Copyright © {new Date().getFullYear()} Sami TV. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
