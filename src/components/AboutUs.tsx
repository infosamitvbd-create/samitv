import React from 'react';
import { motion } from 'motion/react';
import { Award, Target, Users, Quote, Facebook, Mail, ShieldCheck, Zap, Globe, History, Radio, Cpu, Calendar, CheckCircle2 } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-gray-50/50 min-h-screen font-sans text-gray-800"
    >
      {/* 1. Sleek, Premium Hero Banner with Logo Integration */}
      <section className="relative py-24 md:py-36 bg-gray-950 overflow-hidden border-b border-white/5">
        {/* Subtle background image overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1495020689067-958852a7735e?auto=format&fit=crop&q=80&w=2070" 
            alt="Newsroom Background" 
            className="w-full h-full object-cover grayscale opacity-25 scale-102"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/95 via-gray-950/80 to-gray-950"></div>
          {/* Elegant Tech Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#80a0a00a_1px,transparent_1px)] bg-[size:16px_28px] pointer-events-none" />
        </div>
        
        <div className="container mx-auto max-w-5xl px-6 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Logo Badge */}
            <div className="relative mb-6 p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl flex items-center justify-center">
              <img 
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFj9Vggz6K8alsU_HhjhzliEjiij0iQBXBHM8ZPRIMET8EjAd3_ebQcFGWGplZCq0LB0gWXmmRaa7MGS5qvVI1Qui8Y50J92sgykRMhdCJMgDnQJShoY6OW9ULSgHYWYA5Lhm4OcXzdN1VvsTcDYdV82Hlwxg7anOL6r1bdhtmnebJsQCQih6uKeVHPUbY/s1068/NEW%20LOGO.png" 
                alt="Sami TV Logo" 
                className="h-16 md:h-20 object-contain drop-shadow-[0_8px_16px_rgba(217,43,43,0.3)]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="inline-flex items-center gap-2 bg-[#D92B2B]/10 border border-[#D92B2B]/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-[#D92B2B] mb-4">
              <Radio size={12} className="animate-pulse" /> Established Since 2010
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none uppercase">
              SAMI <span className="text-[#D92B2B]">TELEVISION</span>
            </h1>
            
            <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed font-sans pt-3">
              বস্তুনিষ্ঠ ও দায়িত্বশীল সাংবাদিকতা এবং আধুনিক সম্প্রচার প্রযুক্তির মিলনে এক যুগেরও বেশি সময় ধরে দর্শকদের বিশ্বস্ত তথ্যচিত্র।
            </p>
          </motion.div>

          {/* Elegant Stats Segment */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t border-white/10"
          >
            <div className="text-center group">
              <span className="block text-2xl md:text-4xl font-black text-white group-hover:text-[#D92B2B] transition-colors">১২৫কে+</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-extrabold mt-1.5 block">অনলাইন ফলোয়ার</span>
            </div>
            <div className="text-center group">
              <span className="block text-2xl md:text-4xl font-black text-[#D92B2B] pointer-events-none">৫০০+</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-extrabold mt-1.5 block">সক্রিয় সংবাদকর্মী</span>
            </div>
            <div className="text-center group">
              <span className="block text-2xl md:text-4xl font-black text-white group-hover:text-[#D92B2B] transition-colors">২৪/৭</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-extrabold mt-1.5 block">লাইভ সম্প্রচার</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Legacy Journey Details */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Visual Left Block */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-5 relative"
            >
              <div className="rounded-2xl overflow-hidden border border-gray-150 shadow-md relative aspect-[4/5] bg-slate-50">
                <img 
                  src="https://images.unsplash.com/photo-1579275542618-a1dfed5f54ba?auto=format&fit=crop&q=80&w=1287" 
                  alt="Journalism Legacy" 
                  className="w-full h-full object-cover grayscale brightness-95" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 text-white">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#D92B2B] block mb-1">JOURNALISM OF INTEGRITY</span>
                  <span className="text-xs font-bold font-sans text-gray-300">১১ নভেম্বর ২০১০ থেকে শুরু হওয়া এক অন্তহীন যাত্রা</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-red-500/5 rounded-2xl -z-10 border border-[#D92B2B]/10"></div>
            </motion.div>

            {/* Explanatory Right Block */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-7 space-y-6"
            >
              <div className="flex items-center gap-2 text-[#D92B2B]">
                <History className="shrink-0" size={16} />
                <span className="font-extrabold text-[11px] uppercase tracking-widest">Our Legacy</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                আমাদের <span className="text-[#D92B2B]">পথচলা ও ইতিহাস</span>
              </h2>
              
              <div className="space-y-4 text-[15px] text-gray-600 font-bold leading-relaxed font-sans">
                <p>
                  SAMI TV একটি বেসরকারি মালিকানাধীন বাংলাদেশি বাংলা ভাষার টেলিভিশন চ্যানেল, যা ১১ নভেম্বর ২০১০ সালে যাত্রা শুরু করে। চ্যানেলটির প্রধান কার্যালয় জামালপুর, ময়মনসিংহে অবস্থিত। যাত্রালগ্ন থেকেই সামী টিভি সত্যনিষ্ঠ, দায়িত্বশীল ও সময়োপযোগী সংবাদ পরিবেশনের মাধ্যমে দর্শকদের আস্থা অর্জন করে চলেছে।
                </p>
                <p>
                  সংবাদ ও তথ্যভিত্তিক অনুষ্ঠানের পাশাপাশি বিনোদন, নাটক, টক শো, সঙ্গীত এবং সাংস্কৃতিক অনুষ্ঠান সম্প্রচার করে থাকে। আমাদের লক্ষ্য হলো দেশের ও বিশ্বের গুরুত্বপূর্ণ ঘটনা দ্রুত, নির্ভুল ও নিরপেক্ষভাবে দর্শকদের সামনে তুলে ধরা এবং একই সঙ্গে বাংলা সংস্কৃতি ও ঐতিহ্যকে সমুন্নত রাখা।
                </p>
              </div>

              {/* Verified badges */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#D92B2B] shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-gray-700">নিরপেক্ষ সংবাদ বিশ্লেষণ</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#D92B2B] shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-gray-700">ডিজিটাল ও লাইভ ব্রডকাস্ট</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Leadership Chairman Abul Kashem Section */}
      <section className="py-20 bg-slate-55 border-y border-gray-200/60 relative">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center mb-16 space-y-2">
            <span className="text-[#D92B2B] text-[10px] font-black uppercase tracking-[0.2em] block">Board of Directors</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-950 tracking-tight">আমাদের <span className="text-[#D92B2B]">অভিভাবক</span></h2>
            <p className="text-gray-400 text-xs font-bold font-sans">সামী টিভির মূল চালিকাশক্তি ও স্বপ্নদ্রষ্টা</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ y: 25, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-150 shadow-[0_5px_24px_rgba(0,0,0,0.015)] relative group overflow-hidden"
            >
              {/* Overlay accent */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D92B2B]"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                {/* Image block */}
                <div className="relative shrink-0 w-44 h-56 rounded-xl overflow-hidden border border-gray-150 shadow-sm bg-gray-100">
                  <img 
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQIlNZaI7KugfIRmOXvHPu4i_B9xUhdTeG8JBDSYRlRQxJEJNhUWxdQUnWvTfJFCxvDnF9D3oiZtlJcYksYnrJPdGon084dAjJ38JQFjWj0iyFc8Ed-4zaELMmQk27qfCHswas0Rh5hfEvoZrlz6BQwcaWTvXnnByRZPjfSWpOcbtnlT2OthhwDgVN1lgE/s320/645363491_979533377908521_7060082878587727711_n.jpg" 
                    alt="Md. Abul Kashem" 
                    className="w-full h-full object-cover scale-101 group-hover:scale-103 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute bottom-2 left-2 bg-gray-950/80 text-white backdrop-blur-md px-2 py-1 rounded text-[9px] font-black">
                    CHAIRMAN
                  </div>
                </div>

                {/* Info block */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#D92B2B] tracking-widest uppercase bg-red-50 border border-red-100/40 px-2.5 py-1 rounded">CHAIRMAN & PATRON</span>
                    <h3 className="text-2xl md:text-3xl font-black text-gray-950 mt-2 tracking-tight">Md. Abul Kashem</h3>
                    <p className="text-gray-400 text-xs font-bold mt-1 font-sans">চেয়ারম্যান, সামী টিভি গ্রুপ</p>
                  </div>
                  
                  <blockquote className="relative">
                    <Quote className="absolute -top-3 -left-3 text-red-500/10 w-8 h-8 pointer-events-none" />
                    <p className="font-serif text-[15.5px] italic text-gray-600 leading-relaxed font-sans relative z-10 pl-2">
                      "সামী টেলিভিশনের স্বপ্নদ্রষ্টা এবং অভিভাবক। তাঁর বলিষ্ঠ নেতৃত্বে আমরা গত এক যুগেরও বেশি সময় ধরে বস্তুনিষ্ঠ সাংবাদিকতার পথে নিরবিচ্ছিন্নভাবে এগিয়ে চলেছি।"
                    </p>
                  </blockquote>
                  
                  <div className="flex justify-center md:justify-start gap-3 pt-2">
                    <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#D92B2B] hover:text-white border border-gray-150 hover:border-transparent transition-all"><Facebook size={14} /></a>
                    <a href="mailto:info.samitv.bd@gmail.com" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#D92B2B] hover:text-white border border-gray-150 hover:border-transparent transition-all"><Mail size={14} /></a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Core Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center mb-16 space-y-2">
            <span className="text-[#D92B2B] text-[10px] font-black uppercase tracking-[0.2em] block">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-950 tracking-tight">আমাদের <span className="text-[#D92B2B]">মূল আদর্শ</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50/50 border border-gray-150 rounded-2xl hover:border-red-200 hover:bg-white hover:shadow-[0_8px_32px_rgba(217,43,43,0.03)] transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
                <Zap className="text-[#D92B2B]" size={22} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">সাংবাদিকতার সততা</h3>
              <p className="text-gray-500 text-sm font-bold font-sans leading-relaxed">SAMI TV বিশ্বাস করে—গণমাধ্যম শুধু তথ্য দেওয়ার মাধ্যম নয়, বরং সমাজের ইতিবাচক কাঠামোগত পরিবর্তনের একটি শক্তিশালী হাতিয়ার।</p>
            </div>

            <div className="p-6 bg-gray-50/50 border border-gray-150 rounded-2xl hover:border-red-200 hover:bg-white hover:shadow-[0_8px_32px_rgba(217,43,43,0.03)] transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <Award className="text-emerald-500" size={22} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">সাফল্য ও নির্ভরযোগ্যতা</h3>
              <p className="text-gray-500 text-sm font-bold font-sans leading-relaxed">অল্প সময়ের ব্যবধানে জামালপুরসহ সারাদেশে সত্যনিষ্ঠ ও নির্ভীক সংবাদ প্রচারের ধারা বজায় রেখে একটি প্রথম সারির ডিজিটাল প্ল্যাটফর্ম হিসেবে সম্মানিত।</p>
            </div>

            <div className="p-6 bg-gray-50/50 border border-gray-150 rounded-2xl hover:border-red-200 hover:bg-white hover:shadow-[0_8px_32px_rgba(217,43,43,0.03)] transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <Cpu className="text-blue-500" size={22} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">কারিগরি এক্সিলেন্স</h3>
              <p className="text-gray-500 text-sm font-bold font-sans leading-relaxed">উন্নত কারিগরি ও গতিশীল সম্প্রচার মাধ্যমে তাৎক্ষণিক ব্রেকিং সহ দেশ-বিদেশের প্রতিটি সংবাদ দ্রুততম সময়ের মধ্যে নিখুঁতভাবে উপস্থাপনে সর্বদা প্রতিশ্রুতিবদ্ধ।</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Editorial Vision Statement (Premium Banner Overlay) */}
      <section className="py-24 bg-gray-950 overflow-hidden relative text-white border-y border-white/5">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D92B2B]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto max-w-4xl px-6 text-center space-y-6 relative z-10">
          <Quote size={40} className="text-[#D92B2B]/40 mx-auto" />
          <h3 className="font-serif text-lg md:text-2xl italic text-gray-200 leading-relaxed font-sans max-w-3xl mx-auto">
            "দেশ-বিদেশের সংবাদ নির্ভুল ও বস্তুনিষ্ঠভাবে প্রকাশ করে সামী টিভি। সাংবাদিকতার সর্বজনীন নীতি মেনে পক্ষপাতহীন সংবাদ সংগ্রহ ও প্রচারে আমরা চিরকাল অঙ্গীকারবদ্ধ। সমাজের প্রতিটি কোণের ইতিবাচক ঘটনা ও মানুষের কথা তুলে ধরাই আমাদের প্রধান নৈতিক দায়িত্ব।"
          </h3>
          <div className="pt-4 border-t border-dashed border-white/10 w-24 mx-auto"></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D92B2B]">SAMI TV Editorial Board</p>
            <h5 className="text-[15px] font-black text-white mt-1">সম্পাদকীয় পর্ষদ, সামী টিভি</h5>
          </div>
        </div>
      </section>

      {/* 6. Contact Grid Section */}
      <section className="py-20 bg-gray-50/20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="bg-white border border-gray-150 rounded-2xl p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none">
              <Mail size={160} className="text-[#D92B2B]" />
            </div>
            
            <div className="relative z-10 text-center md:text-left space-y-4 max-w-lg">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D92B2B] bg-red-50 border border-red-100/50 px-2 py-0.5 rounded">CONNECT WITH US</span>
              <h2 className="text-3xl font-black text-gray-950 tracking-tight leading-none mt-2">আমাদের সাথে <span className="text-[#D92B2B]">যোগাযোগ</span> করুন</h2>
              <p className="text-gray-500 font-bold text-sm md:text-base font-sans leading-relaxed">বস্তুনিষ্ঠ ও দায়িত্বশীল খবরের সহযাত্রী হিসেবে বিজ্ঞাপন বা যেকোনো তথ্যের জন্য লিখুন অথবা যোগ দিন।</p>
              
              <div className="space-y-4 pt-4 text-left text-sm font-sans font-bold text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                    <Mail size={14} className="text-[#D92B2B]" />
                  </div>
                  <span>info.samitv.bd@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                    <Globe size={14} className="text-[#D92B2B]" />
                  </div>
                  <span>www.samitvbd.com</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 w-full md:w-auto flex flex-col items-center justify-center">
              <div className="bg-gray-950 border border-white/5 p-6 rounded-2xl text-center w-64 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#D92B2B]/10 rounded-full blur-xl pointer-events-none"></div>
                <span className="text-[9px] uppercase tracking-widest text-[#D92B2B] font-black block">Corporate Helpline</span>
                <span className="text-lg font-black text-white mt-2 block tracking-tight">COMING SOON</span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-1 block">হটলাইন চালু হচ্ছে দ্রুত</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};


const LogoMinimal: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M20 20h60v60H20zM35 35h30v30H35z" />
  </svg>
);
