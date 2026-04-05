import React, { useState } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { label: 'লাইভ টিভি', href: '/live', isSpecial: true },
  { label: 'জাতীয়', href: '/category/জাতীয়' },
  { label: 'রাজনীতি', href: '/category/রাজনীতি' },
  { label: 'আন্তর্জাতিক', href: '/category/আন্তর্জাতিক' },
  { label: 'সারাদেশ', href: '/category/সারাদেশ' },
  { label: 'খেলাধুলা', href: '/category/খেলাধুলা' },
  { label: 'বিনোদন', href: '/category/বিনোদন' },
  { label: 'তথ্যপ্রযুক্তি', href: '/category/তথ্যপ্রযুক্তি' },
  { label: 'জামালপুর', href: '/category/জামালপুর' },
  { label: 'আওয়ার ফ্যামিলি', href: '/family' },
  { label: 'মিডিয়া', href: '/media' },
  { label: 'আমাদের সম্পর্কে', href: '/about' },
  { label: 'ডাউনলোড', href: '/download' },
];

export const Navbar: React.FC<{ 
  onNavigate: (page: string) => void;
  currentPage: string;
  currentCategory: string;
}> = ({ onNavigate, currentPage, currentCategory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    onNavigate(href);
    setIsMenuOpen(false);
  };

  const isItemActive = (href: string) => {
    if (href.startsWith('/category/')) {
      const cat = href.replace('/category/', '');
      return currentPage === '/category' && currentCategory === cat;
    }
    return currentPage === href;
  };

  return (
    <nav className="bg-sami-blue text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12 max-w-7xl">
        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-1 font-medium text-[14px] h-full">
          {navItems.map((item) => {
            const isActive = isItemActive(item.href);
            return (
              <li key={item.label} className="h-full flex items-center">
                <button 
                  onClick={() => handleNavClick(item.href)}
                  className={`px-3 h-full flex items-center gap-1 transition-all duration-200 ${
                    isActive 
                      ? 'bg-white text-sami-blue font-bold' 
                      : item.isSpecial 
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                        : 'hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-sami-dark rounded transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 hover:bg-sami-dark rounded cursor-pointer transition-colors">
            <Menu size={20} />
            <span className="font-medium">অন্যান্য</span>
          </div>
          <button className="p-2 hover:bg-sami-dark rounded transition-colors">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-sami-dark border-t border-sami-blue/20 overflow-hidden"
          >
            <ul className="flex flex-col p-4 gap-2">
              {navItems.map((item) => {
                const isActive = isItemActive(item.href);
                return (
                  <li key={item.label}>
                    <button 
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full text-left py-3 px-4 rounded transition-all font-medium ${
                        isActive 
                          ? 'bg-white text-sami-blue font-bold' 
                          : item.isSpecial 
                            ? 'bg-red-600 text-white' 
                            : 'text-white hover:bg-sami-blue'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
