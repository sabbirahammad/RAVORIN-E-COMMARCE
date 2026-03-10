import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageCurrencyDropdown = ({
  isDarkMode,
  activeDropdown,
  setActiveDropdown,
  selectedLanguage,
  setSelectedLanguage,
  selectedCurrency,
  setSelectedCurrency,
  languages,
  currencies,
}) => {
  return (
    <div
      className="relative"
      onMouseEnter={() => setActiveDropdown('language')}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <button className="flex items-center hover:text-yellow-400 transition-colors">
        <span className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></span>
        {selectedLanguage}-{selectedCurrency}
      </button>

      <AnimatePresence>
        {activeDropdown === 'language' && (
          <motion.div
            className={`absolute left-0 mt-2 w-44 rounded-md shadow-md z-50 p-4 ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Select Language and Currency
            </p>
            <div className="mb-2">
              <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Language</label>
              <select
                onChange={(e) => setSelectedLanguage(e.target.value)}
                value={selectedLanguage}
                className={`w-full p-2 rounded-md border-none focus:outline-none mt-1 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Currency</label>
              <select
                onChange={(e) => setSelectedCurrency(e.target.value)}
                value={selectedCurrency}
                className={`w-full p-2 rounded-md border-none focus:outline-none mt-1 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setActiveDropdown(null)}
              className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Save
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageCurrencyDropdown;

