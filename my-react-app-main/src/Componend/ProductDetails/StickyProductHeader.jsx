import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useProduct } from '../../Context/UseContext';
import { useNavigate } from 'react-router-dom';

const categories = ['Trending', 'New Product'];

const SearchBar = ({ isSidebarOpen, hideSearchBar }) => {
  const { products } = useProduct();
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchText.trim()) {
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  }, [searchText, products]);

  const handleSuggestionClick = (item) => {
    setSearchText('');
    setSuggestions([]);
    navigate(`/products?highlight=${item.id}`);
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
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
          {/* Left Categories */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-white font-semibold px-3 py-1 rounded-md whitespace-nowrap transition-colors duration-200 ${
                  activeCategory === cat
                    ? 'bg-yellow-500 text-black'
                    : 'hover:bg-yellow-500 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          {!(isSidebarOpen && hideSearchBar) && (
            <div className="relative w-full sm:flex-grow">
              <input
                type="text"
                placeholder="Search a product..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={`w-full rounded-md bg-[#2a2a2a] text-white pl-4 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 ${
                  scrolled ? 'py-3 text-lg' : 'py-2 text-base'
                }`}
              />
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-[#2a2a2a] border border-gray-600 mt-1 rounded shadow-lg z-50 max-h-64 overflow-y-auto">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-2 hover:bg-yellow-500 hover:text-black cursor-pointer text-sm"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prevent layout shift */}
      {scrolled && <div className="h-[60px] sm:h-[56px]"></div>}
    </>
  );
};

export default SearchBar;



