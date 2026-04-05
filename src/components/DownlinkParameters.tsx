import React from 'react';
import { motion } from 'motion/react';
import { Radio, Signal, Globe, Satellite, Clock, Info, ShieldCheck } from 'lucide-react';

export const DownlinkParameters: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-sami-dark to-sami-blue py-20 px-8 text-center overflow-hidden rounded-sm news-card-shadow mb-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-600 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-blue-100 text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
            <Satellite size={14} /> স্যাটেলাইট সম্প্রচার
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">ডাউনলিংক প্যারামিটার</h1>
          <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full mb-6"></div>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg font-medium">
            সামী টিভি শীঘ্রই স্যাটেলাইটের মাধ্যমে আপনার ড্রয়িং রুমে পৌঁছে যাচ্ছে। আমাদের ডাউনলিংক প্যারামিটার সংক্রান্ত সকল তথ্য এখানে পাওয়া যাবে।
          </p>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white p-12 rounded-sm news-card-shadow text-center border-t-4 border-sami-blue mb-12 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-sami-light rounded-full opacity-50"></div>
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-sami-light text-sami-blue rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Signal size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">স্যাটেলাইট ডাউনলিংক প্যারামিটার</h2>
          <div className="inline-block px-6 py-2 bg-red-600 text-white font-bold rounded-full text-sm uppercase tracking-widest mb-8 shadow-lg shadow-red-600/20">
            শীঘ্রই আসছে (Coming Soon)
          </div>
          
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed mb-12">
            আমরা আমাদের স্যাটেলাইট সম্প্রচার কার্যক্রমের চূড়ান্ত পর্যায়ে রয়েছি। খুব শীঘ্রই বঙ্গবন্ধু স্যাটেলাইট-১ এর মাধ্যমে সামী টিভি সম্প্রচারিত হবে। ডাউনলিংক ফ্রিকোয়েন্সি, সিম্বল রেট এবং অন্যান্য টেকনিক্যাল প্যারামিটার এখানে আপডেট করা হবে।
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <Globe size={32} className="text-sami-blue mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">স্যাটেলাইট</h3>
              <p className="text-sm text-gray-500">বঙ্গবন্ধু স্যাটেলাইট-১ (BS-1)</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <Radio size={32} className="text-sami-blue mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">কভারেজ</h3>
              <p className="text-sm text-gray-500">বাংলাদেশ ও দক্ষিণ এশিয়া</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <ShieldCheck size={32} className="text-sami-blue mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">কোয়ালিটি</h3>
              <p className="text-sm text-gray-500">ফুল এইচডি (Full HD)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-sami-dark text-white p-10 rounded-sm news-card-shadow flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Info size={28} className="text-red-600" />
            কেবল অপারেটরদের জন্য
          </h3>
          <p className="text-gray-300 leading-relaxed mb-8">
            আপনি যদি একজন কেবল অপারেটর হন এবং আপনার নেটওয়ার্কে সামী টিভি যুক্ত করতে চান, তবে আমাদের টেকনিক্যাল টিমের সাথে যোগাযোগ করুন। সম্প্রচার শুরু হওয়ার সাথে সাথেই আপনাকে প্যারামিটারগুলো ইমেইলের মাধ্যমে পাঠিয়ে দেওয়া হবে।
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Clock size={24} className="text-sami-blue" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">আপডেটের সময়</p>
              <p className="font-bold">খুব শীঘ্রই ঘোষণা করা হবে</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-sm news-card-shadow border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">প্রয়োজনীয় তথ্য</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-sami-light text-sami-blue flex items-center justify-center shrink-0 mt-1">
                <Signal size={14} />
              </div>
              <p className="text-gray-600 text-sm">সম্প্রচার শুরু হলে এখানে ফ্রিকোয়েন্সি (Frequency) আপডেট করা হবে।</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-sami-light text-sami-blue flex items-center justify-center shrink-0 mt-1">
                <Signal size={14} />
              </div>
              <p className="text-gray-600 text-sm">পোলারাইজেশন (Polarization) এবং সিম্বল রেট (Symbol Rate) প্রদান করা হবে।</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-sami-light text-sami-blue flex items-center justify-center shrink-0 mt-1">
                <Signal size={14} />
              </div>
              <p className="text-gray-600 text-sm">মড্যুলেশন (Modulation) এবং FEC সংক্রান্ত তথ্য পাওয়া যাবে।</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-sami-light text-sami-blue flex items-center justify-center shrink-0 mt-1">
                <Signal size={14} />
              </div>
              <p className="text-gray-600 text-sm">অডিও ও ভিডিও পিআইডি (PID) তালিকাভুক্ত করা হবে।</p>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
