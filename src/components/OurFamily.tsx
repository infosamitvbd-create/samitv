import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, User, Phone, Mail, Filter, ChevronRight, Users, Search, Globe, X, Send, CheckCircle, Upload } from 'lucide-react';
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

      {/* Professional Header Section */}
      <div className="relative bg-gradient-to-r from-sami-dark to-sami-blue py-20 px-8 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-600 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-blue-100 text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
            <Users size={14} /> আমাদের পরিবার
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">সামী টিভি পরিবার</h1>
          <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full mb-6"></div>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg font-medium">
            সারাদেশে ছড়িয়ে থাকা আমাদের সাহসী ও দক্ষ সংবাদকর্মীদের তালিকা। বস্তুনিষ্ঠ সংবাদ সংগ্রহে যারা দিনরাত নিরলস কাজ করে যাচ্ছেন।
          </p>
        </div>
      </div>

      <div className="p-6 lg:p-10">
        {/* Filter & Search Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-end">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-3 text-gray-700 font-bold text-sm uppercase tracking-wider">
              <Filter size={16} className="text-sami-blue" />
              <span>বিভাগ অনুযায়ী ফিল্টার করুন</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {divisions.map((division) => (
                <button
                  key={division}
                  onClick={() => setSelectedDivision(division)}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all text-sm border ${
                    selectedDivision === division
                      ? 'bg-sami-blue text-white border-sami-blue shadow-lg shadow-sami-blue/20 scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  {division}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-80">
            <div className="flex items-center gap-2 mb-3 text-gray-700 font-bold text-sm uppercase tracking-wider">
              <Search size={16} className="text-sami-blue" />
              <span>সদস্য খুঁজুন</span>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="নাম বা এলাকা দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sami-blue/20 focus:border-sami-blue transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <Globe size={20} className="text-sami-blue" />
            <span className="text-lg">সংবাদকর্মী তালিকা</span>
          </div>
          <div className="bg-sami-light text-sami-blue px-4 py-1 rounded-full text-xs font-bold">
            মোট সদস্য: {filteredReporters.length} জন
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-sami-blue/20 border-t-sami-blue rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">তথ্য লোড হচ্ছে...</p>
          </div>
        ) : filteredReporters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredReporters.map((rep) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={rep.id}
                  className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center p-8"
                >
                  {/* Decorative Background Element */}
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 group-hover:border-sami-blue transition-all duration-500 transform group-hover:scale-105">
                    <img 
                      src={rep.imageUrl || "https://picsum.photos/seed/user/200/200"} 
                      alt={rep.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="font-bold text-gray-900 text-xl mb-1 group-hover:text-sami-blue transition-colors">{rep.name}</h3>
                    <div className="inline-block px-3 py-1 bg-sami-light text-sami-blue text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                      {rep.designation}
                    </div>
                    
                    <div className="flex flex-col gap-3 w-full mt-2 pt-6 border-t border-gray-50">
                      <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sami-blue">
                          <MapPin size={14} />
                        </div>
                        <span className="font-medium">{rep.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-red-500">
                          <Globe size={14} />
                        </div>
                        <span className="font-medium">বিভাগ: {rep.division}</span>
                      </div>

                      {rep.phone && (
                        <a 
                          href={`tel:${rep.phone}`}
                          className="flex items-center justify-center gap-2 text-gray-600 text-sm hover:text-green-600 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-green-600">
                            <Phone size={14} />
                          </div>
                          <span className="font-medium">{rep.phone}</span>
                        </a>
                      )}
                      
                      {rep.email && (
                        <a 
                          href={`mailto:${rep.email}`}
                          className="flex items-center justify-center gap-2 text-gray-600 text-sm hover:text-red-500 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-red-500">
                            <Mail size={14} />
                          </div>
                          <span className="truncate max-w-[150px] font-medium">{rep.email}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-32 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center gap-4">
            <Users size={48} className="text-gray-200" />
            <div>
              <p className="text-lg font-bold text-gray-500">কোনো সদস্য পাওয়া যায়নি</p>
              <p className="text-sm">অনুগ্রহ করে অন্য কোনো বিভাগ বা নাম দিয়ে চেষ্টা করুন।</p>
            </div>
            <button 
              onClick={() => { setSelectedDivision('সব'); setSearchTerm(''); }}
              className="mt-2 text-sami-blue font-bold hover:underline"
            >
              সব সদস্য দেখুন
            </button>
          </div>
        )}

        {/* Recruitment Call to Action */}
        <div className="mt-20 p-10 bg-gray-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sami-blue/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">আপনি কি আমাদের সাথে কাজ করতে চান?</h3>
            <p className="text-gray-400 max-w-xl">
              সামী টিভি পরিবারে যোগ দিন এবং আপনার এলাকার সংবাদ তুলে ধরুন। আমরা সবসময় দক্ষ ও সাহসী সংবাদকর্মী খুঁজছি।
            </p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="relative z-10 bg-sami-blue hover:bg-sami-dark text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-sami-blue/20 flex items-center gap-2 group"
          >
            আবেদন করুন <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
