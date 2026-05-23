import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Shield, Zap, Smartphone, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppDownload: React.FC = () => {
  const navigate = useNavigate();
  const downloadUrl = "https://drive.google.com/file/d/1XRi5iMvvtLlyZNg9eYd9HynPS7FYBJi-/view?usp=drive_link";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-16 px-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.15]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl w-full relative z-10"
      >
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-slate-500 hover:text-red-600 transition-all mb-16 font-bold text-sm bg-slate-50 px-4 py-2 rounded-full hover:bg-red-50"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          ফিরে যান
        </button>

        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="flex-1 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[11px] font-black uppercase tracking-widest mb-8 border border-red-100 shadow-sm"
            >
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              Official Mobile Release
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
              স্মার্টফোনে দেখুন <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">সামি টিভি</span>
            </h1>
            
            <p className="text-slate-600 text-xl mb-12 font-medium leading-relaxed max-w-xl">
              এখনই সামি টিভি অ্যাপটি ডাউনলোড করুন এবং আপনার স্মার্টফোনে সরাসরি এইচডি কোয়ালিটিতে দেশ-বিদেশের খবর দেখুন।
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a 
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-red-600 transition-all shadow-2xl shadow-slate-200 hover:shadow-red-200 hover:-translate-y-1 active:scale-95"
              >
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <Download size={20} />
                </div>
                ডাউনলোড করুন
              </a>
              
              <div className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-xl border border-slate-200 cursor-not-allowed group relative overflow-hidden">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                iOS App
                <div className="absolute top-1 right-1 bg-red-600 text-white text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Coming Soon</div>
              </div>

              <div className="flex items-center gap-4 ml-auto">
                 <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
                 <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Current Version</div>
                    <div className="text-sm text-slate-800 font-black">v4.0.5 (Stable)</div>
                 </div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="w-full max-w-[340px] relative"
          >
            {/* Phone Mockup Elements */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/20 to-blue-600/20 blur-[80px] rounded-full opacity-60"></div>
            
            <div className="relative bg-slate-950 rounded-[3.5rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[8px] border-slate-800">
               {/* Screen Content */}
               <div className="bg-slate-900 rounded-[2.8rem] overflow-hidden aspect-[9/19] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-20 flex items-center justify-center">
                    <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
                  </div>
                  
                  {/* Mock App UI */}
                  <div className="h-full flex flex-col p-6 pt-12 text-center text-white">
                     <div className="mx-auto w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6 transform rotate-6">
                        <span className="text-white font-black text-4xl">S</span>
                     </div>
                     <h3 className="font-black text-2xl mb-2">SAMI TV</h3>
                     <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-10">Live News Streaming</p>
                     
                     <div className="space-y-4">
                        <div className="h-32 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center justify-center">
                           <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-red-500 border-b-[8px] border-b-transparent ml-1"></div>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="h-16 bg-slate-800/50 rounded-xl border border-white/5"></div>
                           <div className="h-16 bg-slate-800/50 rounded-xl border border-white/5"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Download Badge Overlay */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -bottom-6 -right-6 bg-white p-4 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-3 z-30"
            >
               <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                  <Shield size={24} className="text-white" />
               </div>
               <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Security Status</div>
                  <div className="text-xs text-slate-900 font-black">Verified & Secure</div>
               </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Shield className="text-red-600" size={32} />, 
              title: "সম্পূর্ণ সুরক্ষিত", 
              desc: "আমাদের অ্যাপটি গুগল ড্রাইভের মাধ্যমে সরাসরি ডাউনলোড করা যায় এবং এটি সম্পূর্ণ ভাইরাস মুক্ত।" 
            },
            { 
              icon: <Zap className="text-orange-500" size={32} />, 
              title: "দ্রুত স্ট্রিমিং", 
              desc: "কম ইন্টারনেট স্পিডেও আপনি বাফারিং ছাড়াই নিরবচ্ছিন্নভাবে লাইভ টিভি দেখতে পারবেন।" 
            },
            { 
              icon: <CheckCircle2 className="text-blue-600" size={32} />, 
              title: "সহজ ইউটিউজার ইন্টারফেস", 
              desc: "ব্যবহারকারীর কথা মাথায় রেখে আমরা তৈরি করেছি সহজ এবং আধুনিক ইন্টারফেস।" 
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h4 className="font-black text-xl text-slate-900 mb-4">{feature.title}</h4>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
            <span>© 2026 SAMI TV</span>
            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
            <span>Multimedia Limited</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-5 py-2 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                Privacy Protected
             </div>
             <div className="px-5 py-2 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                No Ads in App
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AppDownload;
