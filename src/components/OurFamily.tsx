import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, User, Phone, Mail, Filter, ChevronRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const divisions = ['সব', 'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

export const OurFamily: React.FC = () => {
  const [reporters, setReporters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState('সব');

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

  const filteredReporters = selectedDivision === 'সব' 
    ? reporters 
    : reporters.filter(r => r.division === selectedDivision);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-white p-6 rounded-sm news-card-shadow"
    >
      <div className="flex items-center justify-between mb-8 border-b-2 border-sami-blue pb-2">
        <h2 className="text-2xl font-bold text-sami-blue">আওয়ার ফ্যামিলি (SAMI TV Parivar)</h2>
        <span className="text-xs text-gray-400">মোট সদস্য: {filteredReporters.length} জন</span>
      </div>

      {/* Filter Section */}
      <div className="mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-2 mb-4 text-gray-700 font-bold">
          <Filter size={18} className="text-sami-blue" />
          <span>বিভাগ অনুযায়ী খুঁজুন:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {divisions.map((division) => (
            <button
              key={division}
              onClick={() => setSelectedDivision(division)}
              className={`px-4 py-2 rounded-xl font-bold transition-all text-sm ${
                selectedDivision === division
                  ? 'bg-sami-blue text-white shadow-md scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {division}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-20 text-gray-500">লোডিং...</div>
      ) : filteredReporters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredReporters.map((rep) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={rep.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all p-6 flex flex-col items-center text-center group"
              >
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-sami-light mb-4 group-hover:border-sami-blue transition-colors">
                  <img 
                    src={rep.imageUrl} 
                    alt={rep.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{rep.name}</h3>
                <p className="text-sami-blue text-sm font-bold mb-3">{rep.designation}</p>
                
                <div className="flex flex-col gap-2 w-full mt-2 pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                    <MapPin size={14} className="text-sami-blue" />
                    <span>{rep.location}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px]">
                    <ChevronRight size={12} className="text-sami-blue" />
                    <span>বিভাগ: {rep.division}</span>
                  </div>
                  {rep.phone && (
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                      <Phone size={14} className="text-green-600" />
                      <span>{rep.phone}</span>
                    </div>
                  )}
                  {rep.email && (
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                      <Mail size={14} className="text-red-500" />
                      <span className="truncate max-w-[150px]">{rep.email}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          বর্তমানে কোনো সদস্য তালিকাভুক্ত নেই।
        </div>
      )}
    </motion.div>
  );
};
