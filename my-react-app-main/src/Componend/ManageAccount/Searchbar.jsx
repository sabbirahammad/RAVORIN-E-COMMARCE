import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useProduct } from '../../Context/UseContext';
import { useNavigate } from 'react-router-dom';
import CategoryMenu from './CategoryMenu';

const SearchBar = ({ onSearch, isSidebarOpen, hideSearchBar }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { products } = useProduct();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowDropdown(false); // auto close on scroll
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectProduct = (product) => {
    setSearchText('');
    setShowSuggestions(false);
    navigate(`/products?highlight=${product.id}`);
  };

  return (
    <>
      <div
        className={`${
          scrolled
            ? 'fixed top-0 left-0 w-full bg-[#1a1a1a] border-b border-gray-700 shadow-md z-50'
            : 'relative bg-[#1a1a1a]'
        } transition-all duration-300`}
      >
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 lg:gap-6 relative">
          {/* ✅ CATEGORY Dropdown (Hover or Click) */}
          <div
            className="relative group"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button
              className="text-white font-semibold px-2 sm:px-3 py-1 sm:py-2 rounded-md whitespace-nowrap bg-[#2b2b2b] hover:bg-[#444] transition text-[10px] sm:text-sm"
            >
              CATEGORY
            </button>

            {/* ▼ Dropdown Panel */}
            {showDropdown && (
              <div className="absolute top-full left-0 w-[300px] sm:w-[500px] lg:w-[800px] z-50 shadow-xl">
                <CategoryMenu />
              </div>
            )}
          </div>

          {/* ✅ Search Bar */}
          {!(isSidebarOpen && hideSearchBar) && (
            <div className="relative w-full sm:flex-grow">
              <input
                type="text"
                placeholder="Search a product"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  onSearch && onSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className={`w-full rounded-md bg-[#2a2a2a] text-white pl-3 sm:pl-4 pr-10 sm:pr-12 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 text-[12px] sm:text-sm lg:text-base ${
                  scrolled ? 'py-2 sm:py-3' : 'py-2 sm:py-3'
                }`}
              />
              <Search className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />

              {/* 🔽 Suggestions */}
              {showSuggestions && searchText && (
                <ul className="absolute left-0 right-0 mt-1 sm:mt-2 rounded-md shadow-lg max-h-48 sm:max-h-60 overflow-y-auto bg-white text-black z-50">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.slice(0, 6).map((product) => (
                      <li
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="flex items-center px-3 sm:px-4 py-2 sm:py-3 hover:bg-yellow-100 cursor-pointer transition"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded object-cover mr-2 sm:mr-3"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[10px] sm:text-sm truncate">{product.name}</p>
                          <p className="text-[9px] sm:text-xs text-gray-500">৳{product.price}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-sm text-gray-500">No products found</li>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prevent layout shift */}
      {scrolled && <div className="h-[50px] sm:h-[60px] lg:h-[70px]"></div>}
    </>
  );
};

export default SearchBar;

