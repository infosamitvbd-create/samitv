import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { ArrowLeft, Clock } from 'lucide-react';

interface NewsCategoryProps {
  category: string;
  onBack: () => void;
  onNewsClick: (news: any) => void;
}

export const NewsCategory: React.FC<NewsCategoryProps> = ({ category, onBack, onNewsClick }) => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'news'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsList(news);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [category]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white p-4 sm:p-6 rounded-sm news-card-shadow"
    >
      <div className="flex items-center justify-between mb-8 border-b-2 border-sami-blue pb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="text-sami-blue hover:underline text-sm font-bold flex items-center gap-1"
          >
            <ArrowLeft size={16} /> হোমে ফিরুন
          </button>
          <h2 className="text-2xl font-bold text-sami-blue">{category} সংবাদ</h2>
        </div>
        <span className="text-xs text-gray-400">মোট নিউজ: {newsList.length}টি</span>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">লোডিং...</div>
      ) : newsList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((news) => (
            <div 
              key={news.id} 
              className="group cursor-pointer"
              onClick={() => onNewsClick(news)}
            >
              <div className="aspect-video overflow-hidden rounded-sm mb-3">
                <img 
                  src={news.imageUrl} 
                  alt={news.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold text-gray-900 leading-snug group-hover:text-sami-blue transition-colors line-clamp-2">
                {news.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                <Clock size={12} />
                <span>{news.createdAt?.toDate().toLocaleDateString('bn-BD')}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          এই ক্যাটাগরিতে এখনও কোনো নিউজ নেই।
        </div>
      )}
    </motion.div>
  );
};
