import React from 'react';
import { motion } from 'motion/react';

export const AboutUs: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-white p-8 rounded-sm news-card-shadow"
    >
      <h2 className="text-2xl font-bold text-sami-blue mb-8 border-b-2 border-sami-blue pb-2 inline-block">আমাদের নেতৃত্ব</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Chairman */}
        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-48 h-48 shrink-0 mb-6">
            <img 
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQIlNZaI7KugfIRmOXvHPu4i_B9xUhdTeG8JBDSYRlRQxJEJNhUWxdQUnWvTfJFCxvDnF9D3oiZtlJcYksYnrJPdGon084dAjJ38JQFjWj0iyFc8Ed-4zaELMmQk27qfCHswas0Rh5hfEvoZrlz6BQwcaWTvXnnByRZPjfSWpOcbtnlT2OthhwDgVN1lgE/s320/645363491_979533377908521_7060082878587727711_n.jpg" 
              alt="Chairman" 
              className="w-full h-full object-cover rounded-full shadow-lg border-4 border-sami-blue"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="font-bold text-2xl text-gray-900">মোঃ আবুল কাশেম</h3>
          <p className="text-sami-blue font-bold text-lg mt-1">চেয়ারম্যান</p>
          <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            সামি টেলিভিশনের স্বপ্নদ্রষ্টা এবং অভিভাবক। তাঁর বলিষ্ঠ নেতৃত্বে আমরা বস্তুনিষ্ঠ সাংবাদিকতার পথে এগিয়ে চলেছি।
          </p>
        </div>

        {/* Managing Director */}
        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-48 h-48 shrink-0 mb-6">
            <img 
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgjVlW6FgrzRXXO0p0T_dpOUIYEoFxOB347KnDys4clH-LxgfPLiHHGbp49da2QV6XuOnATrk4HzEtHqEKwzfNPHvR5QwiaB-ML7zgOplLW7Ajz12gXuftT0oKofsXu4pfI74gOPr88xVZ_Si7X7wdimSxOgt17QKgCy6vzSXJfm6j7qGs7WXYd2hRcVzlj/s320/656002480_970541098659349_900311477486710105_n.jpg" 
              alt="Managing Director" 
              className="w-full h-full object-cover rounded-full shadow-lg border-4 border-sami-blue"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="font-bold text-2xl text-gray-900">এমরান হাসান সামি</h3>
          <p className="text-sami-blue font-bold text-lg mt-1">ম্যানেজিং ডিরেক্টর</p>
          <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            তরুণ ও উদ্যমী নেতৃত্ব। সামি টেলিভিশনের আধুনিকায়ন এবং প্রযুক্তিগত উৎকর্ষ সাধনে তাঁর ভূমিকা অপরিসীম।
          </p>
        </div>
      </div>

      <div className="mt-12 p-8 bg-sami-light rounded-xl border border-sami-blue/20">
        <h3 className="text-xl font-bold text-sami-dark mb-4">আমাদের লক্ষ্য</h3>
        <p className="text-gray-700 leading-relaxed">
          সামি টেলিভিশন শুধু একটি টেলিভিশন চ্যানেল নয়, এটি গণমানুষের কণ্ঠস্বর। দিগপাইত, জামালপুর থেকে আমাদের এই পথচলা শুরু হলেও আজ আমরা সারা বিশ্বের বাংলা ভাষাভাষী মানুষের হৃদয়ে জায়গা করে নিতে চাই। আমরা বিশ্বাস করি বস্তুনিষ্ঠ সংবাদ এবং সুস্থ বিনোদনের মাধ্যমে একটি সুন্দর সমাজ গঠন সম্ভব।
        </p>
      </div>
    </motion.div>
  );
};
