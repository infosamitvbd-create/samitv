import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Music, Map as MapIcon, Play, Pause, Radio } from 'lucide-react';
import { LiveTVPlayer } from './LiveTVPlayer';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';

const latestNews = [
  { id: 1, title: "গণভোটে 'হ্যাঁ'-এর পক্ষে প্রচার চালাতে ২৭০ আসনে 'অ্যাম্বাসেডর' নিয়োগ দেবে এনসিপি", img: "https://picsum.photos/seed/side1/100/100" },
  { id: 2, title: "গণভোটে হ্যাঁ ভোটের পক্ষে প্রচারণা চালানোর বিষয়ে ব্যাখ্যা দিল অন্তর্বর্তী সরকার", img: "https://picsum.photos/seed/side2/100/100" },
  { id: 3, title: "সদরঘাটে মাদক ও অবৈধ অস্ত্রসহ দুইজন আটক", img: "https://picsum.photos/seed/side3/100/100" },
  { id: 4, title: "রাজধানীতে ট্রাফিক আইন অমান্য করায় বিপুল জরিমানা", img: "https://picsum.photos/seed/side4/100/100" },
];

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarAds, setSidebarAds] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'ads'), 
      where('position', '==', 'sidebar'),
      where('active', '==', true),
      limit(2)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSidebarAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* National Anthem Player */}
      <div className="bg-white rounded-sm news-card-shadow overflow-hidden border-t-4 border-green-600">
        <div className="bg-green-50 px-4 py-2 flex items-center justify-between border-b border-green-100">
          <div className="flex items-center gap-2">
            <Music size={16} className="text-green-700" />
            <span className="font-bold text-sm text-green-800">জাতীয় সঙ্গীত</span>
          </div>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
        </div>
        <div className="p-4 flex flex-col items-center gap-3">
          <p className="text-[10px] text-gray-500 font-medium">আমার সোনার বাংলা</p>
          <audio 
            id="anthem-audio"
            src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Amar_Shonar_Bangla_instrumental.ogg"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <button 
            onClick={() => {
              const audio = document.getElementById('anthem-audio') as HTMLAudioElement;
              if (isPlaying) audio.pause();
              else audio.play();
            }}
            className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
          </button>
          <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
            <motion.div 
              animate={isPlaying ? { x: ["-100%", "100%"] } : { x: "-100%" }}
              transition={isPlaying ? { repeat: Infinity, duration: 2, ease: "linear" } : {}}
              className="w-1/2 h-full bg-red-600"
            />
          </div>
        </div>
      </div>

      {/* Live TV Player Widget */}
      <div className="bg-white rounded-sm news-card-shadow overflow-hidden border-t-4 border-red-600">
        <div className="bg-red-50 px-4 py-2 flex items-center justify-between border-b border-red-100">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-red-600" />
            <span className="font-bold text-sm text-red-800 uppercase tracking-wider">লাইভ টিভি</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
            <span className="text-[10px] font-bold text-red-600 uppercase">সরাসরি</span>
          </div>
        </div>
        <div className="p-2">
          <LiveTVPlayer />
        </div>
      </div>

      <div className="bg-white rounded-sm news-card-shadow overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('latest')}
            className={`flex-1 py-3 font-bold text-sm transition-colors ${activeTab === 'latest' ? 'bg-sami-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            সর্বশেষ
          </button>
          <button 
            onClick={() => setActiveTab('popular')}
            className={`flex-1 py-3 font-bold text-sm transition-colors ${activeTab === 'popular' ? 'bg-sami-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            সর্বোচ্চ পঠিত
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          {latestNews.map((news, index) => (
            <div key={news.id} className="flex gap-3 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 flex gap-2">
                <div className="w-16 h-12 shrink-0 overflow-hidden rounded-sm">
                  <img src={news.img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <p className="text-xs font-bold leading-tight group-hover:text-sami-blue transition-colors line-clamp-2">
                  {news.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advertisements */}
      {sidebarAds.length > 0 ? (
        sidebarAds.map((ad) => (
          <a 
            key={ad.id} 
            href={ad.link || '#'} 
            target={ad.link ? "_blank" : "_self"} 
            rel="noopener noreferrer"
            className="block bg-white rounded-sm news-card-shadow overflow-hidden group"
          >
            <div className="relative">
              <img 
                src={ad.imageUrl} 
                alt={ad.title} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute top-1 right-1 bg-black/50 text-white text-[8px] px-1 rounded uppercase">বিজ্ঞাপন</div>
            </div>
          </a>
        ))
      ) : (
        <div className="bg-gray-100 aspect-[3/4] flex flex-col items-center justify-center text-gray-400 font-bold rounded-sm border-2 border-dashed border-gray-200">
          <span className="text-xs uppercase tracking-widest mb-2">বিজ্ঞাপন</span>
          <span className="text-[10px]">এখানে বিজ্ঞাপন দিন</span>
        </div>
      )}
    </div>
  );
};
