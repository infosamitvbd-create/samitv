import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, User, Phone, Mail, Filter, ChevronRight, Users, Search, Globe, X, Send, CheckCircle, Upload, Clock, Briefcase, Calendar, Shield, Zap, Sparkles, Flame, Tv } from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const divisions = ['সব', 'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

export const OurFamily: React.FC = () => {
  const [reporters, setReporters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState('সব');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Convert numbers to Bengali
  const convertToBn = (text: string | number): string => {
    const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return text.toString().replace(/\d/g, (d) => bnNums[parseInt(d)]);
  };

  // Convert joining date to Bengali format
  const getBnDate = (createdAt?: any) => {
    if (!createdAt) return '১৮ মে, ২০২৩';
    const date = createdAt.seconds ? new Date(createdAt.seconds * 1000) : new Date(0);
    if (date.getTime() === 0) return '১৮ মে, ২০২৩';
    return date.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Application Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [appForm, setAppForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    division: 'ঢাকা',
    experience: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'reporters'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReporters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Reporters Firestore Error: ", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = '';
      if (imageFile) {
        const fileRef = ref(storage, `applications/${Date.now()}_${imageFile.name}`);
        await uploadBytes(fileRef, imageFile);
        finalImageUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, 'applications'), {
        ...appForm,
        imageUrl: finalImageUrl,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setShowModal(false);
        setAppForm({ name: '', phone: '', email: '', location: '', division: 'ঢাকা', experience: '', imageUrl: '' });
        setImageFile(null);
      }, 3000);
    } catch (error) {
      console.error("Application Error: ", error);
      alert('দুঃখিত, আবেদনটি পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReporters = reporters.filter(rep => {
    const matchesDivision = selectedDivision === 'সব' || rep.division === selectedDivision;
    const matchesSearch = rep.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         rep.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rep.designation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDivision && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#07090e] bg-gradient-to-b from-[#0e1224] via-[#07090e] to-[#040508] text-white overflow-hidden relative font-sans">
      
      {/* 3D Global Lighting Effects */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-[#D92B2B]/5 rounded-full blur-[160px] pointer-events-none select-none"></div>
      <div className="absolute bottom-1/4 right-10 w-[45%] h-[45%] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none select-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[30%] h-[30%] bg-amber-500/3 rounded-full blur-[140px] pointer-events-none select-none"></div>

      {/* Cybernetic Grid Overlay for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none select-none"></div>

      {/* Interactive Application Modal (Frosted Glass holographic console) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setShowModal(false)}
              className="absolute inset-0 bg-[#000]/70 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30, rotateX: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative bg-slate-900/90 border border-white/10 w-full max-w-2xl rounded-3xl shadow-[0_30px_100px-10px_rgba(217,43,43,0.15)] overflow-hidden max-h-[90vh] flex flex-col backdrop-blur-xl"
            >
              {/* Dynamic boundary border glow of the modal */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#D92B2B] to-transparent"></div>
              
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40 text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#D92B2B]/20 flex items-center justify-center border border-[#D92B2B]/35">
                    <Sparkles className="w-4 h-4 text-[#D92B2B]" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">সামী টিভি পরিবারে আবেদন</h2>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
                    <div className="w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center shadow-2xl border border-emerald-500/20">
                      <CheckCircle size={56} className="animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2 leading-tight">আবেদনটি সফলভাবে করা হয়েছে!</h3>
                      <p className="text-gray-400 text-sm max-w-sm mx-auto font-medium">সামী টিভি সিলেকশন টিম শীঘ্রই আপনার সাথে মোবাইল ফোনে যোগাযোগ করবে।</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAppSubmit} className="space-y-5 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-wider">আপনার পূর্ণ নাম</label>
                        <div className="relative">
                          <input 
                            type="text" required
                            value={appForm.name}
                            onChange={(e) => setAppForm({...appForm, name: e.target.value})}
                            placeholder="যেমন: এস.এম ফয়সল চৌধুরী"
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#D92B2B]/10 focus:border-[#D92B2B] transition-all text-sm font-bold text-white placeholder:text-gray-500"
                          />
                          <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-wider">মোবাইল নম্বর</label>
                        <div className="relative">
                          <input 
                            type="tel" required
                            value={appForm.phone}
                            onChange={(e) => setAppForm({...appForm, phone: e.target.value})}
                            placeholder="যেমন: 017xxxxxxxx"
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#D92B2B]/10 focus:border-[#D92B2B] transition-all text-sm font-bold text-white placeholder:text-gray-500 font-mono"
                          />
                          <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-wider">ইমেইল ঠিকানা (ঐচ্ছিক)</label>
                        <div className="relative">
                          <input 
                            type="email"
                            value={appForm.email}
                            onChange={(e) => setAppForm({...appForm, email: e.target.value})}
                            placeholder="যেমন: faysal@gmail.com"
                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#D92B2B]/10 focus:border-[#D92B2B] transition-all text-sm font-bold text-white placeholder:text-gray-500 font-mono"
                          />
                          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-wider">বিভাগ</label>
                        <select 
                          value={appForm.division}
                          onChange={(e) => setAppForm({...appForm, division: e.target.value})}
                          className="w-full px-4 bg-slate-950 font-bold border border-white/10 rounded-xl py-3.5 focus:outline-none focus:ring-4 focus:ring-[#D92B2B]/10 focus:border-[#D92B2B] transition-all text-sm text-white"
                        >
                          {divisions.filter(d => d !== 'সব').map(div => <option key={div} value={div}>{div}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400 tracking-wider">বর্তমান ঠিকানা (থানা, জেলা)</label>
                      <div className="relative">
                        <input 
                          type="text" required
                          value={appForm.location}
                          onChange={(e) => setAppForm({...appForm, location: e.target.value})}
                          placeholder="যেমন: জামালপুর সদর, জামালপুর"
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#D92B2B]/10 focus:border-[#D92B2B] transition-all text-sm font-bold text-white placeholder:text-gray-500"
                        />
                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400 tracking-wider">আপনার সদ্য তোলা ছবি</label>
                      <div className="relative">
                        <input 
                          type="file" required accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                          className="hidden" id="app-photo"
                        />
                        <label 
                          htmlFor="app-photo"
                          className="flex items-center justify-center gap-3 w-full px-4 py-7 border-2 border-dashed border-white/10 rounded-xl hover:border-[#D92B2B] hover:bg-white/[0.01] transition-all cursor-pointer group"
                        >
                          <div className="w-11 h-11 bg-white/5 text-gray-400 rounded-full flex items-center justify-center group-hover:bg-[#D92B2B]/10 group-hover:text-[#D92B2B] border border-white/10 group-hover:border-[#D92B2B]/20 transition-all shadow-md">
                            <Upload size={18} />
                          </div>
                          <div className="text-left">
                            <p className="font-extrabold text-sm text-white">{imageFile ? imageFile.name : 'ছবি বেছে নিন'}</p>
                            <p className="text-[11px] text-gray-500 font-medium">JPEG, PNG (সর্বোচ্চ ২ মেগাবাইট)</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-gray-400 tracking-wider">পূর্ব অভিজ্ঞতা (যদি থাকে)</label>
                      <textarea 
                        rows={3}
                        value={appForm.experience}
                        onChange={(e) => setAppForm({...appForm, experience: e.target.value})}
                        placeholder="আগে কোনো গণমাধ্যমে কাজ করে থাকলে তার সংক্ষিপ্ত বর্ণনা..."
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#D92B2B]/10 focus:border-[#D92B2B] transition-all text-sm font-bold text-white placeholder:text-gray-500 resize-none"
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#ba1a29] to-[#bf2c1e] text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-wider hover:opacity-95 active:scale-98 transition-all shadow-[0_12px_24px_rgba(186,26,41,0.25)] flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                      {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'সংবাদকর্মী আবেদন পাঠান'} 
                      <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Futuristic 3D Parallax Header Section - Sleeker and Compact */}
      <div className="relative overflow-hidden border-b border-white/5 py-12 md:py-16 select-none animate-fadeIn">
        
        {/* Underlayer broadcast waves structure */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?auto=format&fit=crop&w=1600&q=80" 
            alt="Satellite Ground Station Background" 
            className="w-full h-full object-cover opacity-10 scale-102"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07090e]/85 to-[#07090e]" />
          
          {/* Animated Broadcast Signal (3D radar look) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#D92B2B]/5 rounded-full pointer-events-none select-none animate-ping [animation-duration:6s]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          
          {/* 3D Glass Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="inline-flex items-center gap-1.5 bg-[#D92B2B]/10 text-[#D92B2B] border border-[#D92B2B]/20 px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] mb-4 shadow-[0_4px_12px_rgba(217,43,43,0.08)] backdrop-blur-md"
          >
            <Users size={10} className="text-[#D92B2B] animate-pulse" /> 
            <span>SAMI TV DIGITAL EMPIRE</span>
          </motion.div>
          
          {/* Main Title Styled with reflective 3D shadow and gradient */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="text-3xl sm:text-4.5xl md:text-5xl font-black text-white mb-3 tracking-tight leading-[1.12]"
          >
            সামী টিভি <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-450 via-[#D92B2B] to-[#FF4D4D] drop-shadow-[0_2px_10px_rgba(217,43,43,0.2)]">ডিজিটাল পরিবার</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="h-[2px] w-12 bg-gradient-to-r from-orange-500 to-[#D92B2B] mx-auto rounded-full mb-4"
          />

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans font-medium"
          >
            বস্তুনিষ্ঠ সংবাদ এবং ডিজিটাল গণমাধ্যমের ধারা বজায় রাখতে জামালপুরসহ দেশজুড়ে নিয়োজিত আমাদের গতিশীল ও নিষ্ঠাবান প্রতিনিধিদের তথ্যচিত্র এবং গ্যালারি।
          </motion.p>
        </div>
      </div>

      <div className="px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto -mt-6 relative z-20 pb-20">
        
        {/* Floating 3D Stat Bento Cards - Sleeker & More Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6.5 select-none">
          {[
            { label: 'মোট সংবাদকর্মী', value: filteredReporters.length, icon: Users, color: 'text-orange-450 bg-orange-500/10 border-orange-500/15' },
            { label: 'সক্রিয় বিভাগ', value: divisions.length - 1, icon: Globe, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15' },
            { label: 'থানা ও উপজেলা', value: '৫০+', icon: MapPin, color: 'text-[#D92B2B] bg-[#D92B2B]/10 border-[#D92B2B]/15' },
            { label: 'সম্প্রচার সময়', value: '২৪/৭', icon: Clock, color: 'text-amber-400 bg-amber-500/10 border-amber-500/15' }
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 + (i * 0.03) }}
              key={i}
              className="bg-[#0b0e1a]/85 backdrop-blur-md rounded-xl p-3 border border-white/5 shadow-[0_10px_25px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center gap-3 hover:border-white/10 hover:bg-[#0e1224] hover:-translate-y-1 transition-all duration-300 cursor-default group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${stat.color} group-hover:scale-105 transition-transform`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-md sm:text-lg font-black text-white leading-none tracking-tight">{convertToBn(stat.value)}</p>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1.5 font-sans">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic 3D Control Center - Compact Search and Filters */}
        <div className="bg-[#0b0e1a]/95 border border-white/5 p-3 sm:p-3.5 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.05)] mb-7 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            
            {/* Hologram-style Search Box */}
            <div className="relative flex-1 w-full group">
              <input 
                type="text" 
                placeholder="নাম, পদবী বা এলাকা দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white/[0.015] hover:bg-white/[0.03] focus:bg-[#07090e] border border-white/10 hover:border-white/15 focus:border-[#D92B2B] rounded-lg transition-all text-xs font-bold text-white placeholder:text-gray-550 outline-none focus:ring-4 focus:ring-[#D92B2B]/5 font-sans"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D92B2B] transition-colors" size={12} />
            </div>
            
            {/* Division Filter Pill Controls */}
            <div className="w-full sm:w-48 shrink-0 relative">
              <select 
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full appearance-none bg-slate-900 border border-white/5 hover:border-white/10 text-white pl-3.5 pr-8 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-wider cursor-pointer transition-colors outline-none font-sans"
              >
                {divisions.map(div => <option key={div} value={div}>বিভাগ: {div}</option>)}
              </select>
              <ChevronRight size={11} className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="w-12 h-12 border-4 border-[#D92B2B]/10 border-t-[#D92B2B] rounded-full animate-spin"></div>
            <p className="text-[9.5px] text-gray-500 font-extrabold tracking-[0.3em] uppercase animate-pulse">ডিজিটাল প্যানেল লোড হচ্ছে</p>
          </div>
        ) : filteredReporters.length > 0 ? (
          
          /* Compact High-Density Cards Grid (2-6 cols) with 3D projection */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 font-sans">
            <AnimatePresence mode="popLayout">
              {filteredReporters.map((rep, idx) => {
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, ease: "easeOut" }}
                    exit={{ opacity: 0, y: 15 }}
                    key={rep.id}
                    className="group bg-[#0a0d18]/90 border border-white/5 rounded-xl flex flex-col shadow-[0_12px_24px_rgba(0,0,0,0.35)] hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_20px_35px_rgba(217,43,43,0.12)] hover:border-[#D92B2B]/25 transition-all duration-350 relative overflow-hidden"
                  >
                    {/* Metallic Border Gloss Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none z-10"></div>
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:animate-shine"></div>
                    
                    {/* Image Area - Portrait Square to fit beautifully in compact grids */}
                    <div className="relative aspect-[5/6] overflow-hidden bg-slate-950 shrink-0 select-none">
                      <img 
                        src={rep.imageUrl || "https://picsum.photos/seed/user/800/1200"} 
                        alt={rep.name} 
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out" 
                        referrerPolicy="no-referrer" 
                      />
                      
                      {/* Deep black cover fade on top of image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                      
                      {/* Premium Glowing Id Tag */}
                      <div className="absolute top-1.5 left-1.5 bg-black/80 text-white backdrop-blur-md px-1.5 py-0.5 rounded text-[7.5px] font-bold border border-white/10 tracking-widest shadow-sm flex items-center gap-1 font-sans">
                        <span className="w-1 h-1 rounded-full bg-[#D92B2B] animate-pulse"></span>
                        <span>ID {convertToBn(rep.reporterId || (2601 + idx))}</span>
                      </div>

                      {/* Map Location Flag */}
                      <div className="absolute top-1.5 right-1.5 bg-black/80 text-white backdrop-blur-md px-1.5 py-0.5 rounded text-[7.5px] font-bold border border-white/10 shadow-sm flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 text-[#D92B2B] shrink-0" />
                        <span className="truncate max-w-[50px]">{rep.location || 'জামালপুর'}</span>
                      </div>

                      {/* Floating Active Reporter Tag */}
                      <div className="absolute bottom-1.5 left-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md px-1.5 py-0.5 rounded text-[6.5px] font-black tracking-wider flex items-center gap-0.5 uppercase">
                        <span className="w-0.5 h-0.5 bg-emerald-400 rounded-full animate-bounce"></span>
                        <span>ACTIVE</span>
                      </div>
                    </div>

                    {/* Meta Profile Card details */}
                    <div className="p-2.5 flex-1 flex flex-col justify-between relative bg-[#090b14]/90">
                      
                      <div className="space-y-1">
                        {/* Interactive glow-up name - Compact size */}
                        <h3 className="text-[11.5px] sm:text-xs font-black text-white leading-snug group-hover:text-[#D92B2B] transition-colors duration-250 truncate font-sans">
                          {rep.name}
                        </h3>

                        {/* Beveled Designation label */}
                        <div className="flex items-center gap-0.5 text-[8.5px] font-black text-[#D92B2B] bg-[#D92B2B]/5 border border-[#D92B2B]/15 px-1.5 py-0.25 rounded w-fit select-none font-sans">
                          <Briefcase className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate max-w-[95px]">{rep.designation}</span>
                        </div>
                      </div>

                      <div className="space-y-1 mt-3 text-[10px]">
                        {/* Call trigger link */}
                        {rep.phone && (
                          <a 
                            href={`tel:${rep.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 text-gray-400 hover:text-white border-t border-white/5 pt-1.5 transition-colors group/call"
                          >
                            <div className="w-5 h-5 bg-white/5 border border-white/5 rounded flex items-center justify-center shrink-0 group-hover:bg-[#D92B2B]/20 group-hover:border-[#D92B2B]/30 transition-colors">
                              <Phone className="w-2.5 h-2.5 text-gray-450 group-hover/call:text-white transition-colors" />
                            </div>
                            <span className="font-mono font-bold leading-none text-[8.5px] sm:text-[9.5px]">{convertToBn(rep.phone)}</span>
                          </a>
                        )}

                        {/* Joining Period tag */}
                        <div className="flex items-center gap-2 text-[8px] sm:text-[8.5px] text-gray-500 border-t border-white/5 pt-1.5 font-sans">
                          <div className="w-5 h-5 bg-white/5 border border-white/5 rounded flex items-center justify-center shrink-0">
                            <Calendar className="w-2.5 h-2.5 text-gray-500 shrink-0" />
                          </div>
                          <span className="font-semibold leading-none truncate text-gray-500">যুক্ত: {getBnDate(rep.createdAt).split(' ')[0] + ' ' + getBnDate(rep.createdAt).split(' ').slice(1).join(' ')}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Missing result panel */
          <div className="text-center py-28 select-none">
            <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-dashed border-white/10 shadow-lg">
               <Users size={32} className="text-gray-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">কোনো সংবাদকর্মী পাওয়া যায়নি</h3>
            <p className="text-gray-400 text-xs font-semibold mb-6">অনুসন্ধান ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
            <button 
              onClick={() => { setSelectedDivision('সব'); setSearchTerm(''); }}
              className="px-6 py-3 bg-[#D92B2B] text-white rounded-xl font-black text-[11px] uppercase tracking-wider hover:bg-[#ba1a29] transition-all duration-300"
            >
              সকল সংবাদকর্মী দেখুন
            </button>
          </div>
        )}

        {/* 3D Glassmorphism Recruitment Floating Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 max-w-5xl mx-auto bg-gradient-to-r from-indigo-950/15 via-[#0b0e1a]/85 to-red-950/10 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-white/10 transition-colors"
        >
          <div className="flex-1 min-w-0 text-center md:text-left space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-[#D92B2B] border border-red-500/20 text-[9px] font-black uppercase tracking-wider rounded-md">
              <span className="w-1.5 h-1.5 bg-[#D92B2B] rounded-full animate-ping"></span>
              নিউজ পোর্টাল রিক্রুটমেন্ট ২০২৬
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
              সামী টিভি ডিজিটাল সংবাদকর্মী হতে চান?
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm font-semibold max-w-xl">
              সঠিক ও সত্য খবরের গতিশীল সহযাত্রী হতে সামী টিভি পরিবারের সাথে আজই যুক্ত হোন এবং আপনার এলাকার সাধারণ মানুষের কথা বিশ্বদরবারে তুলে ধরুন।
            </p>
          </div>
          
          <div className="shrink-0 w-full md:w-auto">
            <button 
              onClick={() => setShowModal(true)}
              className="group w-full md:w-auto bg-gradient-to-r from-[#ba1a29] to-[#bf2c1e] text-white px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_8px_20px_rgba(186,26,41,0.2)] flex items-center justify-center gap-2"
            >
              <span>আবেদন ফর্ম পূরণ করুন</span> 
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
