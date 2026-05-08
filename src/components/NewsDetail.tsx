import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, User, Share2, Tag, Printer, MapPin, Facebook, Twitter, MessageCircle, Copy, Check, ChevronRight, Download, Bookmark, Eye, ThumbsUp, ArrowUp, Home as HomeIcon, Layout, Calendar, Heart, BookmarkPlus } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(!initialNews);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'latest' | 'popular'>('latest');
  const [isLiked, setIsLiked] = useState(false);
  
  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };
  
  const readingTime = news ? calculateReadingTime(news.content) : 0;
  
  const newsRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [fontSize, setFontSize] = useState(22);

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
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setLatestNews(allNews.filter(item => item.id !== news?.id).slice(0, 6));
      setRelatedNews(allNews.filter(item => item.id !== news?.id && item.category === news?.category).slice(0, 4));
    });
    return () => unsubscribe();
  }, [news?.id, news?.category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-100 border-t-sami-red rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-40 bg-white rounded-sm border border-gray-100 max-w-2xl mx-auto shadow-sm">
        <MapPin size={48} className="mx-auto text-gray-300 mb-6" />
        <h2 className="text-3xl font-black text-gray-900 mb-4">সংবাদটি খুঁজে পাওয়া যায়নি</h2>
        <p className="text-gray-500 mb-8 px-6">দয়া করে নিশ্চিত করুন যে ইউআরএলটি সঠিক অথবা সংবাদটি ইতিমধ্যে মুছে ফেলা হতে পারে।</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-sami-red text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:bg-sami-dark transition-all shadow-xl active:scale-95"
        >
          হোমে ফিরে যান
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-red-600 z-[70] origin-left"
        style={{ scaleX }}
      />

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-10 right-10 w-12 h-12 bg-gray-900 text-white rounded-full shadow-2xl z-50 flex items-center justify-center hover:bg-red-600 transition-all active:scale-95 group"
          >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-10">
        {/* Main Content Area */}
        <div className="col-span-1 lg:col-span-8">
          <motion.article 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="print:hidden"
          >
            {/* News Header Section */}
            <header className="mb-10">
               <h1 className="text-3xl sm:text-5xl font-black leading-[1.2] text-gray-900 mb-8 tracking-tight antialiased">
                 {news.title}
               </h1>

               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-8">
                  <div className="space-y-3">
                     <div className="w-10 h-1.5 bg-gray-200"></div>
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="text-xl font-black text-gray-900">প্রতিনিধি</span>
                           <span className="text-gray-400 font-bold text-sm">{news.journalistName || 'নয়াদিল্লি'}</span>
                        </div>
                        <div className="text-gray-500 text-sm font-bold">
                           প্রকাশ: {news.createdAt?.toDate ? news.createdAt.toDate().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : '০৮ মে ২০২৬'}, {news.createdAt?.toDate ? news.createdAt.toDate().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) : '১৭: ৫৬'}
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                     {/* Social Circular Icons */}
                     <button className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm">
                        <Facebook size={18} fill="currentColor" />
                     </button>
                     <button className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm">
                        <Twitter size={14} fill="currentColor" />
                     </button>
                     <button className="w-9 h-9 rounded-full bg-[#EA4335] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm">
                        <Share2 size={16} />
                     </button>
                     
                     {/* Font Controls */}
                     <div className="flex gap-1.5">
                        <button 
                          onClick={() => setFontSize(prev => Math.min(prev + 2, 32))}
                          className="w-9 h-9 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-black text-[11px] hover:opacity-90 transition-opacity shadow-sm"
                        >
                           অ+
                        </button>
                        <button 
                          onClick={() => setFontSize(prev => Math.max(prev - 2, 16))}
                          className="w-9 h-9 rounded-full bg-[#3B82F6] text-white flex items-center justify-center font-black text-[11px] hover:opacity-90 transition-opacity shadow-sm"
                        >
                           অ-
                        </button>
                     </div>

                     {/* Utility Icons */}
                     <button 
                       onClick={handlePrint}
                       className="w-9 h-9 rounded-full bg-[#5F6368] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                     >
                        <Printer size={18} />
                     </button>
                     <button 
                       onClick={() => setIsLiked(!isLiked)}
                       className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${isLiked ? 'bg-red-600 text-white' : 'bg-[#D1D5DB] text-gray-600'}`}
                     >
                        <Bookmark size={18} className={isLiked ? 'fill-white' : ''} />
                     </button>
                  </div>
               </div>
            </header>

            {/* Featured Image */}
            <figure className="mb-14">
               <div className="rounded-sm overflow-hidden bg-gray-100 shadow-sm ring-1 ring-black/5">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
               </div>
               <figcaption className="mt-4 px-1 text-[11px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <div className="w-6 h-px bg-gray-300"></div>
                  ছবি: সংগৃহীত / সামী টিভি
               </figcaption>
            </figure>

            {/* News Body Text */}
            <div 
              className="news-body-content editorial-content leading-[1.85] text-gray-800 mb-20 whitespace-pre-wrap selection:bg-red-600 selection:text-white"
              style={{ fontSize: `${fontSize}px` }}
            >
               {news.content}
            </div>

            {/* Categories/Tags */}
            <div className="flex flex-wrap gap-2 mb-20 pt-12 border-t border-gray-100">
               {['সামী টিভি', news.category, 'ব্রেকিং নিউজ', 'বাংলাদেশ'].map(tag => (
                 <span key={tag} className="px-5 py-2 bg-gray-50 text-gray-500 rounded-full text-xs font-black hover:bg-red-600 hover:text-white transition-all cursor-pointer border border-gray-100 shadow-sm">
                   #{tag}
                 </span>
               ))}
            </div>

            {/* Related News Selection */}
            {relatedNews.length > 0 && (
              <div className="pt-20 border-t-2 border-gray-900">
                <h3 className="text-3xl font-black text-gray-900 mb-12 flex items-center gap-5">
                  <span className="w-2 h-10 bg-red-600"></span>
                  আরও খবর
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  {relatedNews.slice(0, 4).map(item => (
                    <div 
                      key={item.id} 
                      className="flex gap-5 group cursor-pointer" 
                      onClick={() => {
                        onNewsClick?.(item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="w-28 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-xl group-hover:shadow-red-100 transition-all">
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex flex-col justify-center gap-1.5">
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{item.category}</span>
                        <h4 className="text-sm font-black text-gray-900 line-clamp-2 leading-snug group-hover:text-red-700 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.article>
        </div>

        {/* Sidebar */}
        <aside className="col-span-1 lg:col-span-4 space-y-12">
          {/* Latest/Popular News Tab */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden sticky top-24">
            <div className="flex p-2 bg-gray-50 border-b border-gray-100">
              <button 
                onClick={() => setActiveSidebarTab('latest')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${activeSidebarTab === 'latest' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
              >
                সর্বশেষ
              </button>
              <button 
                onClick={() => setActiveSidebarTab('popular')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${activeSidebarTab === 'popular' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
              >
                জনপ্রিয়
              </button>
            </div>
            <div className="p-5 space-y-6 max-h-[600px] overflow-y-auto">
              {(activeSidebarTab === 'latest' ? latestNews : latestNews.slice().reverse()).map((item, idx) => (
                <div 
                  key={item.id} 
                  className="flex gap-4 group cursor-pointer"
                  onClick={() => {
                    onNewsClick?.(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="relative shrink-0">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    </div>
                    <span className="absolute -top-2 -left-2 w-6 h-6 bg-red-600 text-white rounded-lg flex items-center justify-center text-[10px] font-black shadow-md border-2 border-white">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[13px] font-black text-gray-900 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[9px] font-bold text-gray-400 uppercase mt-1 block">২ ঘণ্টা আগে</span>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-gray-100 hover:text-red-600 transition-all border-t border-gray-100"
            >
              সব খবর দেখুন
            </button>
          </div>
        </aside>
      </div>

      {/* Professional Print Template (Hidden in UI) */}
      <div className="fixed left-[-9999px] top-0 print:static print:left-0 print:w-full">
        <div ref={printRef} className="w-[800px] mx-auto bg-white p-12 font-sans text-black">
          <div className="text-center border-b-2 border-black pb-8 mb-8">
            <h1 className="text-5xl font-black text-red-700 mb-2">সামী টিভি</h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">সত্যের সন্ধানে নির্ভীক</p>
          </div>
          <h2 className="text-3xl font-bold mb-6 leading-tight">{news.title}</h2>
          <div className="flex gap-4 text-sm font-bold text-gray-600 mb-8 pb-4 border-b">
            <span>প্রতিনিধি: {news.journalistName || 'নিউজ ডেস্ক'}</span>
            <span>|</span>
            <span>{new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <img src={news.imageUrl} className="w-full h-auto mb-8 rounded-sm" alt="" referrerPolicy="no-referrer" />
          <div className="text-lg leading-relaxed whitespace-pre-wrap">{news.content}</div>
          <div className="mt-20 pt-10 border-t text-center text-gray-400 text-xs">
            © ২০২৬ সামী টিভি | জামালপুর, বাংলাদেশ | samitv.com
          </div>
        </div>
      </div>
    </div>
  );
};
