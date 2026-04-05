import React from 'react';
import { motion } from 'motion/react';
import { Award, Target, Users, Quote, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white rounded-sm news-card-shadow overflow-hidden"
    >
      {/* Professional Header */}
      <div className="relative bg-sami-blue py-16 px-8 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-sami-dark rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">আমাদের নেতৃত্ব</h1>
          <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full mb-6"></div>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg font-medium">
            বস্তুনিষ্ঠ সাংবাদিকতা এবং আধুনিক প্রযুক্তির সমন্বয়ে সামি টিভিকে এগিয়ে নিয়ে যাচ্ছেন আমাদের দক্ষ নেতৃত্ব।
          </p>
        </div>
      </div>

      <div className="p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Chairman Card */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative shrink-0">
              <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQIlNZaI7KugfIRmOXvHPu4i_B9xUhdTeG8JBDSYRlRQxJEJNhUWxdQUnWvTfJFCxvDnF9D3oiZtlJcYksYnrJPdGon084dAjJ38JQFjWj0iyFc8Ed-4zaELMmQk27qfCHswas0Rh5hfEvoZrlz6BQwcaWTvXnnByRZPjfSWpOcbtnlT2OthhwDgVN1lgE/s320/645363491_979533377908521_7060082878587727711_n.jpg" 
                  alt="Chairman" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-red-600 text-white p-3 rounded-xl shadow-lg">
                <Award size={24} />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-3xl text-gray-900 mb-1">Md. Abul Kashem</h3>
              <p className="text-sami-blue font-bold text-xl mb-4 uppercase tracking-wider">চেয়ারম্যান</p>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-sami-blue hover:shadow-md transition-all cursor-pointer border border-gray-100"><Facebook size={18} /></div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-sami-blue hover:shadow-md transition-all cursor-pointer border border-gray-100"><Linkedin size={18} /></div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-sami-blue hover:shadow-md transition-all cursor-pointer border border-gray-100"><Mail size={18} /></div>
              </div>
              <p className="text-gray-600 leading-relaxed italic relative">
                <Quote size={20} className="absolute -left-6 -top-2 text-gray-200" />
                "সামি টেলিভিশনের স্বপ্নদ্রষ্টা এবং অভিভাবক। তাঁর বলিষ্ঠ নেতৃত্বে আমরা বস্তুনিষ্ঠ সাংবাদিকতার পথে এগিয়ে চলেছি।"
              </p>
            </div>
          </motion.div>

          {/* Managing Director Card */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative shrink-0">
              <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgjVlW6FgrzRXXO0p0T_dpOUIYEoFxOB347KnDys4clH-LxgfPLiHHGbp49da2QV6XuOnATrk4HzEtHqEKwzfNPHvR5QwiaB-ML7zgOplLW7Ajz12gXuftT0oKofsXu4pfI74gOPr88xVZ_Si7X7wdimSxOgt17QKgCy6vzSXJfm6j7qGs7WXYd2hRcVzlj/s320/656002480_970541098659349_900311477486710105_n.jpg" 
                  alt="Managing Director" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-sami-blue text-white p-3 rounded-xl shadow-lg">
                <Target size={24} />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-3xl text-gray-900 mb-1">Emran Hasan Sami</h3>
              <p className="text-sami-blue font-bold text-xl mb-4 uppercase tracking-wider">ম্যানেজিং ডিরেক্টর</p>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-sami-blue hover:shadow-md transition-all cursor-pointer border border-gray-100"><Facebook size={18} /></div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-sami-blue hover:shadow-md transition-all cursor-pointer border border-gray-100"><Twitter size={18} /></div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-sami-blue hover:shadow-md transition-all cursor-pointer border border-gray-100"><Mail size={18} /></div>
              </div>
              <p className="text-gray-600 leading-relaxed italic relative">
                <Quote size={20} className="absolute -left-6 -top-2 text-gray-200" />
                "তরুণ ও উদ্যমী নেতৃত্ব। সামি টেলিভিশনের আধুনিকায়ন এবং প্রযুক্তিগত উৎকর্ষ সাধনে তাঁর ভূমিকা অপরিসীম।"
              </p>
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-sami-light text-sami-blue rounded-xl flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">আমাদের লক্ষ্য</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              বস্তুনিষ্ঠ সংবাদ পরিবেশনের মাধ্যমে সমাজের দর্পণ হিসেবে কাজ করা এবং মানুষের তথ্য অধিকার নিশ্চিত করা।
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">আমাদের মূল্যবোধ</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              সততা, নিরপেক্ষতা এবং সাহসিকতার সাথে সংবাদ প্রচার করা। আমরা কোনো দল বা গোষ্ঠীর পক্ষপাত করি না।
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">আমাদের অর্জন</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              অল্প সময়েই জামালপুরসহ সারাদেশে বিশ্বস্ত একটি নিউজ পোর্টাল হিসেবে নিজেদের প্রতিষ্ঠিত করতে সক্ষম হয়েছি।
            </p>
          </div>
        </div>

        <div className="mt-16 p-10 bg-gradient-to-br from-sami-dark to-sami-blue rounded-3xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Quote size={32} className="text-red-500" />
              প্রতিষ্ঠাতার বার্তা
            </h3>
            <p className="text-lg text-blue-50 leading-relaxed italic mb-8">
              "দেশ-বিদেশের সংবাদ নির্ভুল ও বস্তুনিষ্ঠভাবে প্রকাশ করে সামী টিভি। সাংবাদিকতার নীতি মেনে সংবাদ সংগ্রহ ও প্রচারে বিশ্বাসী আমরা। এতে কোনো দল, গোষ্ঠী বা মতবাদের প্রতি পক্ষপাত করা হয় না। থাকে, বাংলায় কথা বলে । খবরের ভেতরের খবর ও বিশ্লেষণে সর্বোচ্চ উৎকর্ষতা বজায় রাখার চেষ্টা করে সামী টিভি ।"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgjVlW6FgrzRXXO0p0T_dpOUIYEoFxOB347KnDys4clH-LxgfPLiHHGbp49da2QV6XuOnATrk4HzEtHqEKwzfNPHvR5QwiaB-ML7zgOplLW7Ajz12gXuftT0oKofsXu4pfI74gOPr88xVZ_Si7X7wdimSxOgt17QKgCy6vzSXJfm6j7qGs7WXYd2hRcVzlj/s320/656002480_970541098659349_900311477486710105_n.jpg" alt="Founder" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="font-bold">Emran Hasan Sami</p>
                <p className="text-xs text-blue-200">প্রতিষ্ঠাতা ও ম্যানেজিং ডিরেক্টর, সামি টিভি</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
