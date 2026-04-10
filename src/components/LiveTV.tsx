import React from 'react';
import { motion } from 'motion/react';
import { Radio, MessageCircle, Users, Share2, Info, ChevronRight, Calendar, Clock, MapPin, X, Image as ImageIcon } from 'lucide-react';
import { LiveTVPlayer } from './LiveTVPlayer';

export const LiveTV: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Player Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
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
            
            <div className="p-0 bg-black aspect-video relative group">
              <LiveTVPlayer />
              {/* Subtle Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-full uppercase tracking-tighter">Live Now</span>
                    <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                    <span className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                      <Calendar size={14} className="text-sami-teal" /> {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-gray-900 leading-[1.1] tracking-tight">সরাসরি সম্প্রচার: সামি টেলিভিশন (সামী মাল্টিমিডিয়া লিমিটেড)</h2>
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                      <MapPin size={16} className="text-sami-red" />
                      <span className="font-bold text-gray-700">দিগপাইত, জামালপুর</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                      <Clock size={16} className="text-sami-red" />
                      <span className="font-bold text-gray-700">২৪ ঘণ্টা লাইভ</span>
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
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-sami-light to-white p-6 rounded-2xl border border-sami-teal/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Info size={80} />
                  </div>
                  <h3 className="font-black text-sami-dark text-lg mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-sami-teal/10 rounded-lg flex items-center justify-center">
                      <Info size={18} className="text-sami-teal" />
                    </div>
                    আমাদের সম্পর্কে
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    দেশ-বিদেশের সংবাদ নির্ভুল ও বস্তুনিষ্ঠভাবে প্রকাশ করে সামী টিভি। সাংবাদিকতার নীতি মেনে সংবাদ সংগ্রহ ও প্রচারে বিশ্বাসী আমরা। খবরের ভেতরের খবর ও বিশ্লেষণে সর্বোচ্চ উৎকর্ষতা বজায় রাখার চেষ্টা করে সামী টিভি।
                  </p>
                </div>
                <div className="bg-gray-900 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
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
                href="https://facebook.com/samitv.bd" 
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
                  placeholder="কিছু লিখুন..." 
                  disabled
                  className="flex-grow bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm disabled:bg-gray-100 font-medium placeholder:text-gray-400 outline-none"
                />
                <button disabled className="bg-sami-red text-white p-3 rounded-xl disabled:opacity-50 shadow-lg shadow-sami-red/20">
                  <ChevronRight size={20} />
                </button>
              </div>
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
