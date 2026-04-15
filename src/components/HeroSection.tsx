import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface HeroSectionProps {
  onNewsClick: (news: any) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNewsClick }) => {
  const [newsList, setNewsList] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsList(news);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    return () => unsubscribe();
  }, []);

  const featured = newsList[0];
  const secondary = newsList.slice(1, 5);

  if (newsList.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-4 h-[600px] lg:h-[500px]">
        <div className="lg:col-span-2 lg:row-span-2 bg-gray-200 animate-pulse rounded-xl"></div>
        <div className="lg:col-span-2 bg-gray-200 animate-pulse rounded-xl"></div>
        <div className="bg-gray-200 animate-pulse rounded-xl"></div>
        <div className="bg-gray-200 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Main Featured News */}
      <div className="lg:col-span-8">
        <div 
          onClick={() => onNewsClick(featured)}
          className="bg-white rounded-sm overflow-hidden border border-gray-200 group cursor-pointer h-full"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <img 
              src={featured.imageUrl} 
              alt={featured.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-sami-red transition-colors">
              {featured.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Tabbed News List */}
      <div className="lg:col-span-4 flex flex-col h-full">
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col h-full">
          <div className="flex border-b border-gray-200">
            <button className="flex-1 py-2 text-xs font-bold bg-gray-100 border-r border-gray-200">সর্বশেষ সংবাদ</button>
            <button className="flex-1 py-2 text-xs font-bold bg-white">জনপ্রিয় সংবাদ</button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300">
            {newsList.map((news) => (
              <div 
                key={news.id}
                onClick={() => onNewsClick(news)}
                className="p-3 flex gap-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer group"
              >
                <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-sm overflow-hidden">
                  <img src={news.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <p className="text-xs font-bold leading-snug group-hover:text-sami-red transition-colors line-clamp-3">
                  {news.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
