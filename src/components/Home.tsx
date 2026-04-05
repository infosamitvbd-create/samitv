import React, { useState, useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { Sidebar } from './Sidebar';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  onNewsClick: (news: any) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onNewsClick }) => {
  const [newsList, setNewsList] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsList(news);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col lg:flex-row gap-8"
    >
      <div className="flex-1 flex flex-col gap-8">
        <HeroSection onNewsClick={onNewsClick} />
        
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
      </div>
      <aside className="w-full lg:w-[320px] shrink-0">
        <Sidebar />
      </aside>
    </motion.div>
  );
};
