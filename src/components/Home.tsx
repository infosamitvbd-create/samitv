import React, { useState, useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { Sidebar } from './Sidebar';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, X, Image as ImageIcon, Layout } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  onNewsClick: (news: any) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onNewsClick }) => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [reporters, setReporters] = useState<any[]>([]);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [popupAd, setPopupAd] = useState<any>(null);
  const [contentAds, setContentAds] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsList(news);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    // Reporters for Home
    const qReporters = query(collection(db, 'reporters'), limit(6));
    const unsubscribeReporters = onSnapshot(qReporters, (snapshot) => {
      setReporters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Media for Home
    const qMedia = query(collection(db, 'media'), orderBy('createdAt', 'desc'), limit(4));
    const unsubscribeMedia = onSnapshot(qMedia, (snapshot) => {
      setMediaItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Popup Ad Subscription
    const qPopup = query(
      collection(db, 'ads'), 
      where('position', '==', 'popup'),
      where('active', '==', true),
      limit(1)
    );
    const unsubscribePopup = onSnapshot(qPopup, (snapshot) => {
      if (!snapshot.empty) {
        setPopupAd({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        // Show popup after 2 seconds
        setTimeout(() => setShowPopup(true), 2000);
      }
    });

    // Content Ad Subscription
    const qContent = query(
      collection(db, 'ads'), 
      where('position', '==', 'content'),
      where('active', '==', true),
      limit(1)
    );
    const unsubscribeContent = onSnapshot(qContent, (snapshot) => {
      setContentAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribe();
      unsubscribeReporters();
      unsubscribeMedia();
      unsubscribePopup();
      unsubscribeContent();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col lg:flex-row gap-8"
    >
      <AnimatePresence>
        {showPopup && popupAd && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative max-w-lg w-full bg-white rounded-sm overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors z-10"
              >
                <X size={20} />
              </button>
              <a 
                href={popupAd.link || '#'} 
                target={popupAd.link ? "_blank" : "_self"} 
                rel="noopener noreferrer"
                className="block"
              >
                <img 
                  src={popupAd.imageUrl} 
                  alt={popupAd.title} 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </a>
              <div className="p-2 bg-sami-red text-white text-[10px] text-center font-bold uppercase tracking-widest">
                বিজ্ঞাপন
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col gap-10">
        <HeroSection onNewsClick={onNewsClick} />
        
        {/* Category Sections */}
        {['রাজনীতি', 'অর্থনীতি', 'জাতীয়', 'আন্তর্জাতিক'].map((cat) => {
          const catNews = newsList.filter(n => n.category === cat).slice(0, 4);
          if (catNews.length === 0) return null;
          
          return (
            <div key={cat} className="flex flex-col gap-4">
              <div className="border-b-2 border-gray-200 relative mb-4">
                <div className="flex items-center gap-2 pb-2">
                  <Layout size={18} className="text-gray-900" />
                  <h2 className="text-lg font-bold text-gray-900">{cat}</h2>
                </div>
                <div className="absolute bottom-[-2px] left-0 w-16 h-[2px] bg-sami-red"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {catNews.map((news) => (
                  <div 
                    key={news.id}
                    onClick={() => onNewsClick(news)}
                    className="bg-white group cursor-pointer"
                  >
                    <div className="aspect-video overflow-hidden mb-3">
                      <img 
                        src={news.imageUrl} 
                        alt={news.title} 
                        className="w-full h-full object-cover transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h3 className="font-bold text-sm leading-snug group-hover:text-sami-red transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Sports & Entertainment Sections (Side by Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {['খেলাধুলা', 'বিনোদন'].map((cat) => {
            const catNews = newsList.find(n => n.category === cat);
            return (
              <div key={cat} className="flex flex-col gap-4">
                <div className="border-b-2 border-gray-200 relative mb-4">
                  <div className="flex items-center gap-2 pb-2">
                    <Layout size={18} className="text-gray-900" />
                    <h2 className="text-lg font-bold text-gray-900">{cat === 'খেলাধুলা' ? 'খেলা-ধুলা' : 'বিনোদন'}</h2>
                  </div>
                  <div className="absolute bottom-[-2px] left-0 w-16 h-[2px] bg-sami-red"></div>
                </div>
                {catNews && (
                  <div 
                    onClick={() => onNewsClick(catNews)}
                    className="bg-white group cursor-pointer"
                  >
                    <div className="aspect-video overflow-hidden mb-3">
                      <img 
                        src={catNews.imageUrl} 
                        alt={catNews.title} 
                        className="w-full h-full object-cover transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h3 className="font-bold text-lg leading-snug group-hover:text-sami-red transition-colors">
                      {catNews.title}
                    </h3>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Home Content Ad */}
        {contentAds.length > 0 && (
          <div className="w-full">
            <a 
              href={contentAds[0].link || '#'} 
              target={contentAds[0].link ? "_blank" : "_self"} 
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
            >
              <img 
                src={contentAds[0].imageUrl} 
                alt={contentAds[0].title} 
                className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-700" 
                referrerPolicy="no-referrer" 
              />
            </a>
          </div>
        )}

        {/* Top News Grid (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {newsList.slice(0, 2).map((news) => (
            <div
              key={news.id}
              onClick={() => onNewsClick(news)}
              className="bg-white group cursor-pointer"
            >
              <div className="aspect-video overflow-hidden mb-3">
                <img 
                  src={news.imageUrl} 
                  alt={news.title} 
                  className="w-full h-full object-cover transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold text-lg leading-snug group-hover:text-sami-red transition-colors line-clamp-2">
                {news.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Middle News Grid (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {newsList.slice(2, 6).map((news) => (
            <div
              key={news.id}
              onClick={() => onNewsClick(news)}
              className="bg-white group cursor-pointer"
            >
              <div className="aspect-video overflow-hidden mb-3">
                <img 
                  src={news.imageUrl} 
                  alt={news.title} 
                  className="w-full h-full object-cover transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold text-sm leading-snug group-hover:text-sami-red transition-colors line-clamp-2">
                {news.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Our Family Section on Home */}
        {reporters.length > 0 && (
          <div className="bg-white p-8 rounded-2xl news-card-shadow border border-gray-50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-sami-red rounded-full"></div>
                <h2 className="text-2xl font-black text-sami-dark tracking-tight">আমাদের পরিবার</h2>
              </div>
              <button 
                onClick={() => onNavigate('/family')}
                className="bg-gray-50 text-sami-red px-4 py-2 rounded-full text-xs font-bold hover:bg-sami-red hover:text-white transition-all shadow-sm"
              >
                সব দেখুন
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {reporters.map((rep) => (
                <div key={rep.id} className="flex flex-col items-center text-center group cursor-pointer" onClick={() => onNavigate('/family')}>
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-3 ring-4 ring-gray-50 group-hover:ring-sami-red/20 transition-all shadow-md group-hover:scale-105 duration-300">
                    <img src={rep.imageUrl} alt={rep.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 line-clamp-1 mb-0.5">{rep.name}</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{rep.designation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Gallery Section on Home */}
        {mediaItems.length > 0 && (
          <div className="bg-white p-8 rounded-2xl news-card-shadow border border-gray-50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                <h2 className="text-2xl font-black text-sami-dark tracking-tight">মিডিয়া গ্যালারি</h2>
              </div>
              <button 
                onClick={() => onNavigate('/media')}
                className="bg-gray-50 text-red-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
              >
                সব দেখুন
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mediaItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer shadow-md"
                  onClick={() => onNavigate('/media')}
                >
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-2">
                      <ImageIcon size={16} />
                    </div>
                    <p className="text-white text-[10px] font-bold truncate">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <aside className="w-full lg:w-[320px] shrink-0">
        <Sidebar />
      </aside>
    </motion.div>
  );
};
