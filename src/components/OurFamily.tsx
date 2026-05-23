import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, User, Phone, Mail, Filter, ChevronRight, Users, Search, Globe, X, Send, CheckCircle, Upload, Clock, Briefcase, Calendar } from 'lucide-react';
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white rounded-sm news-card-shadow overflow-hidden"
    >
      {/* Application Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-sami-dark text-white">
                <h2 className="text-xl font-bold">সংবাদকর্মী হিসেবে আবেদন করুন</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-xl">
                      <CheckCircle size={48} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">আবেদনটি সফলভাবে জমা হয়েছে!</h3>
                      <p className="text-gray-500">আমাদের টিম আপনার সাথে শীঘ্রই যোগাযোগ করবে।</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAppSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">আপনার নাম</label>
                        <input 
                          type="text" required
                          value={appForm.name}
                          onChange={(e) => setAppForm({...appForm, name: e.target.value})}
                          placeholder="পুরো নাম লিখুন"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sami-blue/20 focus:border-sami-blue transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">মোবাইল নম্বর</label>
                        <input 
                          type="tel" required
                          value={appForm.phone}
                          onChange={(e) => setAppForm({...appForm, phone: e.target.value})}
                          placeholder="আপনার মোবাইল নম্বর"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sami-blue/20 focus:border-sami-blue transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">ইমেইল (ঐচ্ছিক)</label>
                        <input 
                          type="email"
                          value={appForm.email}
                          onChange={(e) => setAppForm({...appForm, email: e.target.value})}
                          placeholder="আপনার ইমেইল"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sami-blue/20 focus:border-sami-blue transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">বিভাগ</label>
                        <select 
                          value={appForm.division}
                          onChange={(e) => setAppForm({...appForm, division: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sami-blue/20 focus:border-sami-blue transition-all"
                        >
                          {divisions.filter(d => d !== 'সব').map(div => <option key={div} value={div}>{div}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">বর্তমান ঠিকানা (থানা, জেলা)</label>
                      <input 
                        type="text" required
                        value={appForm.location}
                        onChange={(e) => setAppForm({...appForm, location: e.target.value})}
                        placeholder="যেমন: সরিষাবাড়ী, জামালপুর"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sami-blue/20 focus:border-sami-blue transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">আপনার ছবি</label>
                      <div className="relative">
                        <input 
                          type="file" required accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                          className="hidden" id="app-photo"
                        />
                        <label 
                          htmlFor="app-photo"
                          className="flex items-center justify-center gap-3 w-full px-4 py-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-sami-blue hover:bg-sami-light transition-all cursor-pointer group"
                        >
                          <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-sami-blue transition-colors">
                            <Upload size={24} />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-700">{imageFile ? imageFile.name : 'আপনার ছবি আপলোড করুন'}</p>
                            <p className="text-xs text-gray-500">JPG, PNG (সর্বোচ্চ ২ মেগাবাইট)</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">পূর্ব অভিজ্ঞতা (যদি থাকে)</label>
                      <textarea 
                        rows={3}
                        value={appForm.experience}
                        onChange={(e) => setAppForm({...appForm, experience: e.target.value})}
                        placeholder="আপনার পূর্ব অভিজ্ঞতা সম্পর্কে সংক্ষেপে লিখুন..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sami-blue/20 focus:border-sami-blue transition-all resize-none"
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-sami-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-sami-dark transition-all shadow-xl shadow-sami-blue/20 flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                      {isSubmitting ? 'জমা হচ্ছে...' : 'আবেদন জমা দিন'} <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Professional Header Section - Simple & Premium Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-50/60 via-white to-red-50/30 border-b border-gray-150 py-20 md:py-28">
        {/* Satellite ground station background image with light, elegant overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518364538800-6bcb3f25da49?auto=format&fit=crop&w=1600&q=80" 
            alt="Satellite Ground Station Background" 
            className="w-full h-full object-cover opacity-10 scale-105 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white" />
          {/* Subtle grid pattern background overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80a0a006_1px,transparent_1px)] bg-[size:16px_28px] pointer-events-none" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#D92B2B]/10 text-[#D92B2B] border border-[#D92B2B]/20 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Users size={12} className="animate-pulse" /> OUR PORTAL COMMUNITY
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-950 mb-6 tracking-tight leading-tight"
          >
            সামী টিভি <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D92B2B] to-[#FF4D4D]">ডিজিটাল পরিবার</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 64 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="h-1 bg-[#D92B2B] mx-auto rounded-full mb-6"
          />

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg font-bold leading-relaxed font-sans"
          >
            বস্তুনিষ্ঠ ও দায়িত্বশীল গণমাধ্যমের ধারা বজায় রাখতে দেশজুড়ে নিয়োজিত আমাদের গতিশীল সংবাদকর্মীদের তথ্যচিত্র ও গ্যালারি।
          </motion.p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-12 relative z-20 pb-32">
        {/* Statistics Bar - Sleeker & Minimalist */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'মোট সংবাদকর্মী', value: filteredReporters.length, icon: Users, color: 'text-[#D92B2B]', bg: 'hover:border-red-200' },
            { label: 'সক্রিয় বিভাগ', value: divisions.length - 1, icon: Globe, color: 'text-emerald-500', bg: 'hover:border-emerald-200' },
            { label: 'থানা ও জেলা', value: '৫০+', icon: MapPin, color: 'text-[#D92B2B]', bg: 'hover:border-red-200' },
            { label: 'সম্প্রচার সময়', value: '২৪/৭', icon: Clock, color: 'text-amber-500', bg: 'hover:border-amber-200' }
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (i * 0.05) }}
              key={i}
              className={`bg-white p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-150 flex items-center gap-4 transition-all duration-350 cursor-default ${stat.bg}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100`}>
                <stat.icon className={`${stat.color}`} size={18} />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900 leading-none">{stat.value}</p>
                <p className="text-[10.5px] font-extrabold text-gray-400 uppercase tracking-wider mt-1.5 font-sans">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter - Clean, Inline Professional Search Box */}
        <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-[0_5px_22px_rgba(0,0,0,0.015)] mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <input 
                type="text" 
                placeholder="নাম, পদবী বা এলাকা দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50/70 hover:bg-white focus:bg-white border border-gray-200 focus:border-[#D92B2B] focus:ring-4 focus:ring-[#D92B2B]/5 rounded-xl transition-all text-[15px] font-bold outline-none placeholder:text-gray-400 font-sans"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D92B2B] transition-colors" size={16} />
            </div>
            
            {/* Division Filter */}
            <div className="w-full md:w-64">
              <div className="relative">
                <select 
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full appearance-none bg-gray-900 hover:bg-gray-800 text-white pl-4 pr-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer transition-colors outline-none font-sans"
                >
                  {divisions.map(div => <option key={div} value={div}>বিভাগ: {div}</option>)}
                </select>
                <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-white/60" />
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-8">
            <div className="w-20 h-20 border-[6px] border-sami-red/10 border-t-sami-red rounded-full animate-spin"></div>
            <p className="text-[10px] text-gray-400 font-black tracking-[0.4em] uppercase">গ্যালারি লোড হচ্ছে</p>
          </div>
        ) : filteredReporters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            <AnimatePresence mode="popLayout">
              {filteredReporters.map((rep, idx) => {
                const portalCity = rep.location ? (rep.location.split(',').pop()?.trim() || 'জামালপুর') : 'জামালপুর';
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, ease: "easeOut" }}
                    exit={{ opacity: 0, y: 15 }}
                    key={rep.id}
                    className="bg-white border border-gray-150 rounded-2xl flex flex-col shadow-[0_4px_16px_rgba(0,0,0,0.015)] hover:shadow-[0_16px_40px_rgba(217,43,43,0.06)] hover:border-red-200 transition-all duration-300 relative group overflow-hidden"
                  >
                    {/* Top Section: Full-Width Portrait Image with Floating Badges */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 border-b border-gray-100 shrink-0 select-none">
                      <img 
                        src={rep.imageUrl || "https://picsum.photos/seed/user/800/1200"} 
                        alt={rep.name} 
                        className="w-full h-full object-cover group-hover:scale-103 transition-all duration-700 ease-out" 
                        referrerPolicy="no-referrer" 
                      />
                      
                      {/* Premium Floating Badges */}
                      <div className="absolute top-3 left-3 bg-gray-950/80 text-white backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[10px] font-black border border-white/10 tracking-wider shadow-sm flex items-center gap-1.5 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        <span>ID NO: {convertToBn(rep.reporterId || (2601 + idx))}</span>
                      </div>

                      <div className="absolute top-3 right-3 bg-white/90 text-gray-800 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[11px] font-bold border border-gray-200 shadow-sm flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D92B2B] shrink-0 animate-bounce" />
                        <span>{rep.location || 'জামালপুর'}</span>
                      </div>

                      {/* Live Indicator overlay on image */}
                      <div className="absolute bottom-3 left-3 bg-emerald-500/80 text-white backdrop-blur-md px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1 h-1 bg-white rounded-full"></span>
                        <span>ACTIVE REPORTER</span>
                      </div>
                    </div>

                    {/* Bottom Section: Profile Metadata */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Reporter Name */}
                        <h3 className="text-[17px] sm:text-[18px] font-black text-gray-950 leading-snug group-hover:text-[#D92B2B] transition-colors duration-200 truncate font-sans">
                          {rep.name}
                        </h3>

                        {/* Designation Tag */}
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-extrabold text-[#D92B2B] bg-red-50/70 border border-red-100/40 px-2.5 py-0.5 rounded-md w-fit mt-1.5 select-none font-sans">
                          <Briefcase className="w-3.5 h-3.5 text-[#D92B2B] shrink-0" />
                          <span className="truncate">{rep.designation}</span>
                        </div>
                      </div>

                      {/* Hairline Separated Action Links */}
                      <div className="space-y-2 mt-4 select-none">
                        {/* Phone call row */}
                        {rep.phone && (
                          <a 
                            href={`tel:${rep.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-3 text-xs text-gray-500 hover:text-[#D92B2B] border-t border-gray-100 pt-3 transition-colors duration-200"
                          >
                            <div className="w-7 h-7 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-50 group-hover:border-red-100 transition-colors">
                              <Phone className="w-3.5 h-3.5 text-gray-450 group-hover:text-[#D92B2B] transition-colors" />
                            </div>
                            <span className="font-mono font-bold leading-none">{convertToBn(rep.phone)}</span>
                          </a>
                        )}

                        {/* Date of joining row */}
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 border-t border-gray-100 pt-3 font-sans">
                          <div className="w-7 h-7 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          </div>
                          <span className="font-bold leading-none">যুক্ত হয়েছেন: {getBnDate(rep.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-40">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-dashed border-gray-200">
               <Users size={40} className="text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">দুঃখিত, কোনো সদস্য পাওয়া যায়নি</h3>
            <p className="text-gray-400 font-medium mb-10">আপনার অনুসন্ধান ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
            <button 
              onClick={() => { setSelectedDivision('সব'); setSearchTerm(''); }}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sami-dark transition-all shadow-xl"
            >
              সকল সদস্য দেখুন
            </button>
          </div>
        )}

        {/* Recruitment Footer - Sleek & Simple Professional Design */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-20 max-w-5xl mx-auto bg-gradient-to-r from-gray-50 to-slate-50/50 border border-gray-150 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:border-red-150 transition-all duration-300"
        >
          <div className="flex-1 min-w-0 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-500 border border-red-100/50 text-[10px] font-black uppercase tracking-wider rounded-md">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
              নিউজ পোর্টাল রিক্রুটমেন্ট
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-snug">
              আপনি কি আমাদের সংবাদকর্মী হতে চান?
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-bold leading-relaxed max-w-2xl">
              সঠিক ও বস্তুনিষ্ঠ খবরের সহযাত্রী হতে সামী টিভি পরিবারের সাথে যুক্ত হন এবং আপনার এলাকার সত্য সংবাদ তুলে ধরুন।
            </p>
          </div>
          
          <div className="shrink-0">
            <button 
              onClick={() => setShowModal(true)}
              className="group bg-red-650 hover:bg-[#D92B2B] text-white px-7 py-4.5 rounded-xl font-black text-[13px] uppercase tracking-wider transition-all duration-300 shadow-md flex items-center gap-2.5"
            >
              <span>আবেদন ফরম পূরণ করুন</span> 
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
