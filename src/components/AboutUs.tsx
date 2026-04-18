import React from 'react';
import { motion } from 'motion/react';
import { Award, Target, Users, Quote, Facebook, Twitter, Linkedin, Mail, ShieldCheck, Zap, Globe, History, Radio, Cpu } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-[#fafafa] min-h-screen font-sans"
    >
      {/* 1. Ultra-Premium Immersive Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center bg-sami-dark overflow-hidden">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1495020689067-958852a7735e?auto=format&fit=crop&q=80&w=2070" 
              alt="Newsroom Background" 
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-sami-dark via-sami-dark/80 to-transparent"></div>
          
          {/* Decorative Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        </div>
        
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-[1px] bg-sami-red"></span>
                <span className="text-sami-red font-eng font-black uppercase tracking-[0.5em] text-[10px]">Since 2014</span>
              </div>
              <h1 className="text-6xl md:text-9xl font-display font-black text-white mb-8 tracking-tighter leading-[0.85]">
                SAMI<br />
                <span className="text-sami-red">TELEVISION</span>
              </h1>
              <p className="text-gray-400 max-w-xl text-xl md:text-2xl font-medium leading-relaxed mb-12 border-l-4 border-sami-red/30 pl-8">
                বস্তুনিষ্ঠ সাংবাদিকতা এবং আধুনিক প্রযুক্তির সমন্বয়ে সামি টিভিকে এগিয়ে নিয়ে যাচ্ছেন আমাদের দক্ষ নেতৃত্ব।
              </p>
              
              <div className="flex flex-wrap gap-12 mt-16">
                <div className="flex flex-col">
                  <span className="text-4xl font-display font-black text-white">125K+</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">Global Followers</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-display font-black text-white">500+</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">Reporters Nationwide</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-display font-black text-white">24/7</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">Live Broadcasting</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[10px] uppercase tracking-widest text-white font-bold">Explore</span>
          <div className="w-[1px] h-12 bg-white"></div>
        </motion.div>
      </section>

      {/* 2. Asymmetric Split History Section */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 rounded-[40px] overflow-hidden shadow-3xl">
                <img src="https://images.unsplash.com/photo-1579275542618-a1dfed5f54ba?auto=format&fit=crop&q=80&w=1287" alt="History" className="w-full aspect-[4/5] object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-sami-red rounded-3xl -z-10 rotate-6 hidden md:block"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-sami-blue/10 rounded-full blur-2xl -z-10"></div>
              
              {/* Year Badge */}
              <div className="absolute top-12 left-0 -translate-x-1/2 bg-white p-8 rounded-full shadow-2xl z-20 hidden lg:flex items-center justify-center flex-col">
                <span className="text-4xl font-display font-black text-sami-red">10</span>
                <span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold mt-1">Years Excellence</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <History className="text-sami-red" size={20} />
                <span className="text-sami-red font-eng font-black uppercase tracking-widest text-xs">Our Journey</span>
              </div>
              <h2 className="text-5xl font-display font-black text-gray-900 mb-8 uppercase tracking-tighter leading-none">
                একটি স্বপ্নের <br /> <span className="text-sami-red underline decoration-wavy decoration-sami-red/20 underline-offset-8">পথচলা</span>
              </h2>
              <div className="space-y-8 text-lg text-gray-600 leading-relaxed font-medium">
                <p>২০১৪ সাল থেকে সামি টেলিভিশন নিয়মিতভাবে সম্প্রচার (On Air) কার্যক্রম চালিয়ে আসছে। একটি সাহসী স্বপ্ন থেকে শুরু করে আজ বাংলাদেশের অন্যতম আধুনিক এবং নির্ভরযোগ্য সংবাদ মাধ্যমে পরিণত হয়েছে সামি টিভি। আমরা জন্মলগ্ন থেকেই চেয়েছি মানুষের দোরগোড়ায় নির্ভুল এবং সঠিক তথ্য পৌঁছে দিতে।</p>
                <p>প্রযুক্তি এবং সৃজনশীলতার মেলবন্ধন ঘটিয়ে আমরা প্রতিনিয়ত নিজেদের ছাড়িয়ে যাওয়ার চেষ্টা করি। আমাদের ৫ শতাধিক প্রতিনিধি দেশজুড়ে নিবেদিত প্রাণ হয়ে কাজ করে যাচ্ছেন।</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                  <Radio className="text-sami-blue mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">ব্রডকাস্ট এক্সিলেন্স</h4>
                  <p className="text-xs text-gray-500">উন্নত স্যাটেলাইট প্রযুক্তির মাধ্যমে নির্বিঘ্ন সেবা।</p>
                </div>
                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                  <Cpu className="text-sami-red mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">ডিজিটাল ফার্স্ট</h4>
                  <p className="text-xs text-gray-500">সোশ্যাল মিডিয়া এবং ওয়েবে দ্রুততম সংবাদ প্রচার।</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Leadership Redefined: Bold Minimalism */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-24">
            <span className="text-sami-red font-eng font-black uppercase tracking-[0.5em] text-[10px] mb-4 block">Executive Board</span>
            <h2 className="text-6xl font-display font-black text-gray-900 uppercase tracking-tighter">আমাদের <span className="text-sami-red">কর্ণধার</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[
              {
                name: "Md. Abul Kashem",
                role: "Chairman",
                img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQIlNZaI7KugfIRmOXvHPu4i_B9xUhdTeG8JBDSYRlRQxJEJNhUWxdQUnWvTfJFCxvDnF9D3oiZtlJcYksYnrJPdGon084dAjJ38JQFjWj0iyFc8Ed-4zaELMmQk27qfCHswas0Rh5hfEvoZrlz6BQwcaWTvXnnByRZPjfSWpOcbtnlT2OthhwDgVN1lgE/s320/645363491_979533377908521_7060082878587727711_n.jpg",
                quote: "সামি টেলিভিশনের স্বপ্নদ্রষ্টা এবং অভিভাবক। তাঁর বলিষ্ঠ নেতৃত্বে আমরা বস্তুনিষ্ঠ সাংবাদিকতার পথে এগিয়ে চলেছি।",
                color: "sami-red",
                icon: <Award size={32} />
              },
              {
                name: "Emran Hasan Sami",
                role: "Managing Director",
                img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgjVlW6FgrzRXXO0p0T_dpOUIYEoFxOB347KnDys4clH-LxgfPLiHHGbp49da2QV6XuOnATrk4HzEtHqEKwzfNPHvR5QwiaB-ML7zgOplLW7Ajz12gXuftT0oKofsXu4pfI74gOPr88xVZ_Si7X7wdimSxOgt17QKgCy6vzSXJfm6j7qGs7WXYd2hRcVzlj/s320/656002480_970541098659349_900311477486710105_n.jpg",
                quote: "তরুণ ও উদ্যমী নেতৃত্ব। সামি টেলিভিশনের আধুনিকায়ন এবং প্রযুক্তিগত উৎকর্ষ সাধনে তাঁর ভূমিকা অপরিসীম।",
                color: "sami-blue",
                icon: <Target size={32} />
              }
            ].map((leader, i) => (
              <motion.div 
                key={i}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white rounded-[40px] p-4 shadow-xl shadow-gray-200/50 group"
              >
                <div className="flex flex-col md:flex-row items-center gap-10 p-6">
                  <div className="relative shrink-0 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl">
                    <img src={leader.img} alt={leader.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className={`absolute inset-0 bg-${leader.color}/20 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  </div>
                  <div className="flex-1">
                    <div className={`text-${leader.color} mb-4`}>{leader.icon}</div>
                    <span className="text-[10px] font-eng font-black uppercase tracking-[0.3em] text-gray-400 block mb-2">{leader.role}</span>
                    <h3 className="text-3xl font-display font-black text-gray-900 mb-6 tracking-tight leading-none">{leader.name}</h3>
                    <p className="font-serif text-lg italic text-gray-600 leading-relaxed mb-8">"{leader.quote}"</p>
                    <div className="flex gap-4">
                      <a href="#" className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-sami-dark hover:text-white transition-all"><Facebook size={20} /></a>
                      <a href="#" className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-sami-dark hover:text-white transition-all"><Twitter size={20} /></a>
                      <a href="#" className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-sami-dark hover:text-white transition-all"><Mail size={20} /></a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Asymmetric Bento Grid Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[300px] gap-6">
            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-8 md:row-span-2 bg-sami-dark rounded-[40px] p-16 text-white overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                <Globe size={300} />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <span className="text-sami-red font-eng font-black uppercase tracking-widest text-xs mb-6 block">Future Ready</span>
                  <h3 className="text-6xl font-display font-black mb-8 tracking-tighter uppercase leading-[0.9]">আমাদের <span className="text-sami-red">লক্ষ্য</span></h3>
                  <p className="text-2xl text-gray-400 leading-relaxed max-w-2xl font-medium">
                    বস্তুনিষ্ঠ সংবাদ পরিবেশনের মাধ্যমে সমাজের দর্পণ হিসেবে কাজ করা এবং মানুষের তথ্য অধিকার নিশ্চিত করা। আধুনিক প্রযুক্তির সর্বোচ্চ ব্যবহারের মাধ্যমে আমরা প্রতিটি সংবাদের গভীর পর্যন্ত পৌঁছে যেতে চাই।
                  </p>
                </div>
                <div className="flex items-center gap-6 pt-12">
                   <div className="flex -space-x-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-14 h-14 rounded-full border-4 border-sami-dark bg-gray-800 overflow-hidden">
                        <img src={`https://picsum.photos/seed/face${i+20}/100/100`} alt="" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xl font-display font-black text-white">1,25,000+</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Community Members</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-4 bg-sami-red rounded-[40px] p-10 text-white relative overflow-hidden group cursor-pointer"
            >
              <Zap size={40} className="mb-6" />
              <h4 className="text-4xl font-display font-black mb-4 uppercase tracking-tighter">সততা</h4>
              <p className="text-red-100 text-lg font-medium leading-relaxed">নিরপেক্ষ সাংবাদিকতার মূল স্তম্ভ। আমরা কোনো দল বা গোষ্ঠীর পক্ষপাত করি না।</p>
              <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <ShieldCheck size={200} />
              </div>
            </motion.div>

            <motion.div 
               whileHover={{ scale: 1.02 }}
               className="md:col-span-4 bg-sami-blue rounded-[40px] p-10 text-white relative overflow-hidden group cursor-pointer"
            >
              <Award size={40} className="mb-6" />
              <h4 className="text-4xl font-display font-black mb-4 uppercase tracking-tighter">সাফল্য</h4>
              <p className="text-blue-100 text-lg font-medium leading-relaxed">অল্প সময়েই জামালপুরসহ সারাদেশে বিশ্বস্ত নিউজ পোর্টাল হিসেবে প্রতিষ্ঠিত।</p>
              <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <Target size={200} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Immersive Glassmorphism Founders Message */}
      <section className="py-32 relative">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2069" alt="" className="w-full h-full object-cover grayscale opacity-10" />
        </div>
        
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="bg-white/70 backdrop-blur-3xl rounded-[60px] p-12 lg:p-24 border border-white/50 shadow-2xl relative overflow-hidden">
             <div className="max-w-4xl mx-auto text-center">
                <Quote size={80} className="text-sami-red/20 mx-auto mb-12" />
                <h3 className="font-serif text-3xl md:text-5xl italic text-gray-800 leading-[1.5] mb-16">
                  "দেশ-বিদেশের সংবাদ নির্ভুল ও বস্তুনিষ্ঠভাবে প্রকাশ করে সামী টিভি। সাংবাদিকতার নীতি মেনে সংবাদ সংগ্রহ ও প্রচারে বিশ্বাসী আমরা। এতে কোনো দল, গোষ্ঠী বা মতবাদের প্রতি পক্ষপাত করা হয় না। খবরের ভেতরের খবর ও বিশ্লেষণে সর্বোচ্চ উৎকর্ষতা বজায় রাখার চেষ্টা করে সামী টিভি।"
                </h3>
                
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl mb-6 rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer p-1 bg-white">
                    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgjVlW6FgrzRXXO0p0T_dpOUIYEoFxOB347KnDys4clH-LxgfPLiHHGbp49da2QV6XuOnATrk4HzEtHqEKwzfNPHvR5QwiaB-ML7zgOplLW7Ajz12gXuftT0oKofsXu4pfI74gOPr88xVZ_Si7X7wdimSxOgt17QKgCy6vzSXJfm6j7qGs7WXYd2hRcVzlj/s320/656002480_970541098659349_900311477486710105_n.jpg" alt="Founder" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                  </div>
                  <h5 className="text-2xl font-display font-black text-gray-900 tracking-tight">Emran Hasan Sami</h5>
                  <p className="text-sami-red font-bold text-sm mt-1">প্রতিষ্ঠাতা ও ম্যানেজিং ডিরেক্টর, সামি টিভি</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Contact/CTA Section: Bold & Direct */}
      <section className="pb-32">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="bg-sami-red rounded-[40px] p-12 lg:p-24 text-white flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Mail size={120} />
            </div>
            <div className="relative z-10 lg:max-w-xl">
              <h2 className="text-5xl md:text-6xl font-display font-black mb-4 tracking-tighter uppercase leading-[0.9]">আমাদের সাথে <br /><span className="text-sami-dark">যোগাযোগ</span> করুন</h2>
              <p className="text-red-100 text-xl font-medium mb-8">বস্তুনিষ্ঠ সাংবাদিকতায় আমাদের সহযাত্রী হোন।</p>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-sami-dark/20 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-red-200 font-bold">Email</p>
                    <p className="text-lg font-bold font-eng">info.samitv.bd@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-sami-dark/20 flex items-center justify-center shrink-0">
                    <History size={20} className="rotate-90" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-red-200 font-bold">Phone</p>
                    <p className="text-lg font-bold font-eng">01912618994</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 w-full lg:w-auto h-full flex flex-col items-center lg:items-end justify-center">
              <div className="bg-sami-dark p-8 rounded-[32px] text-center border border-white/10 shadow-2xl mb-8 w-full lg:w-64">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black mb-2">Advertisements</p>
                <h4 className="text-xl font-display font-black text-sami-red leading-none mb-1">HOTLINE</h4>
                <p className="text-xs font-bold text-white uppercase tracking-widest">COMING SOON</p>
              </div>
              <button className="bg-white text-sami-red px-12 py-6 rounded-full font-display font-black text-xl hover:bg-sami-dark hover:text-white transition-all shadow-2xl scale-110">
                যোগাযোগ করুন
              </button>
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
