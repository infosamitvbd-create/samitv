import React from 'react';
import { motion } from 'motion/react';
import { Monitor, ArrowLeft, Bell, Smartphone, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComingSoon: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        <div className="mb-8 flex justify-center">
          <div className="relative">
             <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center relative z-10">
                <Tv size={48} className="text-red-600" />
             </div>
             <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce z-20">
                <Smartphone size={16} />
             </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Android TV App <span className="text-red-600">Coming Soon</span>
        </h1>
        
        <p className="text-slate-600 text-lg mb-10 leading-relaxed max-w-lg mx-auto font-medium">
          আমরা আমাদের এন্ড্রয়েড টিভি অ্যাপ তৈরির কাজ করছি। খুব শীঘ্রই আপনি বড় পর্দায় সামি টিভি দেখতে পারবেন।
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 text-left">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
              <Monitor className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">4K Quality</h3>
              <p className="text-sm text-slate-500 leading-tight">সেরা ভিডিও কোয়ালিটি নিশ্চিত করতে আমরা কাজ করছি।</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 text-left">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Bell className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Get Notified</h3>
              <p className="text-sm text-slate-500 leading-tight">অ্যাপটি মুক্তি পাওয়া মাত্রই আপনাকে জানানো হবে।</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-200"
          >
            <ArrowLeft size={18} />
            হোম পেজে ফিরে যান
          </button>
          <div className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-sm cursor-not-allowed flex items-center gap-2">
            Download for TV (Inactive)
          </div>
        </div>
      </motion.div>
      
      <div className="mt-20 text-slate-400 text-sm font-bold flex items-center gap-2">
         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
         Development in Progress
      </div>
    </div>
  );
};

export default ComingSoon;
