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
      <div 
        onClick={() => {
          const audio = document.getElementById('anthem-audio') as HTMLAudioElement;
          if (isPlaying) audio.pause();
          else audio.play();
        }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
      >
        <div className="bg-red-50 px-5 py-3 flex items-center justify-between border-b border-red-100">
          <div className="flex items-center gap-2">
            <Music size={16} className="text-sami-red" />
            <span className="font-black text-xs text-sami-red uppercase tracking-wider">জাতীয় সঙ্গীত</span>
          </div>
          <div className="w-2 h-2 bg-sami-red rounded-full animate-pulse"></div>
        </div>
        <div className="p-6 flex flex-col items-center gap-4">
          <p className="text-xs text-gray-500 font-bold">আমার সোনার বাংলা</p>
          <audio 
            id="anthem-audio"
            src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Amar_Shonar_Bangla_instrumental.ogg"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <div 
            className="w-14 h-14 bg-sami-red text-white rounded-full flex items-center justify-center shadow-lg shadow-sami-red/20 group-hover:scale-110 transition-transform"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              animate={isPlaying ? { x: ["-100%", "100%"] } : { x: "-100%" }}
              transition={isPlaying ? { repeat: Infinity, duration: 2, ease: "linear" } : {}}
              className="w-1/2 h-full bg-sami-red"
            />
          </div>
        </div>
      </div>

      {/* Live TV Player Widget */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="bg-red-50 px-5 py-3 flex items-center justify-between border-b border-red-100">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-sami-red" />
            <span className="font-black text-xs text-sami-red uppercase tracking-wider">লাইভ টিভি</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-sami-red rounded-full animate-ping"></div>
            <span className="text-[10px] font-black text-sami-red uppercase tracking-tighter">সরাসরি</span>
          </div>
        </div>
        <div className="p-3">
          <div className="rounded-xl overflow-hidden shadow-inner bg-black">
            <LiveTVPlayer />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('latest')}
            className={`flex-1 py-4 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'latest' ? 'bg-sami-red text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          >
            সর্বশেষ
          </button>
          <button 
            onClick={() => setActiveTab('popular')}
            className={`flex-1 py-4 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'popular' ? 'bg-sami-red text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          >
            সর্বোচ্চ পঠিত
          </button>
        </div>
        <div className="p-5 flex flex-col gap-5">
          {latestNews.map((news, index) => (
            <div key={news.id} className="flex gap-4 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 group-hover:bg-sami-red group-hover:text-white flex items-center justify-center font-black text-xs shrink-0 transition-all">
                {index + 1}
              </div>
              <div className="flex-1 flex gap-3">
                <div className="w-16 h-12 shrink-0 overflow-hidden rounded-lg shadow-sm">
                  <img src={news.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <p className="text-xs font-bold leading-snug group-hover:text-sami-red transition-colors line-clamp-2">
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
            className="block bg-white rounded-2xl shadow-sm overflow-hidden group border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="relative">
              <img 
                src={ad.imageUrl} 
                alt={ad.title} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">বিজ্ঞাপন</div>
            </div>
          </a>
        ))
      ) : (
        <div className="bg-gray-50 aspect-[3/4] flex flex-col items-center justify-center text-gray-300 font-black rounded-2xl border-2 border-dashed border-gray-200">
          <span className="text-[10px] uppercase tracking-widest mb-2">বিজ্ঞাপন</span>
          <span className="text-[10px]">এখানে বিজ্ঞাপন দিন</span>
        </div>
      )}
    </div>
  );
};
