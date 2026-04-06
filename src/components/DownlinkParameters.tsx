import React from 'react';
import { motion } from 'motion/react';
import { Radio, Signal, Globe, Satellite, Clock, Info, ShieldCheck, Zap, Cpu, Activity } from 'lucide-react';

export const DownlinkParameters: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto"
    >
      {/* Hero Section */}
      <div className="relative bg-sami-dark py-24 px-8 text-center overflow-hidden rounded-sm news-card-shadow mb-12 border-b-4 border-red-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sami-blue rounded-full blur-[120px] opacity-30 animate-pulse"></div>
        </div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-red-600/20 backdrop-blur-md px-4 py-1.5 rounded-full text-red-400 text-xs font-bold uppercase tracking-widest mb-8 border border-red-600/30"
          >
            <Satellite size={14} className="animate-bounce" /> ব্রডকাস্ট ইঞ্জিনিয়ারিং বিভাগ
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase italic">
            স্যাটেলাইট ডাউনলিংক <span className="text-red-600">প্যারামিটার</span>
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            সামী টিভি (SAMI TV) বঙ্গবন্ধু স্যাটেলাইট-১ এর মাধ্যমে নিরবিচ্ছিন্ন সম্প্রচারের জন্য প্রস্তুত হচ্ছে। কারিগরি তথ্যের জন্য আমাদের সাথেই থাকুন।
          </p>
        </div>
      </div>

      {/* Technical Specs Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white rounded-sm news-card-shadow overflow-hidden border border-gray-100">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Activity size={18} className="text-sami-blue" /> টেকনিক্যাল স্পেসিফিকেশন
            </h2>
            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold uppercase">Pending Verification</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                  <th className="px-6 py-4">প্যারামিটার</th>
                  <th className="px-6 py-4">মান (Value)</th>
                  <th className="px-6 py-4">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { label: 'স্যাটেলাইট নাম', value: 'Bangabandhu Satellite-1 (BS-1)', status: 'Confirmed' },
                  { label: 'অরবিটাল পজিশন', value: '119.1° East', status: 'Confirmed' },
                  { label: 'ডাউনলিংক ফ্রিকোয়েন্সি', value: 'TBA (To Be Announced)', status: 'Processing' },
                  { label: 'পোলারাইজেশন', value: 'Horizontal / Vertical', status: 'Testing' },
                  { label: 'সিম্বল রেট', value: 'TBA', status: 'Processing' },
                  { label: 'মড্যুলেশন', value: 'DVB-S2, 8PSK', status: 'Testing' },
                  { label: 'ভিডিও ফরম্যাট', value: 'MPEG-4 / H.264', status: 'Confirmed' },
                  { label: 'রেজোলিউশন', value: '1080i (Full HD)', status: 'Confirmed' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{row.label}</td>
                    <td className="px-6 py-4 text-sm font-mono text-sami-blue">{row.value}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        row.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                        row.status === 'Testing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-sami-blue text-white p-8 rounded-sm news-card-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Zap size={120} />
            </div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Cpu size={24} /> ডিজিটাল সিগন্যাল
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              আমরা অত্যাধুনিক ডিজিটাল সিগন্যাল প্রসেসিং প্রযুক্তি ব্যবহার করছি যা প্রতিকূল আবহাওয়ায়ও নিরবিচ্ছিন্ন সম্প্রচার নিশ্চিত করবে।
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 w-fit px-3 py-1 rounded">
              <ShieldCheck size={12} /> High Availability
            </div>
          </div>

          <div className="bg-white p-8 rounded-sm news-card-shadow border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info size={20} className="text-red-600" /> কেবল অপারেটরদের জন্য
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              আপনার কেবল নেটওয়ার্কে সামী টিভি যুক্ত করতে আমাদের টেকনিক্যাল টিমের সাথে যোগাযোগ করুন। 
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sami-blue">
                  <Activity size={16} />
                </div>
                01912618994
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sami-blue">
                  <Globe size={16} />
                </div>
                info@samitv.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Map Placeholder */}
      <div className="bg-white p-10 rounded-sm news-card-shadow border border-gray-100 mb-12 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">স্যাটেলাইট কভারেজ এরিয়া</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              বঙ্গবন্ধু স্যাটেলাইট-১ এর মাধ্যমে আমরা সমগ্র বাংলাদেশ ছাড়াও ভারত, নেপাল, ভুটান, শ্রীলঙ্কা এবং দক্ষিণ এশিয়ার বিভিন্ন দেশে আমাদের সম্প্রচার পৌঁছে দিচ্ছি। আমাদের সিগন্যাল কভারেজ ম্যাপ শীঘ্রই এখানে প্রকাশ করা হবে।
            </p>
            <div className="flex flex-wrap gap-3">
              {['বাংলাদেশ', 'ভারত', 'নেপাল', 'ভুটান', 'শ্রীলঙ্কা'].map(country => (
                <span key={country} className="px-4 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-full border border-gray-100">
                  {country}
                </span>
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 group">
            <div className="text-center group-hover:scale-110 transition-transform duration-500">
              <Globe size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Map Loading...</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
