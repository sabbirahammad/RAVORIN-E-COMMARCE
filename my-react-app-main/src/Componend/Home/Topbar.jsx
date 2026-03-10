import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiShoppingCart, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/GoogleAuth';

import DeliveryDropdown from '../NavberSection/eliveryDropdown';
import LanguageCurrencyDropdown from '../NavberSection/LanguageCurrencyDropdown';
import UserMenu from '../NavberSection/UserMenu';
import NavMenu from '../NavberSection/NavMenu';
import SearchBar from '../NavberSection/SearchBar';
import MobileSidebar from '../NavberSection/MobileSidebar';
import UserDropdown from './UserDropdown';

const Topbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: 'BD', name: 'Bangladesh' });
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const countries = [
    { code: 'BD', name: 'Bangladesh' },
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
  ];
  const languages = ['English', 'Bengali'];
  const currencies = ['USD', 'BDT'];

  const flagStyles = (code) => {
    switch (code) {
      case 'BD': return 'w-4 h-3 bg-green-600 rounded-sm mr-1';
      case 'US': return 'w-4 h-3 bg-red-600 rounded-sm mr-1';
      case 'UK': return 'w-4 h-3 bg-blue-600 rounded-sm mr-1';
      case 'CN': return 'w-4 h-3 bg-red-600 rounded-sm mr-1';
      case 'IN': return 'w-4 h-3 bg-orange-600 rounded-sm mr-1';
      default: return 'w-4 h-3 bg-gray-400 rounded-sm mr-1';
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-2xl shadow-gray-900/30' : 'shadow-lg shadow-gray-900/20'}`}>
        <div className={`transition-all duration-300 ${isScrolled ? 'bg-gray-900 shadow-2xl shadow-gray-900/50' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'} text-white`}>
          {/* Mobile full-width SearchBar on scroll */}
          {isMobile && isScrolled ? (
            <div className="w-full px-4 py-3">
              <SearchBar isDarkMode={isDarkMode} className="w-full" />
            </div>
          ) : (
            <>
              {/* Top bar - Hide completely on laptop/desktop when scrolled, always show on mobile */}
              <AnimatePresence>
                {(!isScrolled && !isMobile) || isMobile ? (
                  <motion.div
                    initial={{ opacity: 1, height: 'auto' }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm px-6 py-2 flex justify-between items-center border-b border-gray-600/30 overflow-visible relative z-40"
                  >
                    <div className="hidden md:flex items-center space-x-6 text-gray-300">
                      <DeliveryDropdown {...{ isDarkMode, activeDropdown, setActiveDropdown, selectedCountry, setSelectedCountry, countries, flagStyles }} />
                      <LanguageCurrencyDropdown {...{ isDarkMode, activeDropdown, setActiveDropdown, selectedLanguage, setSelectedLanguage, selectedCurrency, setSelectedCurrency, languages, currencies }} />
                    </div>
                    <div className="flex items-center space-x-6">
                      <Link to="/manageaccount" className="transition-all duration-300">
                        <motion.a
                          href="/register"
                          className="px-4 py-2 rounded-full transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          PROFILE
                        </motion.a>
                      </Link>

                      {/* ✅ FIXED: UserMenu Centered Dropdown */}
                      <div className="relative inline-block text-gray-300">
                        <UserMenu
                          isDarkMode={isDarkMode}
                          activeDropdown={activeDropdown}
                          setActiveDropdown={setActiveDropdown}
                          isSignedIn={isSignedIn}
                          setIsSignedIn={setIsSignedIn}
                        />
                        {/* Optional: Add global style if needed — usually handled inside UserMenu component */}
                      </div>

                      <div className="relative z-50">
                        <UserDropdown />
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Navbar section */}
              <nav className="px-6 py-4">
                <div className="container mx-auto flex items-center justify-between">
                  {/* Left Logo - Always visible */}
                  <AnimatePresence>
                    {!isMobileSearchOpen && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Link to="/" className="text-2xl font-extrabold tracking-tight hover:text-yellow-400 transition-all duration-300 hover:scale-105">
                          <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                            Ravorin
                          </span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Center Nav Menu - Always visible on desktop */}
                  <div className="hidden md:flex md:flex-1 md:justify-center">
                    <NavMenu {...{ isDarkMode, activeDropdown, setActiveDropdown }} />
                  </div>

                  {/* Right side: SearchBar (when scrolled) + Cart + Hamburger */}
                  <div className="flex items-center space-x-4">
                    {/* SearchBar - Show on laptop/desktop when scrolled */}
                    <AnimatePresence>
                      {!isMobile && isScrolled && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hidden md:block"
                        >
                          <SearchBar isDarkMode={isDarkMode} className="w-64" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Cart Icon - Always visible on desktop */}
                    <div className="hidden md:block">
                      <Link to="/cartpayment">
                        <button
                          className="transition-all duration-300 focus:outline-none p-2 rounded-full hover:bg-gray-800 hover:text-yellow-400 text-gray-300 hover:scale-110"
                          aria-label="Go to Cart Payment"
                        >
                          <FiShoppingCart className="w-6 h-6" />
                        </button>
                      </Link>
                    </div>

                    {/* Mobile Hamburger only */}
                    <div className="md:hidden flex items-center space-x-4">
                      <button onClick={() => setIsMobileMenuOpen(true)} className="focus:outline-none z-50 transition-all duration-300 hover:text-yellow-400 hover:scale-110 text-gray-300 p-2 rounded-full hover:bg-gray-800">
                        <FiMenu className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </nav>
            </>
          )}

          <AnimatePresence>
            {isMobileSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="md:hidden absolute top-0 left-0 right-0 p-4 backdrop-blur-sm bg-gray-900/95"
              >
                <SearchBar isDarkMode={isDarkMode} className="w-full" />
                <button onClick={() => setIsMobileSearchOpen(false)} className="absolute top-1/2 right-4 -translate-y-1/2 transition-all duration-300 hover:text-yellow-400 hover:scale-110 text-gray-300 p-2 rounded-full hover:bg-gray-800">
                  <FiX className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className='text-white'>
        <MobileSidebar
          isDarkMode={isDarkMode}
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          isSignedIn={isSignedIn}
          setIsSignedIn={setIsSignedIn}
        />
      </div>
    </>
  );
};

export default Topbar;
