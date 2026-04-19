import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, User, Phone, Mail, Filter, ChevronRight, Users, Search, Globe, X, Send, CheckCircle, Upload, Clock } from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const divisions = ['সব', 'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

export const OurFamily: React.FC = () => {
  const [reporters, setReporters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState('সব');
  const [searchTerm, setSearchTerm] = useState('');
  
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

      {/* Professional Header Section - Premium Design */}
      <div className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden bg-gray-900 border-b border-white/5">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/journalism/1920/1080?blur=4" 
            className="w-full h-full object-cover opacity-40 scale-105"
            referrerPolicy="no-referrer"
            alt="Journalism Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/40 to-gray-900"></div>
          
          {/* Animated decorative elements */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-sami-red/20 rounded-full mix-blend-screen blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-sami-teal/20 rounded-full mix-blend-screen blur-[150px]"
          />
        </div>

        <div className="relative z-10 max-w-4xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-sami-red text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-2xl shadow-sami-red/40"
          >
            <Users size={14} /> Our Community
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight leading-[0.9]"
          >
            সামী টিভি <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sami-red to-sami-accent">পরিবার</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="w-32 h-2 bg-white mx-auto rounded-full mb-8"
          />

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed"
          >
            বস্তুনিষ্ঠ সাংবাদিকতার মূল কারিগর—আমাদের সাহসিক সংবাদকর্মীদের মিলনস্থল।
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50/50 to-transparent"></div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-20 relative z-20 pb-32">
        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'মোট সদস্য', value: filteredReporters.length, icon: Users, color: 'text-sami-red' },
            { label: 'বিভাগ', value: divisions.length - 1, icon: Globe, color: 'text-sami-teal' },
            { label: 'উপজেলা', value: '৫০+', icon: MapPin, color: 'text-sami-blue' },
            { label: 'প্রচার সময়', value: '২৪/৭', icon: Clock, color: 'text-orange-500' }
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              key={i}
              className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center justify-center text-center group hover:bg-sami-dark transition-all duration-500"
            >
              <stat.icon className={`${stat.color} mb-3 group-hover:scale-110 transition-transform`} size={24} />
              <p className="text-2xl font-black text-gray-900 group-hover:text-white transition-colors">{stat.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 group-hover:text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter - Redesigned for Premium Look */}
        <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl shadow-gray-200/40 border border-white mb-20">
          <div className="flex flex-col lg:flex-row gap-12 items-end">
            <div className="flex-1 w-full space-y-6">
              <div className="flex items-center gap-3 text-gray-900 font-black text-[10px] uppercase tracking-[0.3em]">
                <div className="w-1 h-4 bg-sami-red rounded-full"></div>
                <span>সংবাদকর্মী অন্বেষণ করুন</span>
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="নাম, পদবী বা এলাকা দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-8 py-6 bg-gray-50/50 border-2 border-gray-100/50 rounded-3xl outline-none focus:bg-white focus:border-sami-red focus:ring-4 focus:ring-sami-red/5 transition-all text-lg font-bold placeholder:text-gray-300"
                />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sami-red transition-colors" size={24} />
              </div>
            </div>
            
            <div className="w-full lg:w-1/3 space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block px-2">বিভাগ সিলেক্ট করুন</label>
              <div className="relative">
                <select 
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full appearance-none bg-gray-900 text-white pl-8 pr-12 py-6 rounded-3xl font-black text-sm cursor-pointer hover:bg-sami-dark transition-colors outline-none shadow-xl shadow-gray-900/20"
                >
                  {divisions.map(div => <option key={div} value={div}>{div}</option>)}
                </select>
                <ChevronRight size={20} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-white/40" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredReporters.map((rep, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={rep.id}
                  className="group relative"
                >
                  <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl transition-all duration-700 group-hover:-translate-y-4 group-hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                    <img 
                      src={rep.imageUrl || "https://picsum.photos/seed/user/800/1200"} 
                      alt={rep.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                    
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="inline-block px-3 py-1 bg-sami-red text-white text-[9px] font-black uppercase tracking-widest rounded mb-3">
                        {rep.designation}
                      </div>
                      <h3 className="text-xl font-black text-white leading-tight">{rep.name}</h3>
                    </div>
                  </div>
                  
                  <div className="px-2 space-y-3">
                    <div className="flex items-center gap-3 text-gray-500 group-hover:text-gray-900 transition-colors">
                      <MapPin size={14} className="text-sami-red shrink-0" />
                      <span className="text-xs font-bold leading-none">{rep.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 opacity-60 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">অনলাইন</span>
                      </div>
                      {rep.phone && (
                        <a 
                          href={`tel:${rep.phone}`} 
                          className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-sami-red hover:text-white transition-all shadow-sm"
                        >
                          <Phone size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
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

        {/* Recruitment Footer - High Impact */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 relative rounded-[3rem] overflow-hidden bg-gray-900 text-white"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sami-red/10 rounded-full blur-[100px] -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sami-teal/10 rounded-full blur-[100px] -ml-64 -mb-64"></div>
          
          <div className="relative z-10 p-12 md:p-20 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mb-8">
              <Users size={32} className="text-sami-red" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">আপনি কি আমাদের সংবাদকর্মী <br /> হতে চান?</h2>
            <p className="text-gray-400 max-w-2xl text-lg font-medium leading-relaxed mb-12">
              সাত-বিদেশের সত্য সংবাদ সঠিক সময়ে পৌঁছে দিতে সামী টিভি নিরলস কাজ করে যাচ্ছে। আমাদের এই যাত্রার অংশীদার হতে আজই আবেদন করুন।
            </p>
            <button 
              onClick={() => setShowModal(true)}
              className="group bg-sami-red hover:bg-white hover:text-gray-900 text-white px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all duration-500 shadow-2xl shadow-sami-red/30 flex items-center gap-4"
            >
              আবেদন ফরম পূরণ করুন <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
