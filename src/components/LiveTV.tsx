import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, MessageCircle, Users, Share2, Info, ChevronRight, Calendar, Clock, MapPin, X, Image as ImageIcon, Layout, Maximize2, Send, Facebook } from 'lucide-react';
import { LiveTVPlayer } from './LiveTVPlayer';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export const LiveTV: React.FC = () => {
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'schedules'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSchedule(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingSchedule(false);
    }, (error) => {
      console.error("Error fetching schedule:", error);
      setLoadingSchedule(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className={`${isTheaterMode ? 'bg-[#0a0a0a] min-h-screen -mt-6 -mx-4 sm:-mx-6 lg:-mx-8' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'} transition-colors duration-500`}
    >
      <div className={`${isTheaterMode ? '' : 'grid grid-cols-1 lg:grid-cols-4 gap-8'}`}>
        {/* Main Player Section */}
        <div className={`${isTheaterMode ? 'w-full' : 'lg:col-span-3 space-y-6'}`}>
          <div className={`${isTheaterMode ? 'rounded-none border-0 shadow-none' : 'bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100'} transition-all duration-500`}>
            {!isTheaterMode && (
              <div className="bg-gradient-to-r from-sami-dark to-sami-teal text-white px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="bg-red-600 p-2 rounded-lg animate-pulse shadow-lg shadow-red-600/20">
                      <Radio size={20} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h1 className="text-xl font-black uppercase tracking-tight leading-none">সামি টিভি লাইভ</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                      <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">সরাসরি সম্প্রচার</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                    <Users size={14} className="text-sami-red" />
                    <span>২৪/৭ সম্প্রচার</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`p-0 bg-black relative group ${isTheaterMode ? '' : 'aspect-video'}`}>
              <LiveTVPlayer isTheaterMode={isTheaterMode} onToggleTheater={setIsTheaterMode} />
              {/* Subtle Overlay on Hover */}
              {!isTheaterMode && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              )}
            </div>

            <div className={`${isTheaterMode ? 'bg-[#111] py-12 px-4 sm:px-8 lg:px-16 text-white border-t border-white/5' : 'p-6 sm:p-10'} transition-all`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-full uppercase tracking-tighter">Live Now</span>
                    <div className={`h-1 w-1 ${isTheaterMode ? 'bg-white/20' : 'bg-gray-300'} rounded-full`}></div>
                    <span className={`text-xs ${isTheaterMode ? 'text-gray-400' : 'text-gray-500'} font-bold flex items-center gap-1.5`}>
                      <Calendar size={14} className="text-sami-red" /> {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h2 className={`text-2xl sm:text-4xl font-black ${isTheaterMode ? 'text-white' : 'text-gray-900'} leading-[1.1] tracking-tight`}>
                    সরাসরি সম্প্রচার: সামি টেলিভিশন (সামী মাল্টিমিডিয়া লিমিটেড)
                  </h2>
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className={`flex items-center gap-2 px-3 py-1.5 ${isTheaterMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'} rounded-lg border`}>
                      <MapPin size={16} className="text-sami-red" />
                      <span className={`font-bold ${isTheaterMode ? 'text-gray-300' : 'text-gray-700'}`}>দিগপাইত, জামালপুর</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 ${isTheaterMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'} rounded-lg border`}>
                      <Clock size={16} className="text-sami-red" />
                      <span className={`font-bold ${isTheaterMode ? 'text-gray-300' : 'text-gray-700'}`}>২৪ ঘণ্টা লাইভ</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Sami TV Live',
                          url: window.location.href
                        });
                      }
                    }}
                    className="flex items-center gap-3 bg-sami-red text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-sami-dark transition-all shadow-xl shadow-sami-red/20 hover:shadow-sami-red/40 active:scale-95"
                  >
                    <Share2 size={20} /> শেয়ার করুন
                  </button>
                  {isTheaterMode && (
                    <button 
                      onClick={() => setIsTheaterMode(false)}
                      className="w-14 h-14 bg-white/5 text-white border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
                    >
                      <Layout size={24} />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`${isTheaterMode ? 'bg-white/5 border-white/10' : 'bg-gradient-to-br from-sami-light to-white border-sami-teal/5'} p-6 rounded-2xl border relative overflow-hidden group`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Info size={80} className={isTheaterMode ? 'text-white' : ''} />
                  </div>
                  <h3 className={`font-black ${isTheaterMode ? 'text-white' : 'text-sami-dark'} text-lg mb-4 flex items-center gap-2`}>
                    <div className={`w-8 h-8 ${isTheaterMode ? 'bg-white/10' : 'bg-sami-teal/10'} rounded-lg flex items-center justify-center`}>
                      <Info size={18} className={isTheaterMode ? 'text-white' : 'text-sami-teal'} />
                    </div>
                    আমাদের সম্পর্কে
                  </h3>
                  <p className={`text-sm ${isTheaterMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed font-medium`}>
                    দেশ-বিদেশের সংবাদ নির্ভুল ও বস্তুনিষ্ঠভাবে প্রকাশ করে সামী টিভি। সাংবাদিকতার নীতি মেনে সংবাদ সংগ্রহ ও প্রচারে বিশ্বাসী আমরা। খবরের ভেতরের খবর ও বিশ্লেষণে সর্বোচ্চ উৎকর্ষতা বজায় রাখার চেষ্টা করে সামী টিভি।
                  </p>
                </div>
                <div className={`${isTheaterMode ? 'bg-white/5 border-white/10' : 'bg-gray-900 border-white/5'} p-6 rounded-2xl border relative overflow-hidden group`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Radio size={80} className="text-white" />
                  </div>
                  <h3 className="font-black text-white text-lg mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Radio size={18} className="text-sami-red" />
                    </div>
                    টেকনিক্যাল সাপোর্ট
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6 font-medium">
                    লাইভ স্ট্রিম দেখতে কোনো সমস্যা হলে আমাদের সাথে যোগাযোগ করুন।
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ইমেইল</span>
                      <span className="font-bold text-sami-red text-sm">info.samitv.bd@gmail.com</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">অবস্থান</span>
                      <span className="font-bold text-gray-300 text-sm">জামালপুর, বাংলাদেশ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-8">
          {/* Program Schedule */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sami-teal/10 rounded-xl flex items-center justify-center">
                  <Calendar size={18} className="text-sami-teal" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm">অনুষ্ঠান সূচী</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Today's Schedule</p>
                </div>
              </div>
            </div>
            <div className="p-2 space-y-1">
              {loadingSchedule ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-4 border-sami-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Loading Schedule...</p>
                </div>
              ) : schedule.length > 0 ? (
                schedule.map((prog, i) => (
                  <div 
                    key={prog.id} 
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all ${prog.active ? 'bg-sami-red text-white shadow-lg shadow-sami-red/20' : 'hover:bg-gray-50'}`}
                  >
                    <div className={`text-[10px] font-black shrink-0 w-16 font-eng ${prog.active ? 'text-white/80' : 'text-gray-400'}`}>
                      {prog.time}
                    </div>
                    <div className="flex-grow">
                      <p className={`text-xs font-bold ${prog.active ? 'text-white' : 'text-gray-800'}`}>{prog.title}</p>
                      {prog.active && <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mt-0.5">এখন চলছে</p>}
                    </div>
                    {prog.active && <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <p className="text-xs font-bold italic">কোনো অনুষ্ঠান সূচী পাওয়া যায়নি</p>
                </div>
              )}
            </div>
          </div>

          {/* Live Chat Section */}
          <div className="bg-white rounded-2xl shadow-xl h-[600px] flex flex-col border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sami-red/10 rounded-xl flex items-center justify-center">
                  <MessageCircle size={20} className="text-sami-red" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900">লাইভ চ্যাট</h3>
                  <p className="text-[10px] text-gray-500 font-bold">দর্শকদের মতামত</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Online</span>
              </div>
            </div>
            
            <div className="flex-grow p-8 flex flex-col items-center justify-center text-center relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-sami-light to-white rounded-3xl flex items-center justify-center border-2 border-dashed border-sami-red/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <MessageCircle size={40} className="text-sami-red/40 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg">
                  <X size={16} className="text-red-500" />
                </div>
              </div>
              <h4 className="text-lg font-black text-gray-900 mb-2">চ্যাট বর্তমানে বন্ধ আছে</h4>
              <p className="text-xs text-gray-500 leading-relaxed max-w-[200px] font-medium">সরাসরি আমাদের সাথে কথা বলতে ফেসবুক পেজে মেসেজ দিন।</p>
              
              <a 
                href="https://www.facebook.com/samitvbd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-8 group/btn flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                ফেসবুক পেজ <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50/50">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="আপনার মন্তব্য লিখুন..." 
                  disabled
                  className="flex-grow bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm disabled:bg-gray-100 font-medium placeholder:text-gray-400 outline-none"
                />
                <button disabled className="bg-sami-red text-white p-3 rounded-xl disabled:opacity-50 shadow-lg shadow-sami-red/20">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Social Connect Badge */}
          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col gap-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <Facebook size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Connect with us</p>
                    <h4 className="font-black text-lg">Facebook Official</h4>
                  </div>
               </div>
               <p className="text-xs font-medium text-blue-50/70 leading-relaxed">সর্বশেষ আপডেট পেতে এবং সরাসরি কথা বলতে আমাদের ফেসবুক পেজে যুক্ত হন।</p>
               <a 
                href="https://www.facebook.com/samitvbd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-white text-blue-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-center hover:bg-blue-50 transition-all shadow-lg active:scale-95"
               >
                 Join Community
               </a>
            </div>
          </div>

          {/* Advertisement Placeholder */}
          <div className="bg-gradient-to-br from-sami-red to-sami-dark p-8 rounded-2xl text-center relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors"></div>
            <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em] mb-4 relative z-10">বিজ্ঞাপন</p>
            <div className="aspect-square bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-white p-6 border border-white/10 relative z-10">
              <ImageIcon size={40} className="mb-4 opacity-40" />
              <p className="font-black text-sm mb-2">আপনার বিজ্ঞাপন এখানে দিন</p>
              <p className="text-[10px] text-white/60 leading-relaxed">সাশ্রয়ী মূল্যে বিজ্ঞাপন দিতে আজই যোগাযোগ করুন</p>
              <button className="mt-6 w-full bg-white text-sami-red py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-sami-accent hover:text-sami-dark transition-all">বিস্তারিত জানুন</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
