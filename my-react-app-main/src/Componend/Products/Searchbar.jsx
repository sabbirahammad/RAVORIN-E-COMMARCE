import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useProduct } from '../../Context/UseContext';
import { useNavigate } from 'react-router-dom';

const categories = ['Trending', 'New Product'];

const SearchBar = ({ onSearch, isSidebarOpen, hideSearchBar }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { products } = useProduct();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchText.toLowerCase())
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
            ? 'fixed top-0 left-0 w-full z-50 border-b border-gray-800 bg-[#121212]/90 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.28)]'
            : 'relative'
        } transition-all duration-300`}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="rounded-2xl border border-gray-800 bg-[#1a1a1a]/90 backdrop-blur p-3 sm:p-4 shadow-[0_12px_30px_rgba(0,0,0,0.22)] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-yellow-500 text-black shadow'
                      : 'text-gray-300 bg-[#242424] hover:bg-[#2d2d2d]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {!(isSidebarOpen && hideSearchBar) && (
              <div className="relative w-full sm:flex-grow">
                <input
                  type="text"
                  placeholder="Search your style..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    onSearch && onSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  className={`w-full rounded-xl bg-[#101010] text-white border border-gray-700 pl-4 pr-11 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all duration-300 shadow-sm ${
                    scrolled ? 'py-3 text-lg' : 'py-2.5 text-base'
                  }`}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500" size={18} />

                {showSuggestions && searchText && (
                  <ul className="absolute left-0 right-0 mt-2 rounded-xl border border-gray-800 shadow-xl max-h-60 overflow-y-auto bg-[#181818] text-white z-50">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <li
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="flex items-center px-4 py-2.5 hover:bg-[#242424] cursor-pointer transition"
                        >
                          <img
                            src={Array.isArray(product.images) ? product.images[0] : product.image}
                            alt={product.name}
                            className="w-8 h-8 rounded object-cover mr-3"
                          />
                          <div>
                            <p className="font-semibold text-sm truncate text-white">{product.name}</p>
                            <p className="text-xs text-yellow-400">Tk {product.price}</p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-sm text-gray-400">No products found</li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {scrolled && <div className="h-[86px] sm:h-[82px]"></div>}
    </>
  );
};

export default SearchBar;
