import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavItem {
  label: string;
  href: string;
  isSpecial?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: 'লাইভ টিভি', href: '/live', isSpecial: true },
  { label: 'জাতীয়', href: '/category/জাতীয়' },
  { label: 'রাজনীতি', href: '/category/রাজনীতি' },
  { label: 'আন্তর্জাতিক', href: '/category/আন্তর্জাতিক' },
  { label: 'বিশ্ব', href: '/category/বিশ্ব' },
  { label: 'বাণিজ্য', href: '/category/বাণিজ্য' },
  { label: 'সারাদেশ', href: '/category/সারাদেশ' },
  { label: 'সরিষাবাড়ী', href: '/category/সরিষাবাড়ী' },
  { label: 'খেলাধুলা', href: '/category/খেলাধুলা' },
  { label: 'বিনোদন', href: '/category/বিনোদন' },
  { label: 'তথ্যপ্রযুক্তি', href: '/category/তথ্যপ্রযুক্তি' },
  { label: 'জামালপুর', href: '/category/জামালপুর' },
  { label: 'আওয়ার ফ্যামিলি', href: '/family' },
];

const otherNavItems: NavItem[] = [
  { label: 'মিডিয়া', href: '/media' },
  { label: 'আমাদের সম্পর্কে', href: '/about' },
  { label: 'যোগাযোগ', href: '/contact' },
  { label: 'ডাউনলিংক প্যারামিটার', href: '/downlink' },
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
      return currentPage === '/category' && currentCategory === cat;
    }
    return currentPage === href;
  };

  return (
    <nav className="bg-sami-teal text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12 max-w-7xl">
        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-1 font-bold text-[14px] h-full">
          {mainNavItems.map((item) => {
            const isActive = isItemActive(item.href);
            return (
              <li key={item.label} className="h-full flex items-center">
                <button 
                  onClick={() => handleNavClick(item.href)}
                  className={`px-3 h-full flex items-center gap-1 transition-all duration-200 ${
                    isActive 
                      ? 'bg-white text-sami-teal font-bold' 
                      : item.isSpecial 
                        ? 'bg-sami-red hover:bg-red-700 animate-pulse' 
                        : 'hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
          
          {/* Others Dropdown Desktop */}
          <li className="h-full flex items-center relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsOthersOpen(!isOthersOpen)}
              className={`px-4 h-full flex items-center gap-2 transition-all duration-200 hover:bg-white/10 ${isOthersOpen ? 'bg-white/10' : ''}`}
            >
              অন্যান্য <ChevronDown size={16} className={`transition-transform ${isOthersOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isOthersOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-48 bg-white text-gray-800 shadow-2xl rounded-b-sm py-2 border-t-2 border-sami-red"
                >
                  {otherNavItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-gray-50 transition-colors flex items-center justify-between ${isItemActive(item.href) ? 'text-sami-red bg-sami-light/30' : ''}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
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
            className="lg:hidden bg-sami-dark border-t border-white/10 overflow-hidden"
          >
            <ul className="flex flex-col p-4 gap-2">
              {[...mainNavItems, ...otherNavItems].map((item) => {
                const isActive = isItemActive(item.href);
                return (
                  <li key={item.label}>
                    <button 
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full text-left py-3 px-4 rounded transition-all font-bold ${
                        isActive 
                          ? 'bg-white text-sami-teal font-bold' 
                          : item.isSpecial 
                            ? 'bg-sami-red text-white' 
                            : 'text-white hover:bg-sami-teal'
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
