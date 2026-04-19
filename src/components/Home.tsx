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
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const bannerAds = [
    "https://images.weserv.nl/?url=https://www.globaltvbd.com/uploads/ads/021.png",
    "https://basis.org.bd/public//img/cover_photo/thumb/c3714243e84b8b13a6f24a1ce694352a21082023080245.jpg"
  ];

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % bannerAds.length);
    }, 30000); // 30 seconds

    return () => clearInterval(bannerInterval);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(50));
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

      <div className="flex-1 flex flex-col gap-8">
        <HeroSection onNewsClick={onNewsClick} />
        
        {/* Category: 'রাজনীতি' Style 1 (3 in a row) */}
        <div className="flex flex-col gap-4">
          <div className="border-t-2 border-black border-b-[1px] border-b-gray-200 bg-gray-50 flex items-center justify-between px-3 py-1">
            <div className="flex items-center gap-2">
              <span className="text-sami-red font-bold">■</span>
              <h2 className="text-sm font-bold text-gray-900">রাজনীতি</h2>
            </div>
            <button 
              onClick={() => onNavigate('/category/রাজনীতি')}
              className="text-[10px] font-bold text-sami-red hover:underline font-eng"
            >
              More News.. »
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {newsList.filter(n => n.category === 'রাজনীতি').slice(0, 3).map((news) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className="bg-white group cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden mb-2 border border-gray-100">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="font-bold text-xs leading-tight group-hover:text-sami-red transition-colors line-clamp-2">
                  {news.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Banner Ad above National - Alternating every 30s */}
        <div className="w-full relative min-h-[60px] md:min-h-[100px] overflow-hidden bg-gray-50 rounded-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBannerIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full cursor-pointer"
            >
              <img 
                src={bannerAds[activeBannerIndex]} 
                alt="Advertisement" 
                className="w-full h-auto rounded-sm shadow-sm transition-all hover:brightness-110"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Category: 'জাতীয়' Style 1 */}
        <div className="flex flex-col gap-4">
          <div className="border-t-2 border-black border-b-[1px] border-b-gray-200 bg-gray-50 flex items-center justify-between px-3 py-1">
            <div className="flex items-center gap-2">
              <span className="text-sami-red font-bold">■</span>
              <h2 className="text-sm font-bold text-gray-900">জাতীয়</h2>
            </div>
            <button 
              onClick={() => onNavigate('/category/জাতীয়')}
              className="text-[10px] font-bold text-sami-red hover:underline font-eng"
            >
              More News.. »
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              {newsList.filter(n => (n.category === 'জাতীয়' || n.category === 'জাতীয়'))[0] && (
                <div 
                  onClick={() => onNewsClick(newsList.filter(n => (n.category === 'জাতীয়' || n.category === 'জাতীয়'))[0])}
                  className="bg-white group cursor-pointer h-full flex flex-col md:flex-row gap-4"
                >
                  <div className="md:w-1/2 aspect-video overflow-hidden border border-gray-100">
                    <img 
                      src={newsList.filter(n => (n.category === 'জাতীয়' || n.category === 'জাতীয়'))[0].imageUrl} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="font-bold text-sm leading-tight group-hover:text-sami-red transition-colors">
                      {newsList.filter(n => (n.category === 'জাতীয়' || n.category === 'জাতীয়'))[0].title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-4">
                      {newsList.filter(n => (n.category === 'জাতীয়' || n.category === 'জাতীয়'))[0].content}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {newsList.filter(n => (n.category === 'জাতীয়' || n.category === 'জাতীয়')).slice(1, 4).map((news) => (
                <div 
                  key={news.id}
                  onClick={() => onNewsClick(news)}
                  className="flex gap-2 group cursor-pointer items-start border-b border-gray-100 pb-2 last:border-0"
                >
                  <div className="w-16 h-12 shrink-0 overflow-hidden border border-gray-100">
                    <img src={news.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <h4 className="text-[11px] font-bold leading-tight group-hover:text-sami-red transition-colors line-clamp-2">
                    {news.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Category: 'সারা দেশ' - Text Cards Grid */}
        <div className="flex flex-col gap-4">
          <div className="border-t-2 border-black border-b-[1px] border-b-gray-200 bg-gray-50 flex items-center justify-between px-3 py-1">
            <div className="flex items-center gap-2">
              <span className="text-sami-red font-bold">■</span>
              <h2 className="text-sm font-bold text-gray-900">সারা দেশ</h2>
            </div>
            <button 
              onClick={() => onNavigate('/category/সারা দেশ')}
              className="text-[10px] font-bold text-sami-red hover:underline font-eng"
            >
              More News.. »
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newsList.filter(n => n.category === 'সারাদেশ' || n.category === 'সারা দেশ').slice(0, 8).map((news) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className="bg-white p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-center min-h-[100px] group"
              >
                <h3 className="text-xs font-bold leading-tight text-center group-hover:text-sami-red transition-colors line-clamp-3">
                  {news.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Category: 'আন্তর্জাতিক' - 2 Large + 4 Small grid */}
        <div className="flex flex-col gap-4">
          <div className="border-t-2 border-black border-b-[1px] border-b-gray-200 bg-gray-50 flex items-center justify-between px-3 py-1">
            <div className="flex items-center gap-2">
              <span className="text-sami-red font-bold">■</span>
              <h2 className="text-sm font-bold text-gray-900">আন্তর্জাতিক</h2>
            </div>
            <button 
              onClick={() => onNavigate('/category/আন্তর্জাতিক')}
              className="text-[10px] font-bold text-sami-red hover:underline font-eng"
            >
              More News.. »
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            {newsList.filter(n => n.category === 'আন্তর্জাতিক').slice(0, 2).map((news) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className="bg-white group cursor-pointer"
              >
                <div className="aspect-video overflow-hidden mb-3 border border-gray-100">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <h3 className="font-bold text-sm leading-tight group-hover:text-sami-red transition-colors">
                  {news.title}
                </h3>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {newsList.filter(n => n.category === 'আন্তর্জাতিক').slice(2, 6).map((news) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className="bg-white group cursor-pointer"
              >
                <div className="aspect-video overflow-hidden mb-2 border border-gray-100">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <h3 className="font-bold text-[10px] leading-tight group-hover:text-sami-red transition-colors line-clamp-2">
                  {news.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
        
        {/* Categories: 'খেলাধুলা' & 'বিনোদন' (Side by Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sports */}
          <div className="flex flex-col gap-3">
            <div className="bg-gray-100 border-t-2 border-black border-b border-gray-200 px-3 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sami-red font-bold">■</span>
                <h2 className="text-[13px] font-bold text-gray-900">খেলাধুলা</h2>
              </div>
              <button onClick={() => onNavigate('/category/খেলাধুলা')} className="text-[10px] font-bold text-sami-red hover:underline uppercase">More News.. »</button>
            </div>
            {newsList.filter(n => n.category === 'খেলাধুলা')[0] && (
              <div onClick={() => onNewsClick(newsList.filter(n => n.category === 'খেলাধুলা')[0])} className="bg-white group cursor-pointer border border-gray-100 p-2">
                <div className="aspect-video overflow-hidden mb-2 border border-gray-50">
                  <img src={newsList.filter(n => n.category === 'খেলাধুলা')[0].imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <h3 className="font-bold text-[13px] leading-tight group-hover:text-sami-red line-clamp-2">{newsList.filter(n => n.category === 'খেলাধুলা')[0].title}</h3>
              </div>
            )}
            <div className="space-y-1.5">
              {newsList.filter(n => n.category === 'খেলাধুলা').slice(1, 5).map((news) => (
                <div key={news.id} onClick={() => onNewsClick(news)} className="group cursor-pointer flex gap-1.5 items-start border-b border-dashed border-gray-200 pb-1.5 last:border-0">
                  <span className="text-gray-400 text-[10px] mt-1 shrink-0">»</span>
                  <h4 className="text-[12px] font-bold text-gray-700 leading-tight group-hover:text-sami-red line-clamp-2">{news.title}</h4>
                </div>
              ))}
            </div>
            <div className="text-right">
               <button onClick={() => onNavigate('/category/খেলাধুলা')} className="text-[10px] font-bold text-sami-red hover:underline">More News.. »</button>
            </div>
          </div>

          {/* Entertainment */}
          <div className="flex flex-col gap-3">
            <div className="bg-gray-100 border-t-2 border-black border-b border-gray-200 px-3 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sami-red font-bold">■</span>
                <h2 className="text-[13px] font-bold text-gray-900">বিনোদন</h2>
              </div>
              <button onClick={() => onNavigate('/category/বিনোদন')} className="text-[10px] font-bold text-sami-red hover:underline uppercase">More News.. »</button>
            </div>
            {newsList.filter(n => n.category === 'বিনোদন')[0] && (
              <div onClick={() => onNewsClick(newsList.filter(n => n.category === 'বিনোদন')[0])} className="bg-white group cursor-pointer border border-gray-100 p-2">
                <div className="aspect-video overflow-hidden mb-2 border border-gray-50">
                  <img src={newsList.filter(n => n.category === 'বিনোদন')[0].imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <h3 className="font-bold text-[13px] leading-tight group-hover:text-sami-red line-clamp-2">{newsList.filter(n => n.category === 'বিনোদন')[0].title}</h3>
              </div>
            )}
            <div className="space-y-1.5">
              {newsList.filter(n => n.category === 'বিনোদন').slice(1, 5).map((news) => (
                <div key={news.id} onClick={() => onNewsClick(news)} className="group cursor-pointer flex gap-1.5 items-start border-b border-dashed border-gray-200 pb-1.5 last:border-0">
                  <span className="text-gray-400 text-[10px] mt-1 shrink-0">»</span>
                  <h4 className="text-[12px] font-bold text-gray-700 leading-tight group-hover:text-sami-red line-clamp-2">{news.title}</h4>
                </div>
              ))}
            </div>
            <div className="text-right">
               <button onClick={() => onNavigate('/category/বিনোদন')} className="text-[10px] font-bold text-sami-red hover:underline">More News.. »</button>
            </div>
          </div>
        </div>

        {/* Combined Category (3 Columns - Grid style in screenshot) */}
        <div className="flex flex-col gap-3">
          <div className="bg-gray-100 border-t-2 border-black border-b border-gray-200 px-3 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sami-red font-bold">■</span>
              <h2 className="text-[13px] font-bold text-gray-900">জামালপুর</h2>
            </div>
            <button onClick={() => onNavigate('/category/জামালপুর')} className="text-[10px] font-bold text-sami-red hover:underline uppercase">More News.. »</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {newsList.filter(n => n.category === 'জামালপুর').slice(0, 3).map((news) => (
              <div key={news.id} onClick={() => onNewsClick(news)} className="bg-white border border-gray-100 p-2 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="aspect-video overflow-hidden mb-2 border border-gray-50">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                </div>
                <h3 className="text-[12px] font-bold leading-tight group-hover:text-sami-red transition-colors line-clamp-2 text-center">{news.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Category: 'তথ্য-প্রযুক্তি' (Featured 2 + 4 Thumbnails) */}
        <div className="flex flex-col gap-3">
          <div className="bg-gray-100 border-t-2 border-black border-b border-gray-200 px-3 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sami-red font-bold">■</span>
              <h2 className="text-[13px] font-bold text-gray-900">তথ্য-প্রযুক্তি</h2>
            </div>
            <button onClick={() => onNavigate('/category/তথ্যপ্রযুক্তি')} className="text-[10px] font-bold text-sami-red hover:underline uppercase">More News.. »</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
            {newsList.filter(n => n.category === 'তথ্যপ্রযুক্তি').slice(0, 2).map((news) => (
              <div key={news.id} onClick={() => onNewsClick(news)} className="bg-white group cursor-pointer border border-gray-100 p-2">
                <div className="aspect-video overflow-hidden mb-2 border border-gray-50">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <h3 className="font-bold text-[14px] leading-tight group-hover:text-sami-red transition-colors">{news.title}</h3>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
            {newsList.filter(n => n.category === 'তথ্যপ্রযুক্তি').slice(2, 6).map((news) => (
              <div key={news.id} onClick={() => onNewsClick(news)} className="bg-white border border-gray-100 p-2 hover:shadow-sm cursor-pointer group">
                <div className="aspect-video overflow-hidden mb-2 border border-gray-50">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                </div>
                <h3 className="text-[10px] font-bold leading-tight line-clamp-2 group-hover:text-sami-red transition-colors">{news.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="w-full lg:w-[320px] shrink-0">
        <Sidebar />
      </aside>
    </motion.div>
  );
};
