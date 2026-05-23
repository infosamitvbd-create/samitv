import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

export const BreakingNews: React.FC = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<any[]>([]);
  const [tickerText, setTickerText] = useState<string | null>(null);

  useEffect(() => {
    // Ticker Subscription
    const unsubscribeTicker = onSnapshot(doc(db, 'settings', 'ticker'), (doc) => {
      if (doc.exists()) {
        setTickerText(doc.data().text);
      }
    });

    // News Subscription (as fallback)
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribeNews = onSnapshot(q, (snapshot) => {
      setNewsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeTicker();
      unsubscribeNews();
    };
  }, []);

  return (
    <div className="bg-[#f8fafc] border-b border-gray-200 h-11 flex items-center overflow-hidden relative">
      <div className="container mx-auto flex items-center h-full max-w-7xl relative px-4">
        {/* News Badge with Masking Background */}
        <div className="absolute left-4 top-0 bottom-0 z-20 bg-[#f8fafc] flex items-center pr-3">
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-3 py-1 rounded-sm flex items-center gap-2 shadow-[2px_2px_8px_rgba(185,28,28,0.2)]">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            <span className="text-white font-bold text-[12px] tracking-tight uppercase whitespace-nowrap">শিরোনাম</span>
          </div>
          {/* Subtle gradient to mask the text as it goes under */}
          <div className="absolute left-full top-0 bottom-0 w-12 bg-gradient-to-r from-[#f8fafc] to-transparent pointer-events-none"></div>
        </div>

        {/* Ticker Container */}
        <div className="w-full overflow-hidden relative h-full flex items-center z-10 pl-[115px]">
          <div className="animate-marquee hover:[animation-play-state:paused] flex items-center">
            {/* Part 1 */}
            <div className="flex items-center gap-12 pr-12 whitespace-nowrap">
              {tickerText ? (
                <>
                  <span className="text-[13px] font-semibold text-slate-800 hover:text-red-700 transition-colors duration-300">{tickerText}</span>
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></span>
                  <span className="text-[13px] font-semibold text-slate-800 hover:text-red-700 transition-colors duration-300">{tickerText}</span>
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></span>
                </>
              ) : newsList.length > 0 ? (
                newsList.map((news) => (
                  <div 
                    key={news.id} 
                    onClick={() => navigate(`/news/${news.id}`)}
                    className="flex items-center gap-4 cursor-pointer group/item shrink-0"
                  >
                    <span className="text-[13px] font-semibold text-slate-800 group-hover/item:text-red-700 transition-colors duration-300">
                      {news.title}
                    </span>
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 opacity-60 group-hover/item:opacity-100 group-hover/item:scale-125 transition-all"></div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-semibold text-slate-800">সামি মাল্টিমিডিয়া লিমিটেড... সততার পথে অবিরাম... বাংলায় কথা বলে...</span>
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></span>
                </div>
              )}
            </div>
            
            {/* Part 2 (Exactly identical for seamless loop) */}
            <div className="flex items-center gap-12 pr-12 whitespace-nowrap" aria-hidden="true">
              {tickerText ? (
                <>
                  <span className="text-[13px] font-semibold text-slate-800 hover:text-red-700 transition-colors duration-300">{tickerText}</span>
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></span>
                  <span className="text-[13px] font-semibold text-slate-800 hover:text-red-700 transition-colors duration-300">{tickerText}</span>
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></span>
                </>
              ) : newsList.length > 0 ? (
                newsList.map((news) => (
                  <div 
                    key={`${news.id}-loop`} 
                    onClick={() => navigate(`/news/${news.id}`)}
                    className="flex items-center gap-4 cursor-pointer group/item shrink-0"
                  >
                    <span className="text-[13px] font-semibold text-slate-800 group-hover/item:text-red-700 transition-colors duration-300">
                      {news.title}
                    </span>
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 opacity-60 group-hover/item:opacity-100 group-hover/item:scale-125 transition-all"></div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-semibold text-slate-800">সামি মাল্টিমিডিয়া লিমিটেড... সততার পথে অবিরাম... বাংলায় কথা বলে...</span>
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></span>
                </div>
              )}
            </div>
          </div>
          
          {/* Subtle Fade at right edge */}
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#f8fafc] to-transparent pointer-events-none z-20"></div>
        </div>
      </div>
    </div>
  );
};
