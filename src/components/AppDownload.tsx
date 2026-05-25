import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Download, Shield, Zap, Smartphone, CheckCircle, Flame, User, Play, MessageSquare, Radio, FileText, Check, Settings, Send, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppDownload: React.FC = () => {
  const navigate = useNavigate();
  const downloadUrl = "https://drive.google.com/file/d/1XRi5iMvvtLlyZNg9eYd9HynPS7FYBJi-/view?usp=drive_link";

  // State to track the active screen inside the simulated phone mockup
  const [activeScreen, setActiveScreen] = useState<number>(3); // Default to the News Submission form screen (from the request)

  // Carousel screens representation
  const screens = [
    {
      id: 0,
      title: "হোম প্রচ্ছদ",
      header: "সামী টিভি হোম",
      content: (
        <div className="flex flex-col h-full bg-slate-900 text-white p-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="text-xs font-black tracking-widest text-sami-red">SAMI TV</span>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
          </div>
          <div className="space-y-3 flex-grow overflow-y-auto pr-1">
            <div className="rounded-lg overflow-hidden border border-white/5 bg-slate-800/80">
              <div className="aspect-video bg-indigo-950 flex items-center justify-center relative">
                <span className="absolute top-2 left-2 bg-sami-red text-[8px] px-1 py-0.5 rounded font-bold uppercase tracking-widest animate-pulse">জাতীয়</span>
                <span className="text-white/40 text-[10px] uppercase font-mono tracking-wider">প্রধান খবর চিত্রপট</span>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-bold leading-snug line-clamp-2">পৌরসভার আধুনিক ড্রেন নির্মাণ কাজের শুভ উদ্বোধন ঘোষণা</p>
                <div className="text-[9px] text-gray-400 mt-1">২ ঘণ্টা আগে</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/60 p-2 rounded-lg border border-white/5">
                <div className="aspect-video bg-slate-700/50 rounded mb-1"></div>
                <p className="text-[10px] font-bold line-clamp-2 leading-tight">জামালপুর পৌরসভায় আধুনিক রূপান্তর</p>
              </div>
              <div className="bg-slate-800/60 p-2 rounded-lg border border-white/5">
                <div className="aspect-video bg-slate-700/50 rounded mb-1"></div>
                <p className="text-[10px] font-bold line-clamp-2 leading-tight">সরিষাবাড়ী মহাসড়কের সর্বশেষ অবস্থা</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "লাইভ টিভি সরাসরি",
      header: "সরাসরি সামী টিভি",
      content: (
        <div className="flex flex-col h-full bg-black text-white p-4 justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-black tracking-widest text-sami-red">LIVE STREAMING</span>
            <span className="flex items-center gap-1 text-[9px] bg-red-600 px-1.5 py-0.5 rounded font-black uppercase"><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>লাইভ</span>
          </div>

          <div className="my-auto">
            <div className="aspect-video bg-slate-900 rounded-lg relative overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl group">
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 z-10"></div>
              <div className="w-12 h-12 rounded-full bg-sami-red/90 flex items-center justify-center z-20 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Play size={20} className="fill-white ml-0.5 text-white" />
              </div>
              <div className="absolute bottom-2 left-2 right-2 text-center text-[10.5px] font-bold whitespace-nowrap bg-black/60 py-1 px-2 rounded-full backdrop-blur-sm z-20">
                সরাসরি সম্প্রচার দেখুন
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 w-3/4 animate-pulse"></div>
              </div>
              <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                <span>1080p | 60 FPS</span>
                <span>বাফারিং মুক্ত এবং নিখুঁত এইচডি</span>
              </div>
            </div>
          </div>

          <div className="bg-red-950/40 border border-red-900/40 p-2 rounded-lg mb-2">
            <span className="text-[9px] text-red-400 font-black block uppercase tracking-wide">চলতি আয়োজন</span>
            <span className="text-xs font-bold text-gray-200">সাপ্তাহিক জামালপুর টক শো</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "প্রতিনিধি লগইন",
      header: "প্রতিনিধি পোর্টাল",
      content: (
        <div className="flex flex-col h-full bg-slate-905 text-white p-4 justify-center">
          <div className="text-center mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sami-red/10 border border-sami-red/30 flex items-center justify-center mx-auto mb-2">
              <Lock size={20} className="text-sami-red" />
            </div>
            <h4 className="text-xs font-black">প্রতিনিধি লগইন</h4>
            <p className="text-[9px] text-gray-400 mt-1">সামি টিভি সাংবাদিক ও প্রতিনিধি প্যানেল</p>
          </div>

          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-[9px] text-gray-400 mb-1 font-bold">মোবাইল নম্বর / ইমেইল</label>
              <input 
                type="text" 
                placeholder="017XXXXXXXX"
                className="w-full bg-slate-800/80 border border-white/10 rounded-lg p-2 text-[10.5px] focus:outline-none focus:border-red-500" 
                disabled
              />
            </div>
            <div>
              <label className="block text-[9px] text-gray-400 mb-1 font-bold">পাসওয়ার্ড</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-slate-800/80 border border-white/10 rounded-lg p-2 text-[10.5px] focus:outline-none focus:border-red-500" 
                disabled
              />
            </div>

            <button className="w-full bg-sami-red py-2 rounded-lg text-xs font-black transition-opacity opacity-80 cursor-not-allowed">
              লগইন করুন
            </button>
          </form>

          <p className="text-center text-[8.5px] text-gray-500 mt-4 leading-normal">লগইন সংক্রান্ত যেকোনো জটিলতায় সামী টিভি টেকনিক্যাল টিমের সাথে যোগাযোগ করুন।</p>
        </div>
      )
    },
    {
      id: 3,
      title: "নতুন সংবাদ পোস্ট",
      header: "সদস্য সংবাদ পোস্ট করুন",
      content: (
        <div className="flex flex-col h-full bg-[#141824] text-white">
          {/* Mock Screen Header */}
          <div className="bg-red-700 p-2.5 flex items-center justify-between shadow-md">
            <span className="text-[11px] font-black tracking-wide text-white">সদস্য সংবাদ পোস্ট করুন</span>
            <span className="text-[8.5px] uppercase bg-black/40 px-1.5 py-0.5 rounded font-black tracking-tight font-mono">ID: 2602</span>
          </div>
          
          <div className="p-3 space-y-3 flex-grow overflow-y-auto">
            {/* User Details */}
            <div className="bg-slate-800/70 p-2 rounded-lg border border-white/5 flex items-center gap-2.5 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/30 flex items-center justify-center overflow-hidden shrink-0">
                <User size={14} className="text-blue-400" />
              </div>
              <div className="text-left leading-normal">
                <div className="text-[10px] font-extrabold text-blue-300">এস.এম ফয়সল চৌধুরী</div>
                <div className="text-[8px] text-gray-400 font-bold">জেলা প্রতিনিধি ও এডমিন</div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-2 text-left">
              <div>
                <label className="block text-[8px] text-gray-400 uppercase font-black tracking-wider mb-0.5">বিভাগ নির্বাচন</label>
                <div className="w-full bg-[#0d1017] border border-white/5 rounded p-1.5 text-[9.5px] font-bold text-gray-300">
                  জামালপুর
                </div>
              </div>

              <div>
                <label className="block text-[8px] text-gray-400 uppercase font-black tracking-wider mb-0.5">সংবাদের শিরোনাম</label>
                <div className="w-full bg-[#0d1017] border border-white/5 rounded p-1.5 text-[9.5px] leading-normal font-bold text-gray-300">
                  পৌরসভার আধুনিক ড্রেন নির্মাণ কাজের উদ্বোধন
                </div>
              </div>

              <div>
                <label className="block text-[8px] text-gray-400 uppercase font-black tracking-wider mb-0.5">বিস্তারিত খবর</label>
                <div className="w-full bg-[#0d1017] border border-white/5 rounded p-1.5 text-[8.5px] font-medium leading-relaxed text-gray-400 h-20 overflow-hidden text-ellipsis line-clamp-4">
                  আজ জামালপুর শহরের বিভিন্ন গুরুত্বপূর্ণ অঞ্চলে আধুনিক ড্রেন নির্মাণ কাজের শুভ উদ্বোধন ঘোষণা করেন মাননীয় পৌর মেয়র। ড্রেনেজ ব্যবস্থার আধুনিকীকরণে এক যুগান্তকারী পদক্ষেপ হিসেবে এই প্রকল্পকে দেখা হচ্ছে...
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[9.5px] font-black py-1.5 transition-colors shadow-lg shadow-emerald-950/40">
                সংরক্ষণ
              </button>
              <button className="bg-gray-600 hover:bg-gray-500 text-white rounded text-[9.5px] font-bold py-1.5 transition-colors">
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "প্রতিনিধি ড্যাশবোর্ড",
      header: "ড্যাশবোর্ড প্যানেল",
      content: (
        <div className="flex flex-col h-full bg-slate-900 text-white p-4 justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <span className="text-[10px] font-black tracking-wider text-blue-400">ADMIN CONTROL</span>
            <span className="text-[8.5px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">অনলাইন</span>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-white/5 p-2 rounded-xl text-center">
                <span className="text-[14px] font-black text-indigo-300 block">৪৮</span>
                <span className="text-[8.5px] text-gray-400 block font-bold leading-tight">মোট সংবাদ</span>
              </div>
              <div className="bg-gradient-to-br from-amber-950 to-slate-900 border border-white/5 p-2 rounded-xl text-center">
                <span className="text-[14px] font-black text-amber-300 block">১২</span>
                <span className="text-[8.5px] text-gray-400 block font-bold leading-tight">মডারেট পেন্ডিং</span>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-white/5 p-2 flex items-center justify-between">
              <div className="text-left">
                <div className="text-[8.5px] text-gray-400 font-bold uppercase">রিপোর্ট কার্ড</div>
                <div className="text-[10px] font-black text-gray-200 mt-0.5">সবচেয়ে জনপ্রিয় সংবাদ</div>
              </div>
              <span className="text-[9px] bg-indigo-600 px-1 py-0.5 rounded text-white font-mono font-bold tracking-tighter">২৬.৮k</span>
            </div>
          </div>

          <div className="h-4 bg-slate-950/60 rounded flex items-center justify-between px-2 text-[8px] text-gray-500">
            <span>সর্বশেষ সিঙ্ক: এখনই</span>
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "ডিজিটাল ই-পেপার",
      header: "সামি ই-পেপার আর্কাইভ",
      content: (
        <div className="flex flex-col h-full bg-slate-100 text-slate-800 p-3 justify-between">
          <div className="bg-slate-900 text-white rounded p-1.5 flex items-center justify-between shadow">
            <span className="text-[9px] font-black tracking-widest text-[#FFF]">SAMI E-PAPER</span>
            <span className="text-[7.5px] bg-[#333] tracking-tighter text-gray-200 px-1.5 py-0.5 rounded font-black">২৪ মে ২০২৬</span>
          </div>

          <div className="flex-grow flex items-center justify-center my-2">
            <div className="bg-white border border-slate-300 rounded p-2 shadow-sm relative overflow-hidden flex flex-col h-full justify-between items-center w-full max-h-[170px]">
              <div className="w-full flex justify-between border-b pb-1 mb-1 items-center">
                 <span className="text-[6.5px] font-black border border-slate-405 px-1 bg-slate-50 uppercase">Page 1 of 4</span>
                 <span className="text-[7px] text-slate-500 font-bold">সরিষাবাড়ী সংস্করণ</span>
              </div>
              <div className="space-y-1 w-full text-left">
                 <div className="h-1.5 w-11/12 bg-slate-400 rounded"></div>
                 <div className="h-1.5 w-10/12 bg-slate-300 rounded"></div>
                 <div className="h-2 w-full bg-slate-200 rounded mt-2"></div>
                 <div className="grid grid-cols-2 gap-1 mt-1">
                    <div className="h-10 bg-slate-100 border rounded flex items-center justify-center"><span className="text-[5.5px] uppercase tracking-tighter text-slate-400">চিত্রপট</span></div>
                    <div className="space-y-0.5">
                       <div className="h-1 w-full bg-slate-300 rounded"></div>
                       <div className="h-1 w-11/12 bg-slate-200 rounded"></div>
                       <div className="h-1 w-9/12 bg-slate-200 rounded"></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <button className="w-full bg-slate-900 text-white rounded py-1 text-[8.5px] font-black flex items-center justify-center gap-1">
            <FileText size={10} /> ডাউনলোড ই-পেপার
          </button>
        </div>
      )
    },
    {
      id: 6,
      title: "সদস্যকর্মী ও প্রতিনিধি",
      header: "প্রতিনিধি তালিকা ও রেটিং",
      content: (
        <div className="flex flex-col h-full bg-slate-900 text-white p-3.5 justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
            <span className="text-[9px] font-black tracking-wider text-rose-400">SAMI REPRESENTATIVES</span>
            <span className="text-[8px] text-rose-400 font-black flex items-center gap-0.5"><Flame size={8} /> ৫ তারকা</span>
          </div>

          <div className="space-y-1.5 flex-grow overflow-y-auto pt-1.5">
            {[
              { name: "এস.এম ফয়সল চৌধুরী", rating: "★★★★★", place: "জামালপুর" },
              { name: "এম. এ. জলিল প্রধান", rating: "★★★★★", place: "সরিষাবাড়ী" },
              { name: "মো: রফিকুল ইসলাম", rating: "★★★★☆", place: "মেলান্দহ" },
            ].map((usr, id) => (
              <div key={id} className="bg-slate-800/40 p-1.5 rounded-lg border border-white/5 flex items-center justify-between">
                <div className="text-left">
                  <div className="text-[9px] font-bold text-gray-200">{usr.name}</div>
                  <div className="text-[7px] text-gray-400">{usr.place} সদর প্রতিনিধি</div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-rose-400 font-mono tracking-tighter">{usr.rating}</div>
                  <div className="text-[6.5px] text-emerald-400 font-bold uppercase tracking-wide">১০০% ভেরিফাইড</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-[7.5px] text-slate-500 font-bold">মোট নিবন্ধিত প্রতিনিধি: ১২৪ জন</div>
        </div>
      )
    }
  ];

  // Handler to slide to previous card
  const handlePrev = () => {
    setActiveScreen((prev) => (prev - 1 + screens.length) % screens.length);
  };

  // Handler to slide to next card
  const handleNext = () => {
    setActiveScreen((prev) => (prev + 1) % screens.length);
  };

  return (
    <div className="min-h-screen bg-[#07090e] bg-gradient-to-b from-[#0b0e18] to-[#07090e] text-white flex flex-col items-center py-6 md:py-10 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Dynamic Ambient Background Grid & Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1.2px,transparent_1.2px)] [background-size:20px_20px] pointer-events-none"></div>
      
      <div className="absolute top-1/4 left-0 w-[40%] h-[40%] bg-sami-red/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl w-full relative z-10 flex-grow flex flex-col">
        
        {/* Navigation back */}
        <div className="mb-6 flex justify-start">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all font-sans font-black text-xs bg-white/5 backdrop-blur-md border border-white/5 px-4.5 py-2 rounded-full"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-sami-red" />
            ফিরে যান
          </button>
        </div>

        {/* Content Section Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center flex-grow">
          
          {/* Left Description Side */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex self-center lg:self-start items-center gap-1.5 px-3 py-1 bg-sami-red/10 text-sami-red border border-sami-red/20 rounded-full text-[10.5px] font-black uppercase tracking-wider mb-4"
            >
              <div className="w-1.5 h-1.5 bg-sami-red rounded-full animate-ping"></div>
              SAMI TV ANDROID APP
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
              className="text-3xl sm:text-4xl lg:text-4xl font-black text-white leading-[1.2] mb-3.5 tracking-tight font-sans"
            >
              SAMI TV APP <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-amber-500 font-extrabold tracking-tight">অ্যাপ ডাউনলোড</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-gray-300 text-sm mb-6 leading-relaxed max-w-lg font-medium"
            >
              এখন আপনার SMARTPHONE-েই সরাসরি জামালপুরবাসীর সুখ-দুঃখ এবং সর্বশেষ সত্য সংবাদ সবার আগে তাৎক্ষণিক নোটিফিকেশনের মাধ্যমে পান। যুক্ত হোন এক লাখেরও বেশি মানুষের এই ডিজিটাল নেটওয়ার্কে!
            </motion.p>

            {/* Simulated Download Buttons: Stacked beautifully on mobile, side-by-side on tablet/desktop */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-5"
            >
              {/* Google Play Styled download button */}
              <a 
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden flex items-center gap-3.5 px-5 py-3 bg-gradient-to-r from-[#ba1a29] to-[#bf2c1e] text-white rounded-xl font-black text-left transition-all hover:scale-[1.02] active:scale-95 shadow-[0_8px_16px_rgba(191,44,30,0.18)] border border-sami-red/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" style={{ backgroundSize: '200% auto' }}></div>
                <div className="w-8.5 h-8.5 bg-black/15 rounded-lg flex items-center justify-center">
                  <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M17.5,12L12,6.5V10.5H6.5V13.5H12V17.5L17.5,12Z" />
                  </svg>
                </div>
                <div className="leading-tight font-sans">
                  <div className="text-[8.5px] uppercase font-bold tracking-widest text-[#FFF]/80">DOWNLOAD FROM</div>
                  <div className="text-sm font-extrabold text-white">Google Play</div>
                </div>
              </a>

              {/* App store Mock */}
              <div 
                className="flex items-center gap-3.5 px-5 py-3 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl font-black text-left cursor-not-allowed border border-white/5 transition-colors relative"
              >
                <div className="w-8.5 h-8.5 bg-white/5 rounded-lg flex items-center justify-center">
                  <Smartphone size={16} className="text-gray-500" />
                </div>
                <div className="leading-tight font-sans flex flex-col">
                  <span className="text-[8.5px] uppercase font-bold tracking-widest text-gray-650">AVAILABLE ON THE</span>
                  <span className="text-sm font-extrabold text-gray-500">App Store</span>
                </div>
                <div className="absolute -top-1.5 -right-1 px-1.5 py-0.5 bg-[#140b0d] border border-sami-red/20 rounded-full text-[6.5px] text-sami-red font-black uppercase tracking-widest leading-none">Soon</div>
              </div>
            </motion.div>

            {/* Secondary direct download link */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[11.5px] text-gray-400 font-medium flex items-center justify-center lg:justify-start gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0"></span>
              প্লে স্টোর ছাড়া সরাসরি APK ডাউনলোড করতে 
              <a 
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sami-red hover:text-red-400 font-black underline decoration-dashed hover:decoration-solid transition-colors"
              >
                এখানে ক্লিক করুন।
              </a>
            </motion.p>
          </div>

          {/* Center Column: Phone Interactive Simulator */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            
            {/* Phone Wrapper frame with scaled size */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative w-full max-w-[265px] py-2"
            >
              {/* Behind Phone Soft Ambient Glow */}
              <div className="absolute inset-4 bg-gradient-to-tr from-sami-red/10 to-indigo-600/5 blur-[50px] rounded-full pointer-events-none"></div>

              {/* Phone Container Box */}
              <div className="relative bg-[#0b0c10] rounded-[2.8rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-[5.5px] border-slate-800 ring-1 ring-white/5 overflow-hidden">
                
                {/* Micro Ear Speaker & Camera notch at the top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
                  <div className="w-8 h-0.5 bg-[#12151d] rounded-full mr-2"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#12151d] flex items-center justify-center"><div className="w-0.5 h-0.5 rounded-full bg-sky-500"></div></div>
                </div>

                {/* Simulated Screen with fixed responsive constraint */}
                <div className="rounded-[2rem] overflow-hidden aspect-[9/18.5] h-[410px] md:h-[430px] bg-slate-900 border border-white/5 relative flex flex-col pt-5 font-sans">
                  
                  {/* Transition container with active screen */}
                  <div className="flex-grow h-full relative overflow-hidden select-none">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeScreen}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 h-full w-full"
                      >
                        {screens[activeScreen].content}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                </div>

              </div>

              {/* Slider Navigation Indicator Dots */}
              <div className="mt-3.5 flex items-center justify-center gap-3">
                <button 
                  onClick={handlePrev}
                  className="w-6.5 h-6.5 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-[9px] text-gray-400 hover:text-white"
                >
                  ◀
                </button>
                <div className="flex items-center gap-1">
                  {screens.map((scr) => (
                    <button
                      key={scr.id}
                      onClick={() => setActiveScreen(scr.id)}
                      className={`h-1 rounded-full transition-all duration-300 ${activeScreen === scr.id ? 'w-3 bg-sami-red' : 'w-1 bg-gray-600 hover:bg-gray-400'}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={handleNext}
                  className="w-6.5 h-6.5 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-[9px] text-gray-400 hover:text-white"
                >
                  ▶
                </button>
              </div>

            </motion.div>
          </div>

          {/* Right Column: QR Code scanning block - now compact and elegant */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center text-center lg:text-left">
            
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-white/5 border border-white/5 backdrop-blur-md rounded-xl p-3.5 w-full max-w-[135px] flex flex-col items-center text-center shadow-md relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scan z-10"></div>
              
              <div className="bg-white p-2 rounded-lg shadow-sm flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
                {/* Crisp Vector QR Code representation */}
                <svg className="w-18 h-18 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                  {/* Corners */}
                  <rect x="0" y="0" width="28" height="28" fill="#1e293b" />
                  <rect x="4" y="4" width="20" height="20" fill="#FFF" />
                  <rect x="8" y="8" width="12" height="12" fill="currentColor" />
                  
                  <rect x="72" y="0" width="28" height="28" fill="#1e293b" />
                  <rect x="76" y="4" width="20" height="20" fill="#FFF" />
                  <rect x="80" y="8" width="12" height="12" fill="currentColor" />
                  
                  <rect x="0" y="72" width="28" height="28" fill="#1e293b" />
                  <rect x="4" y="76" width="20" height="20" fill="#FFF" />
                  <rect x="8" y="80" width="12" height="12" fill="currentColor" />
                  
                  {/* Internal grid cells */}
                  <rect x="8" y="38" width="8" height="12" fill="currentColor" />
                  <rect x="36" y="8" width="12" height="8" fill="currentColor" />
                  <rect x="40" y="24" width="16" height="16" fill="currentColor" />
                  <rect x="60" y="32" width="8" height="8" fill="currentColor" />
                  <rect x="32" y="48" width="12" height="12" fill="currentColor" />
                  <rect x="4" y="48" width="16" height="4" fill="currentColor" />
                  <rect x="12" y="60" width="4" height="4" fill="currentColor" />
                  <rect x="52" y="68" width="16" height="16" fill="currentColor" />
                  <rect x="76" y="48" width="12" height="8" fill="currentColor" />
                  <rect x="88" y="60" width="12" height="4" fill="currentColor" />
                  <rect x="84" y="72" width="16" height="8" fill="currentColor" />
                  <rect x="76" y="88" width="8" height="12" fill="currentColor" />
                  <rect x="36" y="84" width="12" height="16" fill="currentColor" />
                  <circle cx="50" cy="50" r="5" className="text-sami-red" fill="currentColor" />
                </svg>
              </div>
              <div className="mt-2.5 text-[9px] font-black text-white uppercase tracking-wider font-sans leading-tight">
                স্ক্যান করে <br />ইনস্টল করুন
              </div>
            </motion.div>
          </div>

        </div>

        {/* Feature Selector Pills Ribbon (Compact replacement of the massive card wrapper) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto"
        >
          {screens.map((scr) => (
            <button
              key={scr.id}
              onClick={() => setActiveScreen(scr.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight transition-all duration-200 flex items-center gap-1.5 border ${
                activeScreen === scr.id 
                  ? 'bg-[#ba1a29] text-white border-sami-red/30 shadow-[0_4px_12px_rgba(186,26,41,0.2)] scale-102' 
                  : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10 hover:text-gray-200'
              }`}
            >
              <span className={`w-1 h-1 rounded-full ${activeScreen === scr.id ? 'bg-white animate-pulse' : 'bg-gray-500'}`}></span>
              {scr.title}
            </button>
          ))}
        </motion.div>

        {/* Dynamic Key Perks Features: Extremely light bento section (replaces heavy card blocks) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-7 border-t border-white/5 mb-4">
          {[
            { 
              icon: <Shield className="text-amber-400" size={18} />, 
              title: "সম্পূর্ণ সুরক্ষিত ফাইল", 
              desc: "আমাদের অফিশিয়াল অ্যান্ড্রয়েড অ্যাপটি সম্পূর্ণ নিরাপদ এবং ম্যালওয়্যার মুক্ত।" 
            },
            { 
              icon: <Zap className="text-red-500" size={18} />, 
              title: "দুরুদ গতি সম্পন্ন ও লাইভ টিভি", 
              desc: "বাফারিং মুক্ত লাইভ ভিডিও এবং ধীরগতির ব্রডব্যান্ডেও উচ্চ মাত্রায় অপ্টিমাইজড।" 
            },
            { 
              icon: <CheckCircle className="text-indigo-400" size={18} />, 
              title: "ঝকঝকে ও সাধারণ ইন্টারফেস", 
              desc: "চমৎকার ডার্ক মোডেল, ঝকঝকে বাংলা ফন্ট এবং অসাধারণ রেসপন্সিভ ডিজাইন।" 
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.05) }}
              className="flex items-start gap-3 px-1"
            >
              <div className="w-8.5 h-8.5 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <div className="text-left font-sans">
                <h4 className="font-extrabold text-xs sm:text-xs.5 text-white mb-0.5">{feature.title}</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed font-medium">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AppDownload;
