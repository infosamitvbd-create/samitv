import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

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
    <div className="bg-sami-dark text-white h-12 flex items-center overflow-hidden border-y border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-full max-w-7xl">
        <div className="bg-sami-red px-6 h-full flex items-center font-black text-sm shrink-0 shadow-[10px_0_20px_rgba(0,0,0,0.3)] z-10 relative skew-x-[-12deg] -ml-4">
          <span className="skew-x-[12deg] flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            শিরোনাম:
          </span>
        </div>
        <div className="flex-1 px-8 overflow-hidden relative">
          <div className="whitespace-nowrap animate-marquee flex items-center gap-16">
            {tickerText ? (
              <span className="flex items-center gap-6 text-sm font-bold tracking-wide">
                <span className="w-1.5 h-1.5 bg-sami-red rounded-full shrink-0"></span>
                {tickerText}
              </span>
            ) : newsList.length > 0 ? (
              newsList.map((news) => (
                <span 
                  key={news.id} 
                  onClick={() => navigate(`/news/${news.id}`)}
                  className="flex items-center gap-6 text-sm font-bold tracking-wide cursor-pointer hover:text-sami-accent transition-colors group"
                >
                  <span className="w-1.5 h-1.5 bg-sami-red rounded-full shrink-0 group-hover:scale-150 transition-transform"></span>
                  {news.title}
                </span>
              ))
            ) : (
              <span className="flex items-center gap-6 text-sm font-bold tracking-wide">
                <span className="w-1.5 h-1.5 bg-sami-red rounded-full shrink-0"></span>
                সামি টিভিতে আপনাকে স্বাগতম... হৃদয়ের নতুন প্রজন্ম
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
