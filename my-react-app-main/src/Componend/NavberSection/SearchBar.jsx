import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useProduct } from '../../Context/UseContext';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ isDarkMode }) => {
  const { products } = useProduct();
  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectProduct = (product) => {
    setSearchText('');
    setShowSuggestions(false);
    navigate(`/products?highlight=${product.id}`);
  };

  return (
    <div className="relative w-full md:w-auto mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className={`w-full px-3 sm:px-5 py-2 sm:py-3 rounded-md text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 shadow-md ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
          }`}
          aria-label="Search products"
        />
        <button
          className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-500"
          aria-label="Search button"
        >
          <Search size={18} />
        </button>
      </div>

      {showSuggestions && searchText && (
        <ul
          className={`absolute left-0 right-0 mt-2 rounded-md shadow-lg max-h-60 overflow-y-auto ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
          }`}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <li
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className="flex items-center px-4 py-2 hover:bg-yellow-100 dark:hover:bg-yellow-600 cursor-pointer transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 rounded object-cover mr-3"
                />
                <div>
                  <p className="font-semibold text-sm truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">৳{product.price}</p>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-gray-500">No products found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;



