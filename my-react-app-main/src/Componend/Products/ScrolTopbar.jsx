import React, { useState, useEffect } from 'react';

const TopBar = ({ onSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  // স্ক্রল ইভেন্ট লিসেনার
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // কার্ট টগল
  const toggleCart = () => setCartOpen(!cartOpen);

  return (
    <>
      <div className={`fixed top-0 left-0 w-full bg-[#1a1a1a] border-b border-gray-700 z-50 flex items-center justify-between px-6 py-2 transition-all duration-300`}>
        {/* Search Bar */}
        <div
          className={`flex-1 max-w-4xl mx-auto relative transition-all duration-300 ${
            scrolled ? 'py-3' : 'py-1'
          }`}
        >
          <input
            type="text"
            placeholder="Search a product"
            value={searchText}
            onChange={e => {
              setSearchText(e.target.value);
              onSearch(e.target.value);
            }}
            className={`w-full rounded-md bg-[#2a2a2a] text-white pl-4 pr-10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400 ${
              scrolled ? 'text-lg py-3' : 'text-sm py-2'
            }`}
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 cursor-pointer"
            aria-label="Search"
            onClick={() => onSearch(searchText)}
          >
            🔍
          </button>
        </div>

        {/* Cart Button */}
        <div className="ml-6 relative">
          <button
            onClick={toggleCart}
            className="relative p-2 rounded-full bg-[#2a2a2a] hover:bg-yellow-600 transition-colors duration-300 text-white shadow-md"
            aria-label="Toggle Cart"
          >
            🛒
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </button>

          {/* Cart Panel */}
          <div
            className={`fixed top-14 right-6 w-72 bg-[#222222] border border-gray-600 rounded-md shadow-lg p-4 transition-transform duration-300 z-50
              ${cartOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}
          >
            <h3 className="text-yellow-400 font-semibold mb-3">Your Cart</h3>
            <p className="text-gray-300">Cart items will be shown here.</p>
            <button
              onClick={toggleCart}
              className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* To push the content down below fixed topbar */}
      <div className={`h-16 ${scrolled ? 'h-20' : 'h-16'}`}></div>
    </>
  );
};

export default TopBar;

