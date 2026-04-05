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
              <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight hover:text-sami-blue transition-colors">
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
                <h3 className="font-bold text-sm leading-snug group-hover:text-sami-blue transition-colors">
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
          className="bg-white rounded-sm overflow-hidden news-card-shadow group cursor-pointer h-full"
        >
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={featured.imageUrl} 
              alt={featured.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-sami-blue text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg">
                {featured.category}
              </span>
            </div>
          </div>
          <div className="p-5">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight hover:text-sami-blue transition-colors">
              {featured.title}
            </h1>
            <p className="text-gray-600 leading-relaxed line-clamp-3">
              {featured.content}
            </p>
          </div>
        </div>
      </div>

      {/* Side News */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-white p-4 rounded-sm news-card-shadow flex flex-col gap-4">
          {sideNews.map((news) => (
            <React.Fragment key={news.id}>
              <div 
                onClick={() => onNewsClick(news)}
                className="flex gap-4 group cursor-pointer"
              >
                <div className="w-1/3 aspect-square shrink-0 overflow-hidden rounded-sm">
                  <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm leading-snug group-hover:text-sami-blue transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                </div>
              </div>
              <hr className="border-gray-100 last:hidden" />
            </React.Fragment>
          ))}
        </div>

        {healthNews.length > 0 && (
          <div className="bg-white rounded-sm news-card-shadow overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h2 className="font-bold text-lg">অন্যান্য সংবাদ</h2>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {healthNews.map((news) => (
                <div 
                  key={news.id} 
                  onClick={() => onNewsClick(news)}
                  className="flex gap-3 group cursor-pointer"
                >
                  <div className="w-20 h-14 shrink-0 overflow-hidden rounded-sm">
                    <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <p className="text-xs font-bold leading-tight group-hover:text-sami-blue line-clamp-2">{news.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
