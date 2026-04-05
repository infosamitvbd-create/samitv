import React, { useState, useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { Sidebar } from './Sidebar';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, X, Image as ImageIcon } from 'lucide-react';

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
              <div className="p-2 bg-sami-blue text-white text-[10px] text-center font-bold uppercase tracking-widest">
                বিজ্ঞাপন
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col gap-8">
        <HeroSection onNewsClick={onNewsClick} />
        
        {/* Home Content Ad */}
        {contentAds.length > 0 && (
          <div className="w-full">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {newsList.length > 1 ? (
            newsList.slice(1).map((news) => (
              <div
                key={news.id}
                onClick={() => onNewsClick(news)}
                className="bg-white p-4 rounded-sm news-card-shadow flex gap-4 group cursor-pointer"
              >
                <div className="w-1/3 aspect-video shrink-0 overflow-hidden rounded-sm">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-sami-blue font-bold uppercase">{news.category}</span>
                  </div>
                  <h3 className="font-bold text-sm leading-snug group-hover:text-sami-blue transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-2">
                    <Clock size={10} />
                    <span>{news.createdAt?.toDate().toLocaleDateString('bn-BD')}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback mock data if no news in Firestore yet
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-sm news-card-shadow flex gap-4 group cursor-pointer"
              >
                <div className="w-1/3 aspect-video shrink-0 overflow-hidden rounded-sm">
                  <img 
                    src={`https://picsum.photos/seed/grid${i}/300/200`} 
                    alt="News" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm leading-snug group-hover:text-sami-blue transition-colors">
                    রাজধানীর বিভিন্ন এলাকায় গ্যাস সরবরাহ বন্ধ থাকবে আজ
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">২ ঘণ্টা আগে</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Our Family Section on Home */}
        {reporters.length > 0 && (
          <div className="bg-white p-6 rounded-sm news-card-shadow">
            <div className="flex items-center justify-between mb-6 border-l-4 border-sami-blue pl-3">
              <h2 className="text-xl font-bold text-sami-dark">আমাদের পরিবার</h2>
              <button 
                onClick={() => onNavigate('/family')}
                className="text-sami-blue text-sm font-bold hover:underline"
              >
                সব দেখুন
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {reporters.map((rep) => (
                <div key={rep.id} className="flex flex-col items-center text-center group cursor-pointer" onClick={() => onNavigate('/family')}>
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-2 ring-2 ring-gray-100 group-hover:ring-sami-blue transition-all">
                    <img src={rep.imageUrl} alt={rep.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-[10px] font-bold text-gray-900 line-clamp-1">{rep.name}</h3>
                  <p className="text-[8px] text-gray-500 line-clamp-1">{rep.designation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Gallery Section on Home */}
        {mediaItems.length > 0 && (
          <div className="bg-white p-6 rounded-sm news-card-shadow">
            <div className="flex items-center justify-between mb-6 border-l-4 border-red-600 pl-3">
              <h2 className="text-xl font-bold text-sami-dark">মিডিয়া গ্যালারি</h2>
              <button 
                onClick={() => onNavigate('/media')}
                className="text-red-600 text-sm font-bold hover:underline"
              >
                সব দেখুন
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mediaItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative aspect-video rounded-sm overflow-hidden group cursor-pointer"
                  onClick={() => onNavigate('/media')}
                >
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                      <ImageIcon size={16} />
                    </div>
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
