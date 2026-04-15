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
    <div className="bg-[#004a7c] text-white h-10 flex items-center overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-full max-w-7xl">
        <div className="bg-sami-red px-4 h-full flex items-center font-bold text-sm shrink-0 shadow-[4px_0_10px_rgba(0,0,0,0.2)] z-10">
          শিরোনাম:
        </div>
        <div className="flex-1 px-4 overflow-hidden relative">
          <div className="whitespace-nowrap animate-marquee flex items-center gap-12">
            {tickerText ? (
              <span className="flex items-center gap-4 text-sm font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0"></span>
                {tickerText}
              </span>
            ) : newsList.length > 0 ? (
              newsList.map((news) => (
                <span 
                  key={news.id} 
                  onClick={() => navigate(`/news/${news.id}`)}
                  className="flex items-center gap-3 text-sm font-medium cursor-pointer hover:text-yellow-300 transition-colors"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0"></span>
                  {news.title}
                </span>
              ))
            ) : (
              <span className="flex items-center gap-2 text-sm font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0"></span>
                সামি টিভিতে আপনাকে স্বাগতম...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
