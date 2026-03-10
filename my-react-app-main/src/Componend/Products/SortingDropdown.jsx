import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SortingDropdown = ({ sortBy, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'default', label: 'Default Sorting' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'rating', label: 'Average Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  const currentSortLabel = sortOptions.find(option => option.value === sortBy)?.label || 'Default Sorting';

  const handleSortChange = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-4 px-4">
      <label className="block text-sm font-semibold text-gray-300 mb-2">
        Sort Products:
      </label>

      {/* Mobile/Tablet Select Dropdown */}
      <div className="md:hidden">
        <select
          value={sortBy}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-[#1a1a1a] px-4 py-3 text-white shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 transition-colors"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Custom Dropdown */}
      <div className="hidden md:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full max-w-xs px-4 py-3 text-left bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-sm hover:bg-[#242424] focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-colors"
        >
          <span className="text-white font-medium">{currentSortLabel}</span>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 w-full max-w-xs mt-1 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-[#242424] focus:outline-none focus:bg-[#242424] transition-colors ${
                    sortBy === option.value
                      ? 'bg-yellow-500/10 text-yellow-300 font-medium'
                      : 'text-gray-200'
                  }`}
                >
                  {option.label}
                  {sortBy === option.value && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline w-4 h-4 ml-2 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </motion.svg>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SortingDropdown;
