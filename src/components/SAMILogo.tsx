import React from 'react';
import { motion } from 'motion/react';

export const SAMILogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex flex-col items-center relative group ${className}`}
    >
      <motion.div
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        <img 
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQ5UOEGSzZlZ-agaH9fVQiJVMVyMhv6aNEabwKq4kQwFEktnew6PgR7tfNMT-jOAwmfv6-JyQIvtx728t9h2OOIA8VirN8O6MBAB8ikV7jF5FYHU40mz1vEuHlgjVR863rTTc34-sHqGb3KAsGeWEVHEYVOfFsrAs7T-vQW6YmrqoFv0wV6CtnJx-buiSE/s1600/NEW%20LOGO.png" 
          alt="Sami TV Logo" 
          className="h-28 w-auto object-contain drop-shadow-[0_8px_15px_rgba(255,0,0,0.1)] transition-all duration-500 group-hover:drop-shadow-[0_12px_20px_rgba(255,0,0,0.2)]"
          referrerPolicy="no-referrer"
        />
        
        {/* Shine effect overlay */}
        <motion.div
          initial={{ left: '-150%' }}
          animate={{ left: '150%' }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "linear"
          }}
          className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
};
