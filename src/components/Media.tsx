import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Image as ImageIcon, Film, ExternalLink } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export const Media: React.FC = () => {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMediaList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Media Firestore Error: ", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const images = mediaList.filter(m => m.type === 'image');
  const videos = mediaList.filter(m => m.type === 'video');

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-white p-6 rounded-sm news-card-shadow"
    >
      <h2 className="text-2xl font-bold text-sami-blue mb-8 border-b-2 border-sami-blue pb-2 inline-block">মিডিয়া (Media)</h2>
      
      {loading ? (
        <div className="text-center py-20 text-gray-500">লোডিং...</div>
      ) : (
        <div className="space-y-16">
          {/* Image Gallery */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-800">
                <ImageIcon size={24} className="text-sami-blue" />
                <h3 className="text-xl font-bold">ফটো গ্যালারি</h3>
              </div>
              <span className="text-xs text-gray-400">{images.length} টি ছবি</span>
            </div>
            
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <AnimatePresence mode="popLayout">
                  {images.map((img) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={img.id} 
                      className="aspect-square rounded-xl overflow-hidden group cursor-pointer relative shadow-sm hover:shadow-xl transition-all"
                    >
                      <img 
                        src={img.imageUrl} 
                        alt={img.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <p className="text-white text-xs font-bold line-clamp-1">{img.title}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                কোনো ছবি পাওয়া যায়নি।
              </div>
            )}
          </section>

          {/* Video Gallery */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-800">
                <Film size={24} className="text-sami-blue" />
                <h3 className="text-xl font-bold">ভিডিও গ্যালারি</h3>
              </div>
              <span className="text-xs text-gray-400">{videos.length} টি ভিডিও</span>
            </div>

            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {videos.map((vid) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={vid.id}
                      className="group cursor-pointer"
                      onClick={() => window.open(vid.videoUrl, '_blank')}
                    >
                      <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden relative shadow-md group-hover:shadow-2xl transition-all">
                        <img 
                          src={vid.imageUrl} 
                          alt={vid.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-16 h-16 bg-sami-blue text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <Play size={32} fill="currentColor" />
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink size={16} />
                        </div>
                      </div>
                      <h4 className="mt-3 font-bold text-gray-900 group-hover:text-sami-blue transition-colors line-clamp-1">{vid.title}</h4>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                কোনো ভিডিও পাওয়া যায়নি।
              </div>
            )}
          </section>
        </div>
      )}
    </motion.div>
  );
};
