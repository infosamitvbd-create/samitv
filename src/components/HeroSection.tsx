import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Clock } from 'lucide-react';

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
  const sideNews = newsList.slice(1, 3);
  const healthNews = newsList.slice(3, 5);

  if (newsList.length === 0) {
    // Fallback mock data
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-sm overflow-hidden news-card-shadow group cursor-pointer">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src="https://picsum.photos/seed/news1/800/450" 
                alt="Featured News" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5">
              <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight hover:text-sami-red transition-colors">
                মুন্সীগঞ্জে সুষ্ঠু নির্বাচন আয়োজনে সভা
              </h1>
              <p className="text-gray-600 leading-relaxed line-clamp-3">
                মুন্সীগঞ্জে সুষ্ঠু ও নিরপেক্ষভাবে আসন্ন জাতীয় সংসদ নির্বাচন আয়োজনে ভিজিল্যান্স ও অবজারভেশন টিমের সভা অনুষ্ঠিত হয়েছে...
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-4 rounded-sm news-card-shadow flex flex-col gap-4">
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-1/3 aspect-square shrink-0 overflow-hidden rounded-sm">
                <img src="https://picsum.photos/seed/news2/200/200" alt="News" className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm leading-snug group-hover:text-sami-red transition-colors">
                  গণভোটে 'হ্যাঁ'-এর পক্ষে প্রচার চালাতে ২৭০ আসনে 'অ্যাম্বাসেডর' নিয়োগ দেবে এনসিপি
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Featured News */}
      <div className="lg:col-span-8">
        <div 
          onClick={() => onNewsClick(featured)}
          className="relative bg-white rounded-xl overflow-hidden shadow-xl group cursor-pointer h-[450px]"
        >
          <img 
            src={featured.imageUrl} 
            alt={featured.title} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-sami-red text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                {featured.category}
              </span>
              <span className="text-white/70 text-xs font-bold flex items-center gap-1">
                <Clock size={12} />
                {featured.createdAt?.toDate().toLocaleDateString('bn-BD')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight group-hover:text-sami-accent transition-colors">
              {featured.title}
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed line-clamp-2 max-w-2xl">
              {featured.content}
            </p>
          </div>
        </div>
      </div>

      {/* Side News Grid */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 h-full">
          {sideNews.map((news) => (
            <div 
              key={news.id}
              onClick={() => onNewsClick(news)}
              className="relative bg-white rounded-xl overflow-hidden shadow-lg group cursor-pointer h-[213px]"
            >
              <img 
                src={news.imageUrl} 
                alt={news.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="bg-sami-red text-white px-2 py-0.5 rounded text-[10px] font-black uppercase mb-2 inline-block">
                  {news.category}
                </span>
                <h3 className="text-white font-bold text-base leading-snug group-hover:text-sami-accent transition-colors line-clamp-2">
                  {news.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
