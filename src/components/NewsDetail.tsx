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
  const [sidebarAds, setSidebarAds] = useState<any[]>([]);
  const [contentAds, setContentAds] = useState<any[]>([]);
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

  useEffect(() => {
    const qSidebar = query(collection(db, 'ads'), where('position', '==', 'sidebar'), where('active', '==', true), limit(3));
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-red-600 z-[70] origin-left shadow-[0_0_10px_rgba(220,38,38,0.5)]"
        style={{ scaleX }}
      />

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 w-14 h-14 bg-white text-sami-red border border-gray-100 rounded-full shadow-2xl z-50 flex items-center justify-center hover:bg-red-50 transition-all active:scale-90"
          >
            <ArrowUp size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-8 print:hidden">
        {/* Main Content Area */}
        <div className="col-span-1 lg:col-span-8 flex flex-col md:flex-row gap-6 relative">
          
          {/* Sticky Social Sidebar (Desktop) */}
          <div className="hidden md:flex flex-col gap-4 sticky top-24 h-fit pt-2">
             {[
               { icon: Facebook, color: 'text-[#1877F2]', hover: 'bg-blue-50' },
               { icon: Twitter, color: 'text-[#1DA1F2]', hover: 'bg-blue-50' },
               { icon: Share2, color: 'text-gray-600', hover: 'bg-gray-100', action: () => {} },
               { icon: Printer, color: 'text-gray-600', hover: 'bg-gray-100', action: handlePrint }
             ].map((item, idx) => (
                <button 
                  key={idx}
                  onClick={item.action}
                  className={`w-11 h-11 rounded-full border border-gray-100 shadow-sm flex items-center justify-center bg-white transition-all hover:scale-110 active:scale-90 group ${item.hover}`}
                >
                   <item.icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                </button>
             ))}
             <div className="h-10 w-[1px] bg-gray-100 mx-auto my-2"></div>
             <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`w-11 h-11 rounded-full border border-gray-100 shadow-sm flex items-center justify-center bg-white transition-all active:scale-90 ${isLiked ? 'bg-red-50 border-red-100' : ''}`}
             >
                <Heart size={18} className={isLiked ? 'fill-red-600 text-red-600' : 'text-gray-400'} />
             </button>
          </div>

          <motion.article 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex-1"
          >
            {/* Breadcrumb Path */}
            <nav className="flex items-center gap-3 mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
               <button onClick={() => navigate('/')} className="hover:text-red-600 transition-colors flex items-center gap-2 group">
                  <HomeIcon size={12} className="group-hover:scale-110 transition-transform" /> প্রচ্ছদ
               </button>
               <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
               <button onClick={() => navigate(`/category/${news.category}`)} className="text-red-600 hover:underline">
                  {news.category}
               </button>
               <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
               <span className="text-gray-300 truncate max-w-[150px] font-medium">বিস্তারিত</span>
            </nav>

            {/* Heading Section */}
            <div className="space-y-6 mb-10">
               <h1 className="text-[32px] sm:text-[44px] font-black leading-[1.1] text-gray-900 tracking-tightest">
                 {news.title}
               </h1>
               
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-gray-100">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-50 shrink-0">
                        <img 
                          src="https://picsum.photos/seed/reporter/100/100" 
                          alt="Reporter" 
                          className="w-full h-full object-cover"
                        />
                     </div>
                     <div>
                        <p className="text-sm font-black text-gray-900">{news.journalistName || 'স্টাফ রিপোর্টার'}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SAMI TV Official</p>
                     </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                     <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                        <Calendar size={14} className="text-red-600" />
                        <span>{news.createdAt?.toDate ? news.createdAt.toDate().toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '১৬ এপ্রিল, ২০২৬'}</span>
                     </div>
                     <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                        <Clock size={14} className="text-red-600" />
                        <span>{readingTime} মিনিট পাঠ</span>
                     </div>
                     <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                        <Eye size={14} className="text-red-600" />
                        <span>৭৫ বার পঠিত</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Featured Image */}
            <figure className="mb-12 group">
               <div className="rounded-xl overflow-hidden bg-gray-100 shadow-2xl relative">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                     Exclusive
                  </div>
               </div>
               <figcaption className="mt-4 px-4 py-3 border-l-4 border-red-600 bg-gray-50 text-xs font-bold text-gray-500 italic leading-relaxed shadow-sm">
                  ছবি: প্রতিনিধি / সামী টিভি
               </figcaption>
            </figure>

            {/* Action Bar (Mobile only or redundant desktop) */}
            <div className="flex items-center gap-4 mb-10 xl:hidden">
               <button onClick={handlePrint} className="flex-1 bg-gray-900 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest">
                  <Printer size={16} /> প্রিন্ট
               </button>
               <button className="flex-1 bg-red-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest">
                  <Share2 size={16} /> শেয়ার
               </button>
            </div>

            {/* News Body Text */}
            <div className="news-body-content text-lg sm:text-xl leading-[1.9] text-gray-800 text-justify mb-16 font-medium whitespace-pre-wrap selection:bg-red-100 selection:text-red-900 drop-cap">
               {news.content}
            </div>

            {/* Newsletter Subscription (New Professional Element) */}
            <div className="mb-16 p-8 bg-gray-900 rounded-2xl relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-red-600/20 transition-all duration-700"></div>
               <div className="relative z-10">
                  <h3 className="text-xl font-black text-white mb-2">প্রতিদিনের খবর আপনার ইনবক্সে</h3>
                  <p className="text-gray-400 text-sm mb-6">আমাদের নিউজলেটার সাবস্ক্রাইব করুন এবং জামালপুরের সব খবর সবার আগে পান।</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                     <input 
                        type="email" 
                        placeholder="আপনার ইমেইল ঠিকানা" 
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
                     />
                     <button className="bg-red-600 text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">সাবস্ক্রাইব</button>
                  </div>
               </div>
            </div>

            {/* Content Ad Placement */}
            {contentAds.length > 0 && (
              <div className="mb-16 p-px bg-gradient-to-r from-red-600/20 via-gray-200 to-red-600/20 rounded-2xl">
                 <div className="bg-white rounded-[15px] p-4">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-4 text-center">বিজ্ঞাপন</p>
                    <a href={contentAds[0].link || '#'} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl">
                       <img src={contentAds[0].imageUrl} alt="Advertisement" className="w-full h-auto hover:brightness-110 transition-all" referrerPolicy="no-referrer" />
                    </a>
                 </div>
              </div>
            )}

            {/* Article Footer & Tags */}
            <div className="pt-10 border-t border-gray-100 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                     <button className="flex items-center gap-2 px-6 py-2 bg-gray-50 text-gray-600 rounded-full text-xs font-black shadow-sm hover:bg-red-50 hover:text-red-600 transition-all">
                        <ThumbsUp size={16} /> ভালো লেগেছে
                     </button>
                     <button className="p-2.5 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-all">
                        <BookmarkPlus size={20} />
                     </button>
                  </div>
                  <div className="flex items-center gap-3">
                     <Facebook size={20} className="text-[#1877F2] cursor-pointer hover:scale-110 transition-transform" />
                     <Twitter size={20} className="text-[#1DA1F2] cursor-pointer hover:scale-110 transition-transform" />
                     <MessageCircle size={20} className="text-[#25D366] cursor-pointer hover:scale-110 transition-transform" />
                  </div>
               </div>

               <div className="flex flex-wrap gap-2">
                  <Tag size={16} className="text-red-600 mt-1" />
                  {['সামী টিভি', news.category, 'ব্রেকিং নিউজ', 'জামালপুর আপডেট'].map(t => (
                     <span key={t} className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-lg text-[11px] font-black hover:bg-red-600 hover:text-white transition-all cursor-pointer">#{t}</span>
                  ))}
               </div>
            </div>
            
          </motion.article>
        </div>

        {/* Sidebar */}
        <aside className="col-span-1 lg:col-span-4 space-y-10">
          {/* Tabbed News Widget */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden">
            <div className="flex p-2 bg-gray-50 gap-1">
              <button 
                onClick={() => setActiveSidebarTab('latest')}
                className={`flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl ${activeSidebarTab === 'latest' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
              >
                সর্বশেষ
              </button>
              <button 
                onClick={() => setActiveSidebarTab('popular')}
                className={`flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl ${activeSidebarTab === 'popular' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
              >
                জনপ্রিয়
              </button>
            </div>
            <div className="p-4 space-y-5 max-h-[650px] overflow-y-auto news-detail-sidebar-scroll">
              {latestNews.map((item, idx) => (
                <div 
                  key={item.id} 
                  className="flex gap-4 group cursor-pointer"
                  onClick={() => onNewsClick?.(item)}
                >
                  <div className="relative shrink-0">
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100">
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    </div>
                    <span className="absolute -top-2 -left-2 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center text-[10px] font-black text-red-600 shadow-sm">{idx + 1}</span>
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
          </div>

          {/* Dynamic Ads Sidebar */}
          <div className="space-y-6">
             {sidebarAds.map(ad => (
                <div key={ad.id} className="relative group overflow-hidden rounded-2xl shadow-xl">
                   <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">AD</div>
                   <a href={ad.link || '#'}>
                      <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
                   </a>
                </div>
             ))}
          </div>

          {/* Promotional Banner */}
          <div className="bg-gradient-to-br from-red-600 to-gray-900 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"></div>
             <div className="relative z-10 text-center">
                <p className="text-[10px] text-red-200 font-bold uppercase tracking-[0.3em] mb-4">আপনার সংবাদ এখানে দিন</p>
                <h4 className="text-white font-black text-lg mb-6 leading-tight">সাশ্রয়ী মূল্যে বিজ্ঞাপনের জন্য যোগাযোগ করুন</h4>
                <button className="w-full bg-white text-gray-900 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-100 transition-all select-none">কল করুন : ০১৭০০০০০</button>
             </div>
          </div>
        </aside>
      </div>

      {/* Recommended for You Bottom Grid */}
      {relatedNews.length > 0 && (
         <div className="py-20 border-t border-gray-100 print:hidden">
            <h3 className="text-3xl font-black text-gray-900 mb-12 flex items-center gap-4">
               <span className="w-3 h-10 bg-red-600 rounded-full"></span>
               আপনার জন্য আরও খবর
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {relatedNews.map(item => (
                  <div key={item.id} className="group cursor-pointer" onClick={() => onNewsClick?.(item)}>
                     <div className="aspect-[16/10] rounded-xl overflow-hidden mb-5 shadow-lg group-hover:shadow-2xl transition-all border border-gray-50">
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                     </div>
                     <span className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1 block">{item.category}</span>
                     <h4 className="text-sm font-black text-gray-900 line-clamp-2 leading-snug group-hover:text-red-700 transition-colors">{item.title}</h4>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* Professional Print/Download Template (Hidden in UI, visible in Print/Download) */}
      <div className="fixed left-[-9999px] top-0 print:static print:left-0 print:w-full">
        <div 
          ref={printRef} 
          className="w-[800px] mx-auto bg-white p-6 sm:p-10 font-sans text-black"
          style={{ minHeight: '1100px' }}
        >
          {/* Print Top Bar */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
            <div className="flex items-center gap-2 text-[12px] text-gray-600">
              <Calendar size={12} className="text-red-600" />
              <span>{new Date().toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-4 text-red-600">
              <Facebook size={14} />
              <Twitter size={14} />
              <MapPin size={14} />
              <Eye size={14} />
            </div>
          </div>

          {/* Slogan */}
          <div className="text-center mb-1">
            <span className="text-[12px] text-gray-500 font-medium uppercase tracking-[0.2em] italic">অন্যায়ের বিরুদ্ধে সোচ্চার</span>
          </div>

          {/* Main Logo Container */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center">
               <h1 className="text-[52px] font-black text-[#b71c1c] leading-none tracking-tighter" style={{ fontFamily: 'Kalpurush, Roboto, sans-serif' }}>সামী টিভি</h1>
            </div>
          </div>

          {/* News Title Section */}
          <div className="border-t-[1.5px] border-black pt-4 mb-4">
             <h2 className="text-[24px] font-bold text-black leading-tight mb-4 tracking-tight">
               {news.title}
             </h2>
             <div className="flex justify-between items-center py-2 border-y border-gray-100 font-bold text-[13px] text-gray-700">
                <div className="flex items-center gap-3">
                   <div className="w-[3px] h-4 bg-red-600"></div>
                   <span>প্রতিবেদক: {news.journalistName || 'স্টাফ রিপোর্টার'} | {news.category}, জামালপুর</span>
                </div>
                <div className="text-gray-400 font-medium text-[11px]">
                   পঠিত: ৭৫ বার
                </div>
             </div>
          </div>

          {/* Content with Image Wrapping */}
          <div className="news-print-content">
            <div className="float-left w-[440px] mr-6 mb-4">
              <img 
                src={news.imageUrl} 
                alt={news.title} 
                className="w-full h-auto border border-gray-50 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <p className="text-[11px] text-gray-500 mt-2 italic text-left border-l-2 border-red-600 pl-2">
                ছবি: প্রতিনিধি / সংগৃহীত
              </p>
            </div>
            <div className="text-[16px] leading-[1.85] text-gray-900 text-justify whitespace-pre-wrap font-medium">
              {news.content}
            </div>
          </div>

          {/* Print Footer */}
          <div className="mt-auto pt-16 border-t-[1.5px] border-gray-100">
            <div className="flex flex-col items-center gap-2">
               <h3 className="text-[20px] font-black text-red-700">সামী টিভি</h3>
               <p className="text-[12px] text-gray-500 font-bold">© ২০২৬ সামী টিভি | জামালপুরের সব খবর সবার আগে</p>
               <p className="text-[11px] text-blue-600 font-medium underline">ওয়েবসাইট: samitv.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
