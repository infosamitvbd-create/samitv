import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavItem {
  label: string;
  href: string;
  isSpecial?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: 'প্রচ্ছদ', href: '/' },
  { label: 'জাতীয়', href: '/category/জাতীয়' },
  { label: 'রাজনীতি', href: '/category/রাজনীতি' },
  { label: 'অর্থনীতি', href: '/category/অর্থনীতি' },
  { label: 'সারা দেশ', href: '/category/সারা দেশ' },
  { label: 'আন্তর্জাতিক', href: '/category/আন্তর্জাতিক' },
  { label: 'জামালপুর', href: '/category/জামালপুর' },
  { label: 'খেলা-ধুলা', href: '/category/খেলাধুলা' },
  { label: 'তথ্য-প্রযুক্তি', href: '/category/তথ্যপ্রযুক্তি' },
  { label: 'বিনোদন', href: '/category/বিনোদন' },
];

const otherNavItems: NavItem[] = [
  { label: 'মিডিয়া', href: '/media' },
  { label: 'আমাদের সম্পর্কে', href: '/about' },
  { label: 'যোগাযোগ', href: '/contact' },
  { label: 'ডাউনলিংক প্যারামিটার', href: '/downlink' },
  { label: 'আওয়ার ফ্যামিলি', href: '/family' },
  { label: 'লাইভ টিভি', href: '/live' },
];

export const Navbar: React.FC<{ 
  onNavigate: (page: string) => void;
  currentPage: string;
  currentCategory: string;
}> = ({ onNavigate, currentPage, currentCategory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOthersOpen, setIsOthersOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOthersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (href: string) => {
    onNavigate(href);
    setIsMenuOpen(false);
    setIsOthersOpen(false);
  };

  const isItemActive = (href: string) => {
    if (href.startsWith('/category/')) {
      const cat = href.replace('/category/', '');
      return currentPage.includes('/category/') && currentCategory === cat;
    }
    return currentPage === href;
  };

  return (
    <nav className="bg-[#1a1a1a] text-white sticky top-0 z-50 shadow-lg border-b border-black">
      <div className="container mx-auto px-4 flex items-center justify-between h-10 max-w-7xl">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center font-bold text-[12px] h-full uppercase tracking-tighter">
          {mainNavItems.map((item) => {
            const isActive = isItemActive(item.href);
            return (
              <li key={item.label} className="h-full flex items-center border-r border-white/10 last:border-0">
                <button 
                  onClick={() => handleNavClick(item.href)}
                  className={`px-3 h-full flex items-center transition-all duration-200 ${
                    isActive 
                      ? 'bg-sami-red text-white' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
          
          {/* Others Dropdown Desktop */}
          <li className="h-full flex items-center relative border-l border-white/10" ref={dropdownRef}>
            <button 
              onClick={() => setIsOthersOpen(!isOthersOpen)}
              className={`px-4 h-full flex items-center gap-1 transition-all duration-200 hover:bg-white/10 ${isOthersOpen ? 'bg-white/10' : ''}`}
            >
              অন্যান্য <ChevronDown size={14} className={`transition-transform ${isOthersOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isOthersOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 w-48 bg-white text-gray-800 shadow-2xl py-2 border-t-2 border-sami-red"
                >
                  {otherNavItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-gray-50 transition-colors ${isItemActive(item.href) ? 'text-sami-red' : ''}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-white/5 rounded-full transition-all text-white/70 hover:text-white">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="lg:hidden fixed inset-0 top-10 bg-sami-dark z-50 overflow-y-auto"
          >
            <ul className="flex flex-col p-6 gap-2">
              {[...mainNavItems, ...otherNavItems].map((item) => {
                const isActive = isItemActive(item.href);
                return (
                  <li key={item.label}>
                    <button 
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full text-left py-4 px-6 rounded-2xl transition-all font-black uppercase tracking-tighter text-sm ${
                        isActive 
                          ? 'bg-sami-red text-white shadow-lg shadow-sami-red/20' 
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
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
