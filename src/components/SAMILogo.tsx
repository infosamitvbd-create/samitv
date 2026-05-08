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
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFj9Vggz6K8alsU_HhjhzliEjiij0iQBXBHM8ZPRIMET8EjAd3_ebQcFGWGplZCq0LB0gWXmmRaa7MGS5qvVI1Qui8Y50J92sgykRMhdCJMgDnQJShoY6OW9ULSgHYWYA5Lhm4OcXzdN1VvsTcDYdV82Hlwxg7anOL6r1bdhtmnebJsQCQih6uKeVHPUbY/s1068/NEW%20LOGO.png" 
          alt="Sami TV Logo" 
          className="h-24 w-auto object-contain drop-shadow-[0_12px_20px_rgba(204,0,0,0.3)] transition-all duration-500 group-hover:drop-shadow-[0_20px_35px_rgba(204,0,0,0.4)]"
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
