import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, User, Share2, Tag, Printer, MapPin, Facebook, Twitter, MessageCircle, Copy, Check, ChevronRight, Download, Bookmark, Eye, ThumbsUp, ArrowUp } from 'lucide-react';
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
  const newsRef = useRef<HTMLDivElement>(null);
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
    if (!newsRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(newsRef.current, {
        useCORS: true,
        scale: 2,
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
            className="fixed bottom-8 right-8 w-12 h-12 bg-sami-blue text-white rounded-full shadow-2xl z-50 flex items-center justify-center hover:bg-sami-dark transition-colors"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 print:block">
        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="lg:col-span-8 bg-white rounded-sm news-card-shadow overflow-hidden print:shadow-none print:p-0"
        >
          {/* Header Actions */}
          <div className="p-4 sm:p-6 border-b border-gray-50 flex justify-between items-center print:hidden">
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-sami-blue text-sm font-bold flex items-center gap-2 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-sami-light transition-colors">
                <ArrowLeft size={18} />
              </div>
              ফিরে যান
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-sami-light hover:text-sami-blue rounded-full text-xs font-bold transition-all disabled:opacity-50"
              >
                <Download size={16} className={isDownloading ? 'animate-bounce' : ''} />
                ডাউনলোড
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-sami-light hover:text-sami-blue rounded-full text-xs font-bold transition-all"
              >
                <Printer size={16} />
                প্রিন্ট
              </button>
            </div>
          </div>

          <div ref={newsRef} className="bg-white">
            {/* Print/Download Logo */}
            <div className="hidden print:block mb-8 text-center border-b-4 border-sami-blue pb-6">
              <h1 className="text-4xl font-black text-sami-blue tracking-tighter uppercase italic">সামি টিভি (SAMI TV)</h1>
              <p className="text-sm text-gray-500 font-bold mt-1">দিগপাইত, জামালপুর | www.samitv.com</p>
            </div>
            
            {isDownloading && (
              <div className="mb-8 text-center border-b-4 border-sami-blue pb-6">
                <h1 className="text-4xl font-black text-sami-blue tracking-tighter uppercase italic">সামি টিভি (SAMI TV)</h1>
                <p className="text-sm text-gray-500 font-bold mt-1">দিগপাইত, জামালপুর | www.samitv.com</p>
              </div>
            )}

            <div className="p-6 sm:p-10">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20">
                  {news.category}
                </span>
                <div className="flex items-center gap-4 text-xs text-gray-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-sami-blue" />
                    <span>{news.createdAt?.toDate ? news.createdAt.toDate().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : 'এখনই'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye size={14} className="text-sami-blue" />
                    <span>{calculateReadingTime(news.content)} মিনিট পাঠ</span>
                  </div>
                  {news.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-sami-blue" />
                      <span>{news.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-[1.15] mb-10 tracking-tight">
                {news.title}
              </h1>

              {/* Author Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-8 border-y border-gray-50 gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-sami-blue to-sami-dark rounded-full flex items-center justify-center text-white shadow-xl">
                      <User size={28} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 leading-none mb-1">{news.journalistName || 'সামি টিভি ডেস্ক'}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      {news.journalistName ? 'নিজস্ব প্রতিবেদক' : 'স্টাফ রিপোর্টার'} • সামি টিভি
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 print:hidden">
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:translate-y-[-4px] transition-all shadow-lg shadow-blue-600/20"
                  >
                    <Facebook size={20} />
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:translate-y-[-4px] transition-all shadow-lg shadow-blue-400/20"
                  >
                    <Twitter size={20} />
                  </a>
                  <a 
                    href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:translate-y-[-4px] transition-all shadow-lg shadow-green-600/20"
                  >
                    <MessageCircle size={20} />
                  </a>
                  <button 
                    onClick={handleCopyLink}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-lg ${copied ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 shadow-gray-200/20'}`}
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative mb-12 group">
                <div className="aspect-video w-full rounded-sm overflow-hidden shadow-2xl">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-xs font-medium italic opacity-90">ছবি: সামি টিভি আর্কাইভ</p>
                </div>
              </div>

              {/* Content Body */}
              <div className="prose prose-lg max-w-none text-gray-800 leading-[1.8] whitespace-pre-wrap font-sans text-xl mb-12">
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
          {/* Newsletter CTA */}
          <div className="bg-sami-dark text-white p-8 rounded-sm news-card-shadow relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Bookmark size={120} />
            </div>
            <h3 className="text-xl font-bold mb-4 relative z-10">সরাসরি আপডেট পান</h3>
            <p className="text-gray-400 text-sm mb-6 relative z-10">আমাদের নিউজলেটারে সাবস্ক্রাইব করুন এবং প্রতিদিনের গুরুত্বপূর্ণ সংবাদগুলো আপনার ইনবক্সে পান।</p>
            <div className="space-y-3 relative z-10">
              <input 
                type="email" 
                placeholder="আপনার ইমেইল" 
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-sami-blue transition-colors"
              />
              <button className="w-full py-3 bg-sami-blue hover:bg-sami-dark border border-sami-blue text-white font-bold text-sm rounded-lg transition-all">
                সাবস্ক্রাইব করুন
              </button>
            </div>
          </div>

          {/* Latest News Sidebar */}
          <div className="bg-white rounded-sm news-card-shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-sami-blue rounded-full"></div>
              সর্বশেষ সংবাদ
            </h3>
            <div className="space-y-6">
              {latestNews.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-4 group cursor-pointer"
                  onClick={() => onNewsClick?.(item)}
                >
                  <div className="w-24 h-16 shrink-0 rounded-sm overflow-hidden shadow-sm">
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-sami-blue transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-bold">
                      <Clock size={10} className="text-sami-blue" />
                      {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('bn-BD') : 'এখনই'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/')}
              className="w-full mt-8 py-3 bg-gray-50 text-sami-blue font-bold text-sm rounded-lg hover:bg-sami-blue hover:text-white transition-all flex items-center justify-center gap-2 border border-gray-100"
            >
              সব খবর দেখুন <ChevronRight size={16} />
            </button>
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
    </div>
  );
};
