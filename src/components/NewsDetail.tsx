import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowLeft, Clock, User, Share2, Tag, Printer, MapPin, Facebook, Twitter, MessageCircle, Copy, Check, ChevronRight, Download } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import html2canvas from 'html2canvas';

interface NewsDetailProps {
  news: any;
  onBack: () => void;
  onNewsClick?: (news: any) => void;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ news, onBack, onNewsClick }) => {
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [sidebarAds, setSidebarAds] = useState<any[]>([]);
  const [contentAds, setContentAds] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const newsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLatestNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(item => item.id !== news?.id));
    });
    return () => unsubscribe();
  }, [news?.id]);

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

  if (!news) return null;

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

  const shareUrl = window.location.href;
  const shareTitle = news.title;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-sami-blue z-[60] origin-left"
        style={{ scaleX }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="lg:col-span-8 bg-white rounded-sm news-card-shadow overflow-hidden print:shadow-none"
        >
          {/* Print Header */}
          <div className="hidden print:block border-b-2 border-sami-blue pb-4 mb-6 text-center">
            <h1 className="text-2xl font-bold text-sami-blue">সামি টিভি (SAMI TV)</h1>
            <p className="text-[10px] text-gray-500">দিগপাইত, জামালপুর | www.samitv.com</p>
          </div>

          {/* Header */}
          <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100 print:border-none">
            <div className="flex justify-between items-center mb-6 print:hidden">
              <button 
                onClick={onBack}
                className="text-sami-blue hover:text-sami-dark text-sm font-bold flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={18} /> হোমে ফিরুন
              </button>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="p-2 text-gray-500 hover:text-sami-blue hover:bg-gray-50 rounded-full transition-all disabled:opacity-50"
                  title="ডাউনলোড করুন"
                >
                  <Download size={20} className={isDownloading ? 'animate-bounce' : ''} />
                </button>
                <button 
                  onClick={handlePrint}
                  className="p-2 text-gray-500 hover:text-sami-blue hover:bg-gray-50 rounded-full transition-all"
                  title="প্রিন্ট করুন"
                >
                  <Printer size={20} />
                </button>
              </div>
            </div>
            
            <div ref={newsRef} className="bg-white">
              {/* Logo for Download/Print */}
              <div className="hidden print:block mb-6 text-center border-b-2 border-sami-blue pb-4">
                <h1 className="text-3xl font-bold text-sami-blue">সামি টিভি (SAMI TV)</h1>
                <p className="text-xs text-gray-500">দিগপাইত, জামালপুর | www.samitv.com</p>
              </div>
              
              {/* Also show logo during download capture */}
              {isDownloading && (
                <div className="mb-6 text-center border-b-2 border-sami-blue pb-4">
                  <h1 className="text-3xl font-bold text-sami-blue">সামি টিভি (SAMI TV)</h1>
                  <p className="text-xs text-gray-500">দিগপাইত, জামালপুর | www.samitv.com</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-sami-blue text-white px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider">
                {news.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={14} className="text-sami-blue" />
                <span>{news.createdAt?.toDate ? news.createdAt.toDate().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : 'এখনই'}</span>
              </div>
              {news.location && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={14} className="text-sami-blue" />
                  <span>{news.location}</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8">
              {news.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-y border-gray-50 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sami-light rounded-full flex items-center justify-center text-sami-blue border border-sami-blue/10">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">{news.journalistName || 'সামি টিভি ডেস্ক'}</p>
                  <p className="text-xs text-gray-500">{news.journalistName ? 'নিজস্ব প্রতিবেদক' : 'স্টাফ রিপোর্টার'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 print:hidden">
                <span className="text-xs font-bold text-gray-400 mr-2 uppercase tracking-widest">শেয়ার করুন:</span>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:scale-110 transition-transform"
                >
                  <Facebook size={18} />
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:scale-110 transition-transform"
                >
                  <Twitter size={18} />
                </a>
                <a 
                  href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:scale-110 transition-transform"
                >
                  <MessageCircle size={18} />
                </a>
                <button 
                  onClick={handleCopyLink}
                  className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${copied ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="aspect-video w-full rounded-sm overflow-hidden mb-8 shadow-lg">
                <img 
                  src={news.imageUrl} 
                  alt={news.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap font-sans text-lg">
                {news.content}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Content Ad */}
            {contentAds.length > 0 && (
              <div className="my-10">
                <a 
                  href={contentAds[0].link || '#'} 
                  target={contentAds[0].link ? "_blank" : "_self"} 
                  rel="noopener noreferrer"
                  className="block rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-shadow"
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

            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2 print:hidden">
              <div className="flex items-center gap-2 text-gray-500 text-sm mr-4">
                <Tag size={16} />
                <span className="font-bold">ট্যাগ:</span>
              </div>
              {['সামি টিভি', news.category, 'ব্রেকিং নিউজ', 'জামালপুর সংবাদ'].map(tag => (
                <span key={tag} className="bg-gray-50 text-gray-600 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-sami-blue hover:text-white transition-all cursor-pointer border border-gray-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8 print:hidden">
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
                  <div className="w-24 h-16 shrink-0 rounded-sm overflow-hidden">
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-sami-blue transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={10} />
                      {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('bn-BD') : 'এখনই'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={onBack}
              className="w-full mt-8 py-3 bg-gray-50 text-sami-blue font-bold text-sm rounded-lg hover:bg-sami-blue hover:text-white transition-all flex items-center justify-center gap-2"
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
                  <div className="absolute top-1 right-1 bg-black/50 text-white text-[8px] px-1 rounded uppercase">বিজ্ঞাপন</div>
                </div>
              </a>
            ))
          ) : (
            <div className="bg-gray-100 rounded-sm p-8 text-center border-2 border-dashed border-gray-200">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">বিজ্ঞাপন</p>
              <div className="aspect-square bg-gray-200 rounded flex items-center justify-center text-gray-400">
                <span className="text-sm">এখানে বিজ্ঞাপন দিন</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
