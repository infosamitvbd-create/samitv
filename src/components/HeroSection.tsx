import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, Clock, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onNewsClick: (news: any) => void;
  onNavigate?: (page: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNewsClick, onNavigate }) => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch news items
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(15));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsList(news);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    return () => unsubscribe();
  }, []);

  // Set up carousel interval
  useEffect(() => {
    const featuredCount = Math.min(newsList.length, 5);
    if (featuredCount <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredCount);
    }, 5000); // 5 seconds interval for natural reading pace

    return () => clearInterval(timer);
  }, [newsList]);

  if (newsList.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[380px]">
        <div className="lg:col-span-8 bg-gray-100 animate-pulse rounded-2xl h-[380px]"></div>
        <div className="lg:col-span-4 bg-gray-100 animate-pulse rounded-2xl h-[380px]"></div>
      </div>
    );
  }

  // Column 1 Components: Slider (first 5 news)
  const sliderNews = newsList.slice(0, 5);
  const featured = sliderNews[currentIndex] || newsList[0];

  // Column 2 Components: Latest 4 news
  const latestNews = newsList.slice(0, 4);
  const bnNumerals = ['১', '২', '৩', '৪'];

  return (
    <motion.div 
      id="home_upper_layout" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
    >
      
      {/* COLUMN 1: Slider (span-8) */}
      <div id="col_editor_choice" className="lg:col-span-8 flex flex-col justify-between">
        {/* Carousel Card Container with constant height on desktop */}
        <div 
          onClick={() => onNewsClick(featured)}
          className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-500 md:h-[370px] flex flex-col md:flex-row items-stretch group cursor-pointer"
        >
          {/* Left Text Block */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-white bg-gradient-to-br from-white via-white to-slate-50/30">
            <div className="flex-grow flex flex-col justify-center min-h-[190px]">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  {/* Feature Badge with flashing red live circle */}
                  <div className="flex items-center gap-1.5 bg-red-50 text-[#D92B2B] font-extrabold text-[11px] px-2.5 py-1 rounded-full border border-red-100/60 w-fit">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>বাছাইকৃত খবর</span>
                    <span className="relative flex h-1.5 w-1.5 ml-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600"></span>
                    </span>
                  </div>

                  <h3 className="text-[18px] md:text-[21px] font-black text-gray-900 leading-[1.38] group-hover:text-[#D92B2B] transition-colors duration-300 line-clamp-3">
                    {featured?.title}
                  </h3>
                  
                  <p className="text-gray-500 text-[13px] md:text-[14px] leading-relaxed line-clamp-3 font-medium">
                    {featured?.content 
                      ? featured.content.replace(/<[^>]*>/g, '').slice(0, 160) + "..." 
                      : "দেশ-বিদেশের সর্বশেষ সংবাদ নির্ভুল ও বস্তুনিষ্ঠভাবে প্রকাশ করে সামী টিভি।"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Bottom Controls / Date Info */}
            <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{new Date(featured?.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              {/* Dot Indicators */}
              <div className="flex gap-1.5 items-center">
                {sliderNews.map((_, i) => (
                  <button 
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(i);
                    }}
                    className={`transition-all duration-300 rounded-full h-1.5 ${
                      currentIndex === i 
                        ? 'w-6 bg-[#D92B2B]' 
                        : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Image Block */}
          <div className="w-full md:w-[46%] overflow-hidden relative shrink-0 aspect-video md:aspect-auto min-h-[220px] md:min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full absolute inset-0"
              >
                <img 
                  src={featured?.imageUrl} 
                  alt={featured?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>
            {/* Gradient Overlay for aesthetic look */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/10 via-transparent to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </div>

      {/* COLUMN 2: সর্বশেষ খবর (span-4) */}
      <div id="col_latest_news" className="lg:col-span-4 flex flex-col justify-between bg-white border border-gray-200/90 rounded-2xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.02)] h-full">
        {/* Header with Red Pulsing Symbol and Details page button */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D92B2B]"></span>
            </span>
            <h2 className="text-[16px] font-black text-gray-900 tracking-tight">সর্বশেষ খবর</h2>
          </div>
          <button 
            onClick={() => onNavigate && onNavigate('/category/all')} 
            className="text-[11.5px] font-black text-[#D92B2B] hover:text-[#ae2020] transition-colors flex items-center gap-0.5 group"
          >
            আরও খবর 
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Vertical News Items Column with Staggered Entrance Animation */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-1 flex-grow justify-between"
        >
          {latestNews.map((news, i) => (
            <motion.div 
              key={news.id} 
              onClick={() => onNewsClick(news)}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 16 } }
              }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
              className="flex items-center gap-3 py-2.5 border-b border-gray-100/80 last:border-0 hover:bg-slate-50/60 rounded-xl px-1.5 -mx-1.5 transition-all duration-300 cursor-pointer group"
            >
              {/* Bengali Ranking digit */}
              <span className="text-xl md:text-2xl font-black text-gray-200 group-hover:text-red-500 transition-colors duration-300 w-6 shrink-0 select-none text-center font-mono">
                {bnNumerals[i]}
              </span>

              {/* Thumbnail Left */}
              <div className="w-[64px] h-[45px] shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-gray-100 shadow-xs relative">
                <img 
                  src={news.imageUrl} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title & Info Right */}
              <div className="flex-1 min-w-0 pr-1 flex flex-col gap-1">
                <h4 className="text-[12px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#D92B2B] transition-colors duration-300">
                  {news.title}
                </h4>
                <div className="flex items-center gap-2 text-[9px] font-bold text-[#9CA3AF]">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(news.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('bn-BD')}
                  </span>
                  <span className="text-gray-200">|</span>
                  <span className="text-[#D92B2B] bg-red-50 text-[8px] px-1 py-0.25 rounded-xs font-black">
                    {news.category || 'জাতীয়'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </motion.div>
  );
};
