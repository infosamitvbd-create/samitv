import React from 'react';
import { motion } from 'motion/react';
import { Radio, MessageCircle, Users, Share2, Info, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import { LiveTVPlayer } from './LiveTVPlayer';

export const LiveTV: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Player Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-sm news-card-shadow overflow-hidden border border-gray-100">
            <div className="bg-sami-dark text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="bg-red-600 p-1.5 rounded-sm animate-pulse">
                  <Radio size={18} />
                </div>
                <div>
                  <h1 className="text-lg font-bold uppercase tracking-wider leading-none">সামি টিভি লাইভ</h1>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">সরাসরি সম্প্রচার</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/5">
                  <Users size={14} className="text-sami-blue" />
                  <span>২৪/৭ সম্প্রচার</span>
                </div>
              </div>
            </div>
            
            <div className="p-0 bg-black">
              <LiveTVPlayer />
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase">Live Now</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={12} /> {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">সরাসরি সম্প্রচার: সামি টেলিভিশন (সামী মাল্টিমিডিয়া লিমিটেড)</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-sami-blue" /> দিগপাইত, জামালপুর
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-sami-blue" /> ২৪ ঘণ্টা লাইভ
                    </span>
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
                    className="flex items-center gap-2 bg-sami-blue text-white px-6 py-3 rounded-sm font-bold text-sm hover:bg-sami-dark transition-all shadow-lg shadow-sami-blue/20"
                  >
                    <Share2 size={18} /> শেয়ার করুন
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-sami-light/50 p-5 rounded-sm border border-sami-blue/10">
                  <h3 className="font-bold text-sami-dark mb-3 flex items-center gap-2">
                    <Info size={18} className="text-sami-blue" /> আমাদের সম্পর্কে
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    দেশ-বিদেশের সংবাদ নির্ভুল ও বস্তুনিষ্ঠভাবে প্রকাশ করে সামী টিভি। সাংবাদিকতার নীতি মেনে সংবাদ সংগ্রহ ও প্রচারে বিশ্বাসী আমরা। খবরের ভেতরের খবর ও বিশ্লেষণে সর্বোচ্চ উৎকর্ষতা বজায় রাখার চেষ্টা করে সামী টিভি।
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-sm border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Radio size={18} className="text-red-600" /> টেকনিক্যাল সাপোর্ট
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    লাইভ স্ট্রিম দেখতে কোনো সমস্যা হলে আমাদের সাথে যোগাযোগ করুন।
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-2">
                      <span className="text-gray-500">ইমেইল:</span>
                      <span className="font-bold text-sami-blue">info.samitv.bd@gmail.com</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-gray-500">অবস্থান:</span>
                      <span className="font-bold text-gray-700">জামালপুর, বাংলাদেশ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-6">
          {/* Live Chat Section */}
          <div className="bg-white rounded-sm news-card-shadow h-[500px] flex flex-col border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-sami-blue" />
                <h3 className="font-bold text-gray-900">লাইভ চ্যাট</h3>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span> Online
              </span>
            </div>
            <div className="flex-grow p-6 flex flex-col items-center justify-center text-center text-gray-400 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              <div className="w-20 h-20 bg-sami-light rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-sami-blue/20">
                <MessageCircle size={36} className="text-sami-blue/40" />
              </div>
              <p className="text-sm font-bold text-gray-500">চ্যাট বর্তমানে বন্ধ আছে</p>
              <p className="text-xs mt-2 max-w-[200px]">সরাসরি আমাদের সাথে কথা বলতে ফেসবুক পেজে মেসেজ দিন।</p>
              <a 
                href="https://facebook.com/samitv.bd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-6 text-xs font-bold text-sami-blue hover:underline flex items-center gap-1"
              >
                ফেসবুক পেজ <ChevronRight size={14} />
              </a>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="কিছু লিখুন..." 
                  disabled
                  className="flex-grow bg-white border border-gray-200 rounded-sm px-4 py-2 text-sm disabled:bg-gray-100"
                />
                <button disabled className="bg-sami-blue text-white p-2 rounded-sm disabled:opacity-50">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Advertisement Placeholder */}
          <div className="bg-sami-blue/5 p-6 rounded-sm border border-dashed border-sami-blue/30 text-center">
            <p className="text-[10px] text-sami-blue/60 font-bold uppercase tracking-widest mb-2">বিজ্ঞাপন</p>
            <div className="aspect-square bg-white/50 rounded flex items-center justify-center text-gray-300 italic text-sm">
              বিজ্ঞাপনের জন্য যোগাযোগ করুন
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
