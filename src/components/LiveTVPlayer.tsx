import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Radio, Loader2, AlertCircle } from 'lucide-react';

export const LiveTVPlayer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const liveUrl = "https://padmaonline.duckdns.org:8088/SamiTV/index.m3u8";
  const Player = ReactPlayer as any;

  return (
    <div className="bg-black rounded-sm overflow-hidden relative aspect-video shadow-2xl border border-white/10 group">
      {/* Live Indicator Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-sm text-xs font-bold uppercase animate-pulse shadow-lg">
        <Radio size={14} />
        সরাসরি
      </div>

      {/* Loading State */}
      {loading && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-sm">
          <Loader2 size={48} className="text-sami-blue animate-spin mb-4" />
          <p className="text-white font-medium animate-pulse">লাইভ স্ট্রিম লোড হচ্ছে...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900 p-6 text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">স্ট্রিম লোড করতে সমস্যা হয়েছে</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            সার্ভার ডাউন থাকতে পারে অথবা আপনার ইন্টারনেট সংযোগ চেক করুন। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।
          </p>
          <button 
            onClick={() => { setError(false); setLoading(true); }}
            className="mt-6 bg-sami-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-sami-dark transition-all"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* Actual Player */}
      <div className="w-full h-full">
        {Player && (
          <Player
            url={liveUrl}
            playing={true}
            controls={true}
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
                  referrerPolicy: 'no-referrer'
                }
              }
            }}
          />
        )}
      </div>

      {/* Branding Overlay (Hidden when playing, or subtle) */}
      <div className="absolute bottom-12 right-4 pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity">
        <img 
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQ5UOEGSzZlZ-agaH9fVQiJVMVyMhv6aNEabwKq4kQwFEktnew6PgR7tfNMT-jOAwmfv6-JyQIvtx728t9h2OOIA8VirN8O6MBAB8ikV7jF5FYHU40mz1vEuHlgjVR863rTTc34-sHqGb3KAsGeWEVHEYVOfFsrAs7T-vQW6YmrqoFv0wV6CtnJx-buiSE/s1600/NEW%20LOGO.png" 
          alt="Sami TV" 
          className="h-8 w-auto grayscale brightness-200" 
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};
