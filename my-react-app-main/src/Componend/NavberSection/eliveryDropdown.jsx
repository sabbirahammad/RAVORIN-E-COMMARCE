import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DeliveryDropdown = ({
  isDarkMode,
  activeDropdown,
  setActiveDropdown,
  selectedCountry,
  setSelectedCountry,
  countries,
  flagStyles,
}) => {
  const handleChange = (e) => {
    const country = countries.find((c) => c.code === e.target.value);
    setSelectedCountry(country);
    setActiveDropdown(null);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setActiveDropdown('delivery')}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <button className="flex items-center hover:text-yellow-400 transition-colors">
        <span className={flagStyles(selectedCountry.code)}></span>
        Deliver to: {selectedCountry.name}
      </button>

      <AnimatePresence>
        {activeDropdown === 'delivery' && (
          <motion.div
            className={`absolute left-0 mt-2 w-72 rounded-md shadow-xl z-50 p-4 ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Specify your location
            </p>
            <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Shipping options and fees vary based on your location
            </p>
            <button
              onClick={() => setActiveDropdown(null)}
              className="text-yellow-500 text-xs hover:underline mb-2 block"
            >
              Sign in to add address
            </button>
            <div className="flex items-center mb-2">
              <span className={flagStyles(selectedCountry.code)}></span>
              <select
                onChange={handleChange}
                value={selectedCountry.code}
                className={`w-full p-2 rounded-md border-none focus:outline-none ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="Enter ZIP or postal code"
              className={`w-full p-2 rounded-md mb-2 focus:outline-none ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
              }`}
            />
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

export default DeliveryDropdown;

