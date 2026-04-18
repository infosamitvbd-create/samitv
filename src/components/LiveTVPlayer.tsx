import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Radio, Loader2, AlertCircle, Maximize, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LiveTVPlayer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const liveUrl = "https://padmaonline.duckdns.org:8088/SamiTV/index.m3u8";
  const Player = ReactPlayer as any;

  const toggleFullscreen = () => {
    const el = document.getElementById('sami-player-root');
    if (el) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        el.requestFullscreen();
      }
    }
  };

  return (
    <div 
      id="sami-player-root"
      className="bg-black rounded-sm overflow-hidden relative aspect-video shadow-2xl border border-white/5 group ring-1 ring-white/10"
    >
      {/* Background Poster / Brand Layer */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 to-black">
        <img 
          src="https://picsum.photos/seed/news/1280/720?blur=10" 
          alt="" 
          className="w-full h-full object-cover opacity-20 pointer-events-none"
        />
      </div>

      {/* Top Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 pt-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[-10px] group-hover:translate-y-0">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white px-2.5 py-1 rounded-[4px] text-[10px] font-black uppercase flex items-center gap-1.5 shadow-xl shadow-red-600/30 ring-1 ring-white/20">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            সরাসরি
          </div>
          <div className="h-4 w-[1px] bg-white/20"></div>
          <h4 className="text-white/80 font-bold text-[11px] uppercase tracking-wider drop-shadow-md">Sami TV Official HD</h4>
        </div>
        <div className="flex items-center gap-2">
            <button 
              onClick={() => { setError(false); setLoading(true); }}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md border border-white/10"
              title="রিফ্রেশ"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      {/* Center UI (Play/Loading) */}
      <AnimatePresence>
        {!playing && !error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          >
            <button 
              onClick={() => setPlaying(true)}
              className="w-16 h-16 bg-sami-red text-white rounded-full flex items-center justify-center shadow-2xl shadow-sami-red/40 transform transition-all hover:scale-110 active:scale-95 group/play"
            >
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1 drop-shadow-lg group-hover/play:scale-110 transition-transform"></div>
            </button>
            <div className="absolute bottom-10 text-center">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">অনলাইন সম্প্রচার</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && playing && !error && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-gray-900/95">
          <div className="relative">
             <Loader2 size={40} className="text-sami-red animate-spin mb-4" />
             <div className="absolute inset-0 blur-xl bg-sami-red/20 rounded-full animate-pulse"></div>
          </div>
          <p className="text-white font-bold text-sm tracking-tight animate-pulse">সংযুক্ত হচ্ছে...</p>
          <p className="text-gray-500 text-[10px] mt-2 font-medium tracking-widest uppercase">Streaming HD</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-gray-900 p-8 text-center bg-gradient-to-br from-gray-900 to-black">
          <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-red-600/5">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h3 className="text-white font-black text-xl mb-3 tracking-tight">দুঃখিত! সাময়িক বিভ্রাট</h3>
          <p className="text-gray-400 text-xs max-w-xs leading-relaxed font-medium mb-8">
            আমাদের সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে। দয়া করে আপনার ইন্টারনেট চেক করে রিফ্রেশ বাটনে ক্লিক করুন।
          </p>
          <button 
            onClick={() => { setError(false); setLoading(true); setPlaying(true); }}
            className="bg-white text-gray-900 px-8 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-sami-accent transition-all shadow-xl active:scale-95 flex items-center gap-2"
          >
            <RefreshCw size={14} /> পুনরায় চেষ্টা করুন
          </button>
        </div>
      )}

      {/* Actual Player */}
      <div className="w-full h-full relative z-10">
        {Player && (
          <Player
            url={liveUrl}
            playing={playing}
            controls={false}
            muted={muted}
            width="100%"
            height="100%"
            onReady={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
            config={{
              file: {
                forceHLS: true,
                attributes: {
                  controlsList: 'nodownload',
                  referrerPolicy: 'no-referrer',
                  style: { width: '100%', height: '100%', objectFit: 'cover' }
                }
              }
            }}
          />
        )}
      </div>

      {/* Bottom Controls Overlay */}
      {playing && !error && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[10px] group-hover:translate-y-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setPlaying(!playing)}
                className="text-white hover:text-sami-red transition-colors"
              >
                {playing ? (
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-4 bg-current rounded-full"></div>
                    <div className="w-1.5 h-4 bg-current rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-current border-b-[8px] border-b-transparent ml-1"></div>
                )}
              </button>
              <div className="flex items-center gap-2 group/vol">
                <button 
                  onClick={() => setMuted(!muted)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden hidden group-hover/vol:block">
                   <div className={`h-full bg-sami-red transition-all ${muted ? 'w-0' : 'w-full'}`}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
                 <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                 <span className="text-[10px] text-white/70 font-black uppercase tracking-widest">LIVE</span>
              </div>
              <button 
                onClick={toggleFullscreen}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Watermark */}
      <div className="absolute bottom-16 right-4 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity z-20">
        <div className="flex flex-col items-end gap-1">
           <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQ5UOEGSzZlZ-agaH9fVQiJVMVyMhv6aNEabwKq4kQwFEktnew6PgR7tfNMT-jOAwmfv6-JyQIvtx728t9h2OOIA8VirN8O6MBAB8ikV7jF5FYHU40mz1vEuHlgjVR863rTTc34-sHqGb3KAsGeWEVHEYVOfFsrAs7T-vQW6YmrqoFv0wV6CtnJx-buiSE/s1600/NEW%20LOGO.png" 
            alt="" 
            className="h-6 w-auto grayscale brightness-200" 
            referrerPolicy="no-referrer"
          />
          <span className="text-[8px] text-white font-black uppercase tracking-[0.2em] bg-black/40 px-1">SAMI TV HD</span>
        </div>
      </div>
    </div>
  );
};
