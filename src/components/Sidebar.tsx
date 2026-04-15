import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Music, Map as MapIcon, Play, Pause, Radio, Clock, Layout } from 'lucide-react';
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
      {/* Archive Section */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="bg-[#004a7c] text-white px-4 py-2 font-bold text-sm">Archive</div>
        <div className="p-4 flex gap-2">
          <input 
            type="date" 
            className="flex-1 border border-gray-300 rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-sami-red"
          />
          <button className="bg-[#1d70b8] text-white px-4 py-1 text-xs font-bold rounded-sm hover:bg-blue-700 transition-colors">Search</button>
        </div>
      </div>

      {/* Facebook Section */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="bg-[#004a7c] text-white px-4 py-2 font-bold text-sm">ফেসবুকে আমরা..</div>
        <div className="p-2">
          <div className="bg-gray-100 aspect-square flex items-center justify-center text-gray-400 text-xs text-center p-4 border border-dashed border-gray-300">
            Facebook Page Widget Placeholder<br/>(NP Creations)
          </div>
        </div>
      </div>

      {/* National Anthem Player */}
      <div 
        onClick={() => {
          const audio = document.getElementById('anthem-audio') as HTMLAudioElement;
          if (isPlaying) audio.pause();
          else audio.play();
        }}
        className="bg-white rounded-sm news-card-shadow overflow-hidden border-t-4 border-green-600 cursor-pointer hover:bg-green-50/30 transition-colors"
      >
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
          <div 
            className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
          </div>
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

      {/* Tabbed News Sidebar */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="flex bg-gray-100">
          <button 
            onClick={() => setActiveTab('latest')}
            className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === 'latest' ? 'bg-white text-gray-900 border-t-2 border-sami-red' : 'text-gray-500 hover:text-gray-700'}`}
          >
            সর্বশেষ সংবাদ
          </button>
          <button 
            onClick={() => setActiveTab('popular')}
            className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === 'popular' ? 'bg-white text-gray-900 border-t-2 border-sami-red' : 'text-gray-500 hover:text-gray-700'}`}
          >
            জনপ্রিয় সংবাদ
          </button>
        </div>
        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
          {latestNews.map((news) => (
            <div key={news.id} className="flex gap-3 group cursor-pointer pb-3 border-b border-gray-50 last:border-0">
              <div className="w-16 h-12 shrink-0 rounded-sm overflow-hidden bg-gray-100">
                <img src={news.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-sami-red transition-colors">
                  {news.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-right">
          <button className="text-xs font-bold text-sami-red hover:underline">More News.. »</button>
        </div>
      </div>

      {/* Sara Desh Section in Sidebar */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="border-b-2 border-gray-200 relative">
          <div className="flex items-center gap-2 p-3">
            <Layout size={16} className="text-gray-900" />
            <h2 className="text-sm font-bold text-gray-900">সারা দেশ</h2>
          </div>
          <div className="absolute bottom-[-2px] left-0 w-12 h-[2px] bg-sami-red"></div>
        </div>
        <div className="p-4 space-y-4">
          {latestNews.slice(0, 3).map((news) => (
            <div key={news.id} className="flex gap-3 group cursor-pointer">
              <div className="w-16 h-12 shrink-0 rounded-sm overflow-hidden bg-gray-100">
                <img src={news.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-sami-red transition-colors">
                  {news.title}
                </h4>
              </div>
            </div>
          ))}
          <button className="w-full py-2 text-xs font-bold text-sami-red hover:underline text-right">More News.. »</button>
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
