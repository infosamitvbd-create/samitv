import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, Signal, Globe, Info, ShieldCheck, Zap, Cpu, Activity, 
  CheckCircle2, Sliders, Tv, Wrench, MapPin, PhoneCall, Mail, 
  Compass, HelpCircle, Send, ArrowRight
} from 'lucide-react';

// District DTH calculation data for Bangabandhu-1 (119.1° E)
// Authentic approximate angles for dish pointing within Bangladesh
const DISTRICT_DTH_DATA: Record<string, { elevation: number; azimuth: number; skew: number }> = {
  'Mymensingh': { elevation: 49.2, azimuth: 119.8, skew: -41.2 },
  'Dhaka': { elevation: 48.7, azimuth: 119.4, skew: -40.5 },
  'Chittagong': { elevation: 47.1, azimuth: 118.2, skew: -38.6 },
  'Sylhet': { elevation: 48.9, azimuth: 120.9, skew: -42.8 },
  'Rajshahi': { elevation: 51.3, azimuth: 119.1, skew: -39.4 },
  'Khulna': { elevation: 50.1, azimuth: 118.1, skew: -38.1 },
  'Barisal': { elevation: 49.1, azimuth: 118.4, skew: -38.8 },
  'Rangpur': { elevation: 51.6, azimuth: 121.1, skew: -42.3 },
  'Jamalpur': { elevation: 49.8, azimuth: 119.9, skew: -41.5 },
};

