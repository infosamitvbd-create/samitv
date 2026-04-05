import React from 'react';
import { Play, Radio, Maximize2, Volume2 } from 'lucide-react';

export const LiveTVPlayer: React.FC = () => {
  return (
    <div className="bg-black rounded-sm overflow-hidden relative group aspect-video shadow-2xl">
      {/* Live Indicator */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase animate-pulse">
        <Radio size={12} />
        সরাসরি
      </div>

      {/* Video Overlay / Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform cursor-pointer border border-white/30">
            <Play size={32} className="text-white fill-white ml-1" />
          </div>
          <p className="text-white font-bold text-sm drop-shadow-lg">সামি টিভি লাইভ দেখুন</p>
        </div>
      </div>

      {/* Controls Bar (Visual only for now) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
          <Play size={16} className="text-white fill-white cursor-pointer" />
          <Volume2 size={16} className="text-white cursor-pointer" />
          <div className="w-24 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-sami-blue"></div>
          </div>
        </div>
        <Maximize2 size={16} className="text-white cursor-pointer" />
      </div>

      {/* Actual Iframe (Placeholder for real stream) */}
      {/* In a real scenario, replace with actual stream URL */}
      <iframe 
        src="https://www.youtube.com/embed/live_stream?channel=UC_YOUR_CHANNEL_ID_HERE&autoplay=0&mute=1" 
        className="w-full h-full opacity-40"
        title="SAMI TV Live"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
