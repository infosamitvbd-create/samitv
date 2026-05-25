import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, User, Share2, Tag, Printer, MapPin, Facebook, Twitter, MessageCircle, Copy, Check, ChevronRight, Download, Bookmark, Eye, ThumbsUp, ArrowUp, Home as HomeIcon, Layout, Calendar, Heart, BookmarkPlus } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where, doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';

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
  const [isSaving, setIsSaving] = useState(false);

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };
  
  const readingTime = news ? calculateReadingTime(news.content) : 0;
  
  const newsRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const saveRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [fontSize, setFontSize] = useState(14);

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

  const handleSaveImage = async () => {
    if (!saveRef.current) return;
    
    setIsSaving(true);
    try {
      // Generate high-quality PNG
      const dataUrl = await toPng(saveRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2, // Double resolution for crystal clear text
        quality: 1,
      });
      
      // Convert dataUrl to a File object for potential sharing
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const filename = `SAMI-TV-${news.title.slice(0, 20).replace(/\s+/g, '-')}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      // If Web Share API is available (primarily mobile), use it for "Save to Gallery"
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'SAMI TV Digital Edition',
            text: news.title,
          });
          setIsLiked(true);
        } catch (shareError) {
          // If user cancels sharing, we don't necessarily want to fallback to download 
          // unless it's a real error.
          if ((shareError as Error).name !== 'AbortError') {
            throw shareError;
          }
        }
      } else {
        // Standard download fallback for Desktop browsers
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setIsSaving(false);
    }
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4">
        {/* Main Content Area */}
        <div className="col-span-1 lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
          <motion.article 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-5 sm:p-10"
          >
            {/* Upper Top Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-gray-100">
               <div className="flex flex-wrap items-center gap-5 text-[13px] text-gray-500 font-bold">
                  <div className="flex items-center gap-2">
                     <Calendar size={14} className="text-red-500" />
                     <span>{new Date().toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Eye size={14} className="text-red-500" />
                     <span>মোট পঠিত: {news.viewCount || Math.floor(Math.random() * 500)} বার</span>
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  <button 
                    onClick={handleSaveImage} 
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-100 text-[12px] font-black hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                     {isSaving ? (
                       <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                     ) : (
                       <Bookmark size={14} className={isLiked ? 'fill-red-600 text-red-600' : 'text-gray-400'} />
                     )}
                     সেভ
                  </button>
                  <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-100 text-[12px] font-black hover:bg-gray-50 transition-colors">
                     <Printer size={14} className="text-gray-400" />
                     প্রিন্ট
                  </button>
               </div>
            </div>

            {/* Reporter Profile */}
            <div className="flex items-center gap-4 mb-8 group">
               <div className="w-12 h-12 rounded-full bg-red-50 border-2 border-white shadow-md flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                  <User size={24} className="text-red-500" />
               </div>
               <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                     <span className="text-red-600 font-black text-[12px] uppercase">প্রতিবেদক</span>
                  </div>
                  <h4 className="text-gray-900 font-black text-sm">{news.journalistName || 'কাকন আহমেদ ভূঁইয়া'} | বিশেষ প্রতিনিধি, জামালপুর</h4>
               </div>
            </div>

            <header className="mb-10">
               <h1 className="text-3xl sm:text-[42px] font-black leading-[1.25] text-gray-900 mb-6 tracking-tight antialiased selection:bg-red-600 selection:text-white">
                 {news.title}
               </h1>
               <div className="w-14 h-1 bg-red-600 rounded-full"></div>
            </header>

            {/* Featured Image and Caption */}
            <figure className="mb-10 relative group">
               <div className="rounded-xl overflow-hidden bg-gray-100 ring-1 ring-black/5 shadow-xl aspect-video">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
               </div>
               <figcaption className="mt-4 text-[13px] text-gray-500 font-bold italic leading-relaxed border-l-4 border-red-500 pl-4">
                  ছবি: {news.journalistName || 'কাকন আহমেদ ভূঁইয়া'} / বিশেষ প্রতিনিধি, জামালপুর
               </figcaption>
            </figure>

            {/* News Body Text - Organized Paragraphs */}
            <div 
              className="news-body-content editorial-content leading-[2] text-gray-800 mb-16 selection:bg-red-600/10"
              style={{ fontSize: `${fontSize}px` }}
            >
               {news.content?.split('\n').filter((p: string) => p.trim() !== '').map((paragraph: string, idx: number) => (
                 <p key={idx} className="mb-8">{paragraph.trim()}</p>
               ))}
            </div>

            {/* Related News Selection */}
            {relatedNews.length > 0 && (
              <div className="pt-16 border-t border-gray-100">
                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-4">
                  <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
                  আরও পড়ুন
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {relatedNews.slice(0, 4).map(item => (
                    <div 
                      key={item.id} 
                      className="flex gap-4 group cursor-pointer" 
                      onClick={() => {
                        onNewsClick?.(item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="w-24 aspect-video rounded-lg overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex flex-col justify-center gap-1.5">
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{item.category || 'সংবাদ'}</span>
                        <h4 className="text-sm font-black text-gray-900 line-clamp-2 leading-tight group-hover:text-red-700 transition-colors">
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
        <aside className="col-span-1 lg:col-span-4 space-y-8">
          {/* Most Read (সর্বাধিক পঠিত) Widget */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-white">
              <ArrowUp size={18} className="text-red-600 rotate-45" />
              <h3 className="text-lg font-black text-gray-900">সর্বাধিক পঠিত</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {latestNews.slice(0, 10).map((item, idx) => (
                <div 
                  key={item.id} 
                  className="p-4 flex gap-4 group cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    onNewsClick?.(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="relative shrink-0">
                    <div className="w-24 aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <span className="absolute -top-2 -left-2 w-6 h-6 bg-red-600 text-white rounded-lg flex items-center justify-center text-[11px] font-black shadow-md border-2 border-white">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[13px] font-black text-gray-900 line-clamp-2 leading-tight group-hover:text-red-700 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-bold text-gray-400 mt-2 block flex items-center gap-1">
                       <Clock size={10} />
                       ২ ঘণ্টা আগে
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links Widget */}
          <div className="bg-[#b71c1c] rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
             <h3 className="text-white font-black text-lg mb-6 relative z-10">আমাদের সাথে যুক্ত থাকুন</h3>
             <div className="flex justify-center gap-4 relative z-10">
                {[
                  { icon: Facebook, color: 'hover:bg-[#1877F2]' },
                  { icon: Twitter, color: 'hover:bg-black' },
                  { icon: MessageCircle, color: 'hover:bg-[#FF0000]' },
                  { icon: Share2, color: 'hover:bg-[#E4405F]' }
                ].map((social, i) => (
                   <button key={i} className={`w-11 h-11 rounded-xl border border-white/20 text-white flex items-center justify-center transition-all bg-white/10 ${social.color} hover:scale-110 active:scale-95 shadow-lg`}>
                      <social.icon size={20} />
                   </button>
                ))}
             </div>
          </div>

          {/* Newsletter Widget */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-2xl text-center border border-white/5">
             <h3 className="text-white font-black text-xl mb-3">খবর পান ইমেইলে</h3>
             <p className="text-gray-400 text-[13px] mb-8 font-medium leading-relaxed">প্রতিদিনের গুরুত্বপূর্ণ খবরগুলো সরাসরি আপনার ইনবক্সে পেতে সাবস্ক্রাইব করুন।</p>
             <div className="space-y-4">
                <input 
                   type="email" 
                   placeholder="আপনার ইমেইল ঠিকানা" 
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-center placeholder:text-gray-600"
                />
                <button className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-sm hover:bg-red-700 transition-all shadow-[0_10px_20px_rgba(220,38,38,0.3)] active:scale-95">সাবস্ক্রাইব করুন</button>
             </div>
          </div>

          {/* Poll Widget (জনমত জরিপ) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">জনমত জরিপ</h3>
             </div>
             <p className="text-[15px] font-bold text-gray-700 mb-8 leading-relaxed">
                আপনার কি মনে হয় জামালপুরে শিল্প পার্ক স্থাপনের ফলে স্থানীয় বেকারত্ব উল্লেখযোগ্য হারে হ্রাস পাবে?
             </p>
             <div className="space-y-3 mb-10">
                {['নিশ্চিতভাবে হ্যাঁ', 'হয়তো হতে পারে', 'বিপরীতটা হওয়ার সম্ভাবনা আছে'].map((option, i) => (
                   <label key={i} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-all hover:border-red-100 group">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-red-500 transition-colors">
                        <input type="radio" name="poll" className="w-2.5 h-2.5 appearance-none rounded-full checked:bg-red-600 bg-transparent transition-all" />
                      </div>
                      <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{option}</span>
                   </label>
                ))}
             </div>
             <div className="text-center">
                <button className="text-red-700 font-black text-sm uppercase tracking-widest hover:text-red-900 transition-colors border-b-2 border-red-100 hover:border-red-700 pb-1">ফলাফল দেখুন</button>
             </div>
          </div>
        </aside>
      </div>

      {/* Hidden Digital Edition Card for Save functionality */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none">
        <div ref={saveRef} className="w-[800px] bg-white p-0 overflow-hidden font-sans text-black shadow-2xl border border-gray-100">
          {/* Header Branding */}
          <div className="bg-red-700 p-1"></div>
          <div className="p-8 pb-4 text-center border-b border-gray-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg">
              Digital Edition
            </div>
            
            <div className="mb-4">
              <img 
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFj9Vggz6K8alsU_HhjhzliEjiij0iQBXBHM8ZPRIMET8EjAd3_ebQcFGWGplZCq0LB0gWXmmRaa7MGS5qvVI1Qui8Y50J92sgykRMhdCJMgDnQJShoY6OW9ULSgHYWYA5Lhm4OcXzdN1VvsTcDYdV82Hlwxg7anOL6r1bdhtmnebJsQCQih6uKeVHPUbY/s1068/NEW%20LOGO.png"
                alt="SAMI TV"
                className="h-20 mx-auto object-contain"
                crossOrigin="anonymous"
              />
            </div>
            
            <div className="mb-2">
              <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">SAMI MULTIMEDIA LTD.</h2>
              <h3 className="text-sm font-bold text-gray-600 tracking-wider">SAMI NETWORK BANGLADESH</h3>
            </div>
            
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="h-px w-10 bg-red-200"></div>
              <span className="text-[12px] font-bold text-red-700 italic">বাংলায় কথা বলে...</span>
              <div className="h-px w-10 bg-red-200"></div>
            </div>
          </div>

          <div className="px-10 py-8 bg-gray-50/30">
            <h1 className="text-[32px] font-black text-gray-900 leading-[1.3] mb-6 tracking-tight">
              {news.title}
            </h1>

            <div className="flex items-center justify-between gap-4 mb-8 text-[12px] text-gray-500 font-bold border-y border-gray-100 py-3">
               <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-red-500" /> {new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1.5"><User size={12} className="text-red-500" /> {news.journalistName || 'বিশেষ প্রতিনিধি'}</span>
               </div>
               <div className="text-red-600 uppercase tracking-tighter">www.jamalpur-television.web.app</div>
            </div>

            <div className="mb-8 rounded-xl overflow-hidden shadow-xl ring-1 ring-black/5 bg-gray-100 aspect-video">
              <img 
                src={news.imageUrl} 
                className="w-full h-full object-cover" 
                alt="" 
                crossOrigin="anonymous"
              />
            </div>

            <div className="flex gap-8">
              <div 
                className="w-full relative"
                style={{ fontSize: '15px', lineHeight: '1.8', color: '#1a1a1a', fontWeight: '500' }}
              >
                <div className="columns-2 gap-8 text-justify">
                  {news.content?.split('\n').filter((p: string) => p.trim() !== '').map((paragraph: string, idx: number) => (
                    <p key={idx} className="mb-4">{paragraph.trim()}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 px-10 py-6 flex items-center justify-between text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="relative z-10">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">প্রকাশিত হয়েছে</p>
               <p className="text-xs font-black">{new Date().toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="relative z-10 text-right">
               <div className="flex items-center gap-2 justify-end mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-100">Live Edition</span>
               </div>
               <p className="text-[9px] text-gray-500 font-bold italic">© ২০২৬ সামী মাল্টিমিডিয়া লিমিটেড</p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Print Template (Improved) */}
      <div className="fixed left-[-9999px] top-0 print:static print:left-0 print:w-full">
        <div ref={printRef} className="w-[850px] mx-auto bg-white p-12 font-sans text-black">
          <div className="text-center border-b-[3px] border-black pb-10 mb-10">
            <div className="mb-4">
              <img 
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFj9Vggz6K8alsU_HhjhzliEjiij0iQBXBHM8ZPRIMET8EjAd3_ebQcFGWGplZCq0LB0gWXmmRaa7MGS5qvVI1Qui8Y50J92sgykRMhdCJMgDnQJShoY6OW9ULSgHYWYA5Lhm4OcXzdN1VvsTcDYdV82Hlwxg7anOL6r1bdhtmnebJsQCQih6uKeVHPUbY/s1068/NEW%20LOGO.png"
                alt="SAMI TV"
                className="h-24 mx-auto"
              />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tight">SAMI MULTIMEDIA LTD.</h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.25em] mb-4">SAMI NETWORK BANGLADESH</p>
            <div className="h-[2px] w-20 bg-red-600 mx-auto mb-4"></div>
            <p className="text-[12px] font-bold text-red-700 italic">বাংলায় কথা বলে...</p>
          </div>
          
          <h2 className="text-[34px] font-black mb-8 leading-[1.25] text-gray-900">{news.title}</h2>
          
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg text-sm font-bold text-gray-600 mb-10 border border-gray-100">
            <div className="flex gap-6">
              <span className="flex items-center gap-2"><User size={16} /> প্রতিনিধি: {news.journalistName || 'নিউজ ডেস্ক'}</span>
              <span className="flex items-center gap-2"><Calendar size={16} /> {new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="text-red-700 font-black">Digital Edition</div>
          </div>
          
          <div className="mb-10">
            <img src={news.imageUrl} className="w-full h-auto rounded-xl shadow-lg" alt="" />
            <p className="mt-4 text-xs text-gray-400 font-bold italic text-right">ছবি: {news.journalistName || 'প্রতিনিধি'}</p>
          </div>

          <div className="text-[17px] leading-[1.8] text-gray-800 whitespace-pre-wrap text-justify columns-2 gap-10">
            {news.content}
          </div>
          
          <div className="mt-24 pt-10 border-t-2 border-gray-100 flex justify-between items-end">
            <div className="text-gray-400 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">SAMI MULTIMEDIA LTD.</p>
              <p className="text-[9px] font-bold">Jamalpur, Bangladesh</p>
              <p className="text-[9px] font-bold">www.jamalpur-television.web.app</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-2">Digital Edition</p>
              <p className="text-[9px] text-gray-400 font-bold italic">© ২০২৬ সামী মাল্টিমিডিয়া লিমিটেড</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
