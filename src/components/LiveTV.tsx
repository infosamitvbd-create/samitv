import React from 'react';
import { motion } from 'motion/react';
import { Radio, MessageCircle, Users, Share2, Info, ChevronRight } from 'lucide-react';
import { LiveTVPlayer } from './LiveTVPlayer';

export const LiveTV: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Player Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-sm news-card-shadow overflow-hidden">
            <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Radio size={20} className="animate-pulse" />
                <h1 className="text-xl font-bold uppercase tracking-widest">সামি টিভি লাইভ</h1>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                <Users size={14} />
                <span>১২৪ জন দেখছেন</span>
              </div>
            </div>
            
            <div className="p-1 bg-black">
              <LiveTVPlayer />
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">সরাসরি সম্প্রচার: সামি টেলিভিশন</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    লাইভ চলছে • দিগপাইত, জামালপুর থেকে
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 bg-sami-blue text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-sami-dark transition-all shadow-lg shadow-sami-blue/20">
                    <Share2 size={18} /> শেয়ার করুন
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                <Info size={20} className="text-sami-blue shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  সামি টিভি সরাসরি সম্প্রচার দেখছেন। আমাদের সাথে থাকার জন্য ধন্যবাদ। কোনো সমস্যা হলে আমাদের হটলাইনে যোগাযোগ করুন।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Live Chat Placeholder */}
        <div className="space-y-6">
          <div className="bg-white rounded-sm news-card-shadow h-full flex flex-col min-h-[500px]">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
              <MessageCircle size={18} className="text-sami-blue" />
              <h3 className="font-bold text-gray-900">লাইভ চ্যাট</h3>
            </div>
            <div className="flex-grow p-6 flex flex-col items-center justify-center text-center text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={32} />
              </div>
              <p className="text-sm font-medium">লাইভ চ্যাট বর্তমানে বন্ধ আছে</p>
              <p className="text-[10px] mt-1">আমাদের ফেসবুক পেজে কমেন্ট করুন</p>
            </div>
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="কিছু লিখুন..." 
                  disabled
                  className="flex-grow bg-gray-100 border-none rounded-lg px-4 py-2 text-sm disabled:opacity-50"
                />
                <button disabled className="bg-sami-blue text-white p-2 rounded-lg disabled:opacity-50">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