export const DownlinkParameters: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'specs' | 'guide' | 'calculator'>('specs');
  
  // Interactive Signal Tuner states
  const [frequencySweep, setFrequencySweep] = useState(10700);
  const [tuningProgress, setTuningProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [signalQuality, setSignalQuality] = useState(0);
  const [signalStrength, setSignalStrength] = useState(0);

  // Dish Calculator states
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka');
  const [dishSize, setDishSize] = useState('60cm');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    mobile: '',
    strength: 'excellent',
    comments: ''
  });

  // Simulated Signal Tunning sweep on component mount
  useEffect(() => {
    const interval = setInterval(() => {
      setTuningProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLocked(true);
          setSignalQuality(96);
          setSignalStrength(98);
          setFrequencySweep(10970);
          return 100;
        }
        
        // Sweep frequency display
        const nextProg = prev + 1.5;
        const startFreq = 10700;
        const targetFreq = 10970;
        setFrequencySweep(Math.round(startFreq + (targetFreq - startFreq) * (nextProg / 100)));
        
        // Jitter some synthetic metrics before locking
        setSignalStrength(Math.round(nextProg * 0.98 + (Math.random() * 5 - 2.5)));
        setSignalQuality(Math.round(nextProg * 0.96 + (Math.random() * 6 - 3)));
        
        return nextProg;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    setTimeout(() => {
      setSubmittingFeedback(false);
      setFeedbackSent(true);
      // Reset form
      setFeedbackForm({ name: '', mobile: '', strength: 'excellent', comments: '' });
      setTimeout(() => setFeedbackSent(false), 5000);
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 py-6 font-sans mb-16"
    >
      {/* Broadcast Live Status & Hero Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-950 via-[#0d1527] to-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden mb-10 p-8 md:p-12">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          {/* Hexagonal structural background grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#cc000018_1.2px,transparent_1.2px)] [background-size:24px_24px]" />
          <div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-red-650 rounded-full blur-[160px] opacity-15" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-blue-650 rounded-full blur-[140px] opacity-10" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-650/15 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                <Radio size={12} className="animate-pulse text-red-500" />
                ব্রডকাস্ট অ্যান্ড ট্রান্সমিশন বিভাগ
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.1em] text-amber-500 animate-bounce">
                🎉 খুব শীঘ্রই সম্প্রচার শুরু হচ্ছে (COMING SOON)
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              আকাশ ডিটিএইচ <br />
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-amber-500 bg-clip-text text-transparent">
                সম্প্রচার ও টিউনিং নির্দেশিকা
              </span>
            </h1>
            
            <p className="text-slate-350 text-sm md:text-md font-bold leading-relaxed max-w-2xl">
              সামী টিভি (SAMI TV) এখনো অন-এয়ার (On Air) হয়নি, তবে আমরা অত্যন্ত আনন্দের সাথে জানাচ্ছি যে খুব শীঘ্রই আমরা দেশের একমাত্র বৈধ ডাইরেক্ট-টু-হোম দাতা <span className="text-white font-black underline underline-offset-4">"আকাশ ডিটিএইচ" (AKASH DTH)</span> এর Ku-Band স্যাটেলাইট নেটওয়ার্কে যুক্ত হয়ে আনুষ্ঠানিক ব্রডকাস্ট শুরু করতে যাচ্ছি।
            </p>

            <div className="p-4 bg-red-950/40 border border-red-850/60 rounded-xl max-w-2xl">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Tv size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">📺 অফিসিয়াল সামী - আকাশ সেট-টপ বক্স আসছে!</h4>
                  <p className="text-[11px] text-slate-400 font-bold mt-1 leading-relaxed">
                    গ্রাহকদেরকে সর্বোচ্চ মানসম্পন্ন ক্রিস্টাল ক্লিয়ার ভিডিও দিতে আমরা খুব শীঘ্রই বাজারে আমাদের নিজস্ব ব্রান্ডিংয়ে <strong className="text-teal-400">"অফিসিয়াল আকাশ সেট-টপ বক্স" (Official SAMI Akash Set-Top Box)</strong> লঞ্চ করতে যাচ্ছি। চোখ রাখুন আমাদের এই পেইজে!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Interactive Signal Meter */}
          <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-md rounded-xl p-6 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-red-500" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">ডিজিটাল সিগন্যাল মনিটর</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                <span className={`w-2.5 h-2.5 rounded-full ${isLocked ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 animate-pulse'}`} />
                <span className="text-[10px] uppercase font-black text-slate-300">{isLocked ? 'STABLE LOCK' : 'SWEEPING'}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              {/* Sweep Status */}
              <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold font-mono">
                <span>FREQ SWEEP range:</span>
                <span className="text-red-400">{frequencySweep} MHz (Ku)</span>
              </div>

              {/* Progress bar / Lock Sweep info */}
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-[2px] border border-slate-850">
                <div 
                  className="bg-gradient-to-r from-red-600 via-red-500 to-green-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${tuningProgress}%` }}
                />
              </div>

              {/* Signal Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850/80">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">সিগন্যাল ক্ষমতা (Strength)</div>
                  <div className="font-extrabold text-xl font-mono text-slate-200 mt-0.5">{signalStrength}%</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850/80">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">সিগন্যাল গুণগত মান (Quality)</div>
                  <div className="font-extrabold text-xl font-mono text-green-400 mt-0.5">{signalQuality}%</div>
                </div>
              </div>

              {/* Locked telemetry status block */}
              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850 flex items-center justify-between text-[11px] font-bold">
                <div className="text-slate-400 flex items-center gap-1">
                  <Activity size={12} className="text-blue-400 animate-spin" />
                  <span>BER:</span>
                  <span className="text-slate-200 font-mono">1.0E-9</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1">
                  <span>Modulation:</span>
                  <span className="text-slate-200 font-mono">8PSK / DVB-S2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation menu */}
      <div className="flex justify-center sm:justify-start border-b border-gray-200 mb-8 overflow-x-auto gap-2">
        {[
          { id: 'specs', label: 'কারিগরি ডিশ স্পেসিফিকেশন', icon: Cpu },
          { id: 'guide', label: 'আকাশ ডিটিএইচ টিউনিং নির্দেশিকা', icon: Tv },
          { id: 'calculator', label: 'ডিশ অ্যালাইনমেন্ট ক্যালকুলেটর 🇧🇩', icon: Compass },
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-5 py-4 border-b-2 font-bold text-sm transition-all focus:outline-none whitespace-nowrap -mb-[2px] ${
                isActive 
                  ? 'border-red-600 text-red-600 font-black' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <IconComponent size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conditional Tab Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
        >
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Parameter specification list */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Sliders size={20} className="text-red-650" />
                    রিসেপশন অ্যান্ড টিউনিং ডিটেইলস
                  </h2>
                  <p className="text-xs sm:text-xs text-gray-400 font-bold mt-1">
                    ব্রডকাস্ট রিসিভার, ডিজিটাল ক্যাবল হ্যাম বা আকাশ ডিটিএইচ এ সামি টিভির সম্প্রচার ফ্রিকোয়েন্সি নিম্নরূপ:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'ডিটিএইচ প্ল্যাটফর্ম', value: 'AKASH DTH (আকাশ)', desc: 'দেশের একমাত্র বৈধ ডাইরেক্ট-টু-হোম লাইসেন্সধারী।' },
                    { label: 'সম্প্রচার স্ট্যাটাস', value: 'অন-এয়ার টেস্ট শীঘ্রই শুরু', desc: 'খুব শীঘ্রই আমরা আকাশ ডিটিএইচে সিগন্যাল সহ অন-এয়ার হব।' },
                    { label: 'অফিসিয়াল সেট-টপ বক্স', value: 'SAMI - AKASH STB (আসন্ন)', desc: 'খুব শীঘ্রই আমাদের নিজস্ব ব্রান্ডের কো-ব্র্যান্ডেড সেট-টপ বক্স বাজারে আসবে।' },
                    { label: 'স্যাটেলাইট অরবিট ও নাম', value: 'Bangabandhu Satellite-1 (119.1° E)', desc: 'আমাদের বাংলাদেশের নিজস্ব টেলিকম স্যাটেলাইট সিগন্যাল।' },
                    { label: 'ট্রান্সমিশন ফ্রিকোয়েন্সি', value: 'Ku-Band (হাই ফ্রিকোয়েন্সি)', desc: 'উচ্চ ক্ষমতাসম্পন্ন Ku ব্যান্ড সিগন্যাল।' },
                    { label: 'রিসেপশন পদ্ধতি', value: 'DVB-S2 (ডিজিটাল ব্রডকাস্টিং)', desc: 'অত্যাধুনিক ২য় প্রজন্মের ভিডিও ক্যারিয়ার স্ট্যান্ডার্ড।' },
                    { label: 'পোলারাইজেশন', value: 'Vertical (ভার্টিকাল)', desc: 'ডিশ এরিয়া এলএনবি অ্যালাইনমেন্ট।' },
                    { label: 'ভিডিও কম্প্রেশন স্ট্যান্ডার্ড', value: 'H.264 / HEVC / MPEG-4', desc: 'ক্রিস্টাল ক্লিয়ার ডিজিটাল ডিকোড কোয়ালিটি।' },
                    { label: 'অডিও ট্রান্সমিশন মোড', value: 'AAC Stereo / DD+ Dual Channel', desc: 'ডিজিটাল সারাউন্ড সাউন্ড ইফেক্ট কোয়ালিটি।' },
                    { label: 'ভিডিও রেজোলিউশন', value: '1080i HD Res (High Definition)', desc: 'উচ্চ তরঙ্গের স্পষ্ট ছবির নিশ্চয়তা।' },
                  ].map((param, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100/50 transition-all border border-slate-100/80 group"
                    >
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{param.label}</div>
                      <div className="font-extrabold text-sm text-red-650 mt-1 select-all group-hover:text-red-700 transition-colors">{param.value}</div>
                      <div className="text-[11px] text-gray-500 font-bold mt-1.5 leading-relaxed">{param.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar technical details / information blocks */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-red-650 to-red-800 text-white p-7 rounded-2xl shadow-lg relative overflow-hidden group">
                  <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Globe size={160} />
                  </div>
                  <h3 className="text-lg font-black mb-3 flex items-center gap-2">
                    <ShieldCheck size={24} className="text-red-200" />
                    ১০০% ডিজিটাল ব্রডকাস্ট কোয়ালিটি
                  </h3>
                  <p className="text-red-50 text-xs sm:text-[13px] leading-relaxed mb-6 font-bold">
                    সামী টেলিভিশন সর্বাধুনিক সিগন্যাল অপ্টিমাইজার এনকোডিং ডিকোড পদ্ধতি ব্যবহার করছে, যা স্যাটেলাইটের মাধ্যমে সরাসরি কাস্টমারের রিসিভারে হাই ডেফিনিশন ছবির নিশ্চয়তা দেয়। এতে ঝিরিঝিরি কিংবা বাফারিং মুক্ত নিখুঁত ভিডিও পাওয়া যাবে।
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-xs font-black">
                    <CheckCircle2 size={14} className="text-green-300" /> ঝকঝকে ছবি ও স্পষ্ট শব্দ
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
                  <h3 className="text-base font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                    <Info size={18} className="text-red-650" />
                    গ্রাহক কুইক নোট
                  </h3>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">
                    সরাসরি আকাশ রিসিভারগুলোতে আমাদের সিগন্যাল টেস্ট হচ্ছে। যদি স্বয়ংক্রিয়ভাবে তালিকায় আমাদের খুঁজে না পান, তবে আকাশ ডিটিএইচ কুইক হটলাইনে <strong>১৬৪৪২</strong> নম্বরে কথা বলতে পারেন।
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 sm:p-8">
              <div className="max-w-3xl mx-auto mb-10 text-center">
                <h2 className="text-2xl font-black text-gray-900">রিসিভার এ কিভাবে সামী টিভি এড করবেন?</h2>
                <p className="text-sm font-bold text-gray-500 mt-2">
                  আপনার আকাশ ডিটিএইচ রিসিভারে (Akash DTH STB) রিমোট ব্যবহার করে খুব সহজে মাত্র কয়েকটি ক্লিকে চ্যানেল আপডেট করতে নিচের ধাপগুলো অনুসৃত করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {[
                  {
                    step: '০১',
                    title: 'রিসিভার অটো-স্ক্যান বা অন-অফ',
                    desc: 'প্রথমে আপনার আকাশ রিসিভার বক্সটি চালু রেখে রিমোটের সাহায্যে চ্যানেলটি সার্চ করুন। অনেক সময় রিসিভারটি একবার মেইন সুইচ বন্ধ করে অন করলেই নতুন চ্যামেল তালিকায় যুক্ত হয়ে যায়।'
                  },
                  {
                    step: '০২',
                    title: 'মেনু থিওরি ও কুইক অটো-টিউন',
                    desc: 'রিমোটের "Menu" চাপুন, এরপর Setup বা Installation অপশনে যান। পাসওয়ার্ড খুজিলে ডিফল্ট 0000 / 1234 চাপুন। এরপর "Auto-Scan" বা "Search New Channels" নির্বাচন করুন।'
                  },
                  {
                    step: '০৩',
                    title: 'সহজ উপভোগ ও চ্যানেল লক',
                    desc: 'স্কানিং সম্পূর্ণ হলে অটো সেভ হবে। এরপর আপনার রিমোটে পছন্দের তালিকায় সামী টিভি খুঁজে নিয়ে "Add to Favorite" দিন যাতে সবচেয়ে দ্রুত প্রথম দিকেই চ্যানেলটি পান।'
                  }
                ].map((item, index) => (
                  <div key={index} className="relative bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:border-red-500/20 hover:bg-white transition-all duration-300">
                    <div className="absolute top-4 right-6 text-4xl font-black text-red-650/10 group-hover:text-red-650/15 transition-colors font-mono">{item.step}</div>
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-black text-xs mb-4">
                      {index + 1}
                    </div>
                    <h3 className="font-black text-gray-900 border-b-2 border-slate-200/60 pb-2 mb-3 text-sm">{item.title}</h3>
                    <p className="text-xs sm:text-xs text-gray-500 leading-relaxed font-bold">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Quick Note about Official Branded Box */}
              <div className="mt-8 bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-red-650/20 text-red-500 flex items-center justify-center shrink-0">
                    <Tv size={26} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">🎁 অফিসিয়াল সামী আকাশ সেট-টপ বক্স (SAMI - AKASH STB)</h4>
                    <p className="text-[12px] text-slate-400 font-bold leading-relaxed mt-1">
                      আমাদের নিজস্ব ব্রান্ডের অফিসিয়াল সেট-টপ বক্সটি ব্যবহার করলে কোনো প্রকার ম্যানুয়াল টিউনিং বা ফ্রিকোয়েন্সি স্ক্রিন সেটআপের প্রয়োজন হবে না। বক্সটি প্লাগ-এন্ড-প্লে (Plug and Play) হিসেবে কনফিগার করা থাকবে, যাতে সংযোগ দেয়া মাত্রই স্বয়ংক্রিয়ভাবে এক ক্লিকে সামী টিভি সম্প্রচার দেখতে পারবেন।
                    </p>
                  </div>
                </div>
                <div className="shrink-0 bg-red-650 text-white font-black text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest">
                  শীঘ্রই উন্মোচন হচ্ছে
                </div>
              </div>

              {/* Troubleshooting warning info */}
              <div className="mt-6 bg-amber-50 rounded-2xl border border-amber-200/50 p-5 flex flex-col sm:flex-row items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-amber-900">ভিডিও আসতেছে না কিন্তু শব্দ আসতেছে?</h4>
                  <p className="text-[12px] text-amber-800 font-bold leading-relaxed mt-1">
                    অন-এয়ার কার্যক্রম চলাকালীন যদি আপনার আকাশ ডিটিএইচ টিভিতে ভিডিও দেখা না যায় কিন্তু সামী টিভির শব্দ ক্লিয়ার আসে, তবে আপনার আকাশ ডিটিএইচের এইচডিএমআই ক্যাবল ও রিসিভার আউটপুট রেজোলিউশন সেটিংটি চেক করুন। রেজোলিউশনটি 'Auto' বা '1080i HD' তে রাখাই বাঞ্ছনীয়।
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Interactive Pointing Calculator Box */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Compass size={22} className="text-red-650" />
                    ডিশ এন্টেনা অ্যালাইনমেন্ট ক্যালকুলেটর
                  </h2>
                  <p className="text-xs sm:text-xs text-gray-500 font-bold mt-1">
                    আপনার জেলা নির্বাচন করুন এবং আকাশ ডিটিএইচ ডিশ এন্টেনাটি বঙ্গবন্ধু স্যাটেলাইট-১ (১১৯.১° পূর্ব) এর দিকেpointing করার প্রয়োজনীয় কোণের মানসমূহ দেখে নিন।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-700 flex items-center gap-1">
                      <MapPin size={12} className="text-red-650" /> আপনার জেলা নির্বাচন করুন:
                    </label>
                    <select 
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-650 focus:bg-white transition-all"
                    >
                      {Object.keys(DISTRICT_DTH_DATA).map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-gray-700">ডিটিএইচ কাস্টম ডিশের সাইজ:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['45cm', '60cm', '90cm'].map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setDishSize(size)}
                          className={`text-xs py-2 font-black rounded-lg border transition-all ${
                            dishSize === size 
                              ? 'bg-red-650 text-white border-red-600 shadow-sm' 
                              : 'bg-slate-50 text-gray-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Calculations Dashboard */}
                <div className="bg-slate-900 rounded-2xl text-white p-6 relative overflow-hidden">
                  <div className="absolute right-4 bottom-2 opacity-5 pointer-events-none">
                    <Compass size={180} />
                  </div>

                  <span className="text-[9px] bg-red-600 text-white px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest">
                    Live Pointing Angle Estimates (Bangabandhu-1)
                  </span>

                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Azimuth Angle</span>
                      <div className="text-lg sm:text-xl font-black text-red-500 font-mono mt-1">
                        {DISTRICT_DTH_DATA[selectedDistrict]?.azimuth}°
                      </div>
                      <span className="text-[9px] text-slate-500 block mt-1 font-bold">Compass direction</span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Elevation Angle</span>
                      <div className="text-lg sm:text-xl font-black text-white font-mono mt-1">
                        {DISTRICT_DTH_DATA[selectedDistrict]?.elevation}°
                      </div>
                      <span className="text-[9px] text-slate-500 block mt-1 font-bold">Dish tilt up angle</span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">LNB Skew Angle</span>
                      <div className="text-lg sm:text-xl font-black text-teal-400 font-mono mt-1">
                        {DISTRICT_DTH_DATA[selectedDistrict]?.skew}°
                      </div>
                      <span className="text-[9px] text-slate-500 block mt-1 font-bold">LNB rotational skew</span>
                    </div>
                  </div>

                  <div className="mt-5 text-[11px] text-slate-400 flex items-start gap-2 border-t border-slate-800/85 pt-4 font-bold">
                    <Info size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <span>
                      *উপরিউক্ত হিসাবের সফল প্রাপ্তিতে সর্বোচ্চ সিগন্যাল কোয়ালিটি নিশ্চিত করার জন্য ৪৩-৪৬dBw কভারেজ এলাকায় <strong>{dishSize}</strong> ডিশ এন্টেনাই যথেষ্ট।
                    </span>
                  </div>
                </div>
              </div>

              {/* FeedBack reporting / Signal strength check submission form */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 sm:p-7">
                  <h3 className="font-black text-gray-900 text-base mb-2 flex items-center gap-1.5">
                    <Signal size={18} className="text-red-650" />
                    আপনার এলাকায় সিগন্যাল রিপোর্ট করুন
                  </h3>
                  <p className="text-[11px] text-gray-400 font-bold mb-4">
                    আপনার এলাকায় সামী টিভির ভিডিও বা সিগন্যাল কোয়ালিটি কেমন পাচ্ছেন তা নিয়ে কারিগরি মতামত দিন।
                  </p>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-4 font-bold">
                    <div className="space-y-1">
                      <label className="text-[11px] text-gray-600 block">আপনার নাম:</label>
                      <input 
                        required
                        type="text" 
                        value={feedbackForm.name}
                        onChange={(e) => setFeedbackForm({...feedbackForm, name: e.target.value})}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-650 focus:bg-white transition-all"
                        placeholder="উদা: আব্দুল করিম" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-gray-600 block">মোবাইল নম্বর:</label>
                      <input 
                        required
                        type="tel" 
                        value={feedbackForm.mobile}
                        onChange={(e) => setFeedbackForm({...feedbackForm, mobile: e.target.value})}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-650 focus:bg-white transition-all"
                        placeholder="উদা: 01xxxxxxxxx" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-gray-600 block">প্রাপ্ত সিগন্যাল কোয়ালিটি:</label>
                      <select 
                        value={feedbackForm.strength}
                        onChange={(e) => setFeedbackForm({...feedbackForm, strength: e.target.value})}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-650 focus:bg-white transition-all"
                      >
                        <option value="excellent">উৎকৃষ্ট ও ঝকঝকে (Excellent - 90%+)</option>
                        <option value="good">ভালো ও ক্লিয়ার (Good - 70%-90%)</option>
                        <option value="fair">চলনসই (Fair - 50%-70%)</option>
                        <option value="weak">দুর্বল ও বাফারিং হচ্ছে (Weak - Under 50%)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-gray-600 block">মতামত ও এলাকা (ঐচ্ছিক):</label>
                      <textarea 
                        rows={2}
                        value={feedbackForm.comments}
                        onChange={(e) => setFeedbackForm({...feedbackForm, comments: e.target.value})}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-650 focus:bg-white transition-all resize-none"
                        placeholder="আপনার জেলার নাম লিখুন..." 
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingFeedback}
                      className="w-full bg-red-650 text-white font-black py-2.5 rounded-lg text-xs hover:bg-red-700 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {submittingFeedback ? 'প্রেরণ করা হচ্ছে...' : 'রিপোর্ট সাবমিট করুন'} 
                      <Send size={12} />
                    </button>
                    
                    <AnimatePresence>
                      {feedbackSent && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-3 bg-green-50 text-green-700 rounded-lg text-xs font-black border border-green-200/50 mt-2 text-center"
                        >
                          ধন্যবাদ! আপনার এলাকায় সিগন্যাল রিপোর্ট সামী টিভি ব্রডকাস্ট টিমের কাছে প্রেরণ করা হয়েছে।
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Broadcast Hotline contact parameters below */}
      <div className="bg-slate-50 p-6 sm:p-10 rounded-2xl border border-slate-100 shadow-sm mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl font-black text-gray-900 font-sans">ব্রডকাস্ট অ্যান্ড কাস্টমার রিলেশন সাপোর্ট</h3>
            <p className="text-xs sm:text-[13px] text-gray-500 font-bold max-w-xl">
              যদি আপনার আকাশ ডিটিএইচ এ সামী টিভি সম্প্রচার দেখতে কোনো কারিগরি জটিলতা ঘটে, তবে সরাসরি আমাদের প্রধান সম্প্রচার রুমে ইমেইল অথবা মোবাইল যোগাযোগের মাধ্যমে সাহায্য নিতে পারেন।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 font-bold shrink-0">
            <a 
              href="tel:01912618994" 
              className="flex items-center gap-2 px-5 py-3 bg-red-650/10 text-red-600 rounded-xl hover:bg-red-650 hover:text-white transition-all text-xs border border-red-500/10 group"
            >
              <PhoneCall size={15} className="group-hover:animate-bounce" />
              <span>কল করুন: ০১৯১২৬১৮৯৯৪</span>
            </a>
            <a 
              href="mailto:info.samitv.bd@gmail.com" 
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-xs border border-slate-705 group"
            >
              <Mail size={15} className="group-hover:-translate-y-0.5 transition-transform" />
              <span>ইমেইল: info.samitv.bd@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
