import React from 'react';

export const SAMILogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEherA1uXsmj4szGD1Fd-xiaMEiSWfMScY0dtSUBJ0EtbJJgGJ3g685mlKguqkyD1hlqBdecqT_3VT2evjJ-pAoUHTUAxEb9xndqYCFbXxq9YR89dIfzFBHogTf8CyryGgvbOYvnhFsgu5ugqCm9ngBLAv6EqTSBoY8siT7Di4N_mpZG0LRYCiGpheph7_jc/s320/mmmm.png" 
        alt="Sami TV Logo" 
        className="h-20 w-auto object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.03)]"
        referrerPolicy="no-referrer"
      />
      <div className="text-sami-blue font-bold text-sm mt-1">সামি টেলিভিশন</div>
      <div className="text-gray-500 text-[10px]">দিগপাইত জামালপুর</div>
    </div>
  );
};
