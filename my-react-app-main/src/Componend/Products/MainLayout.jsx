import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Topbar from './Topbar';
import SearchBar from './Searchbar';
import SidebarFilter from './SidebarFilter';
import SortingDropdown from './SortingDropdown';
import ProductGrid from './ProductGrid';
import Navbar from './Navbar';
import ChatButton from './ChatButton';
import CartSidebar from './CartSideBar';
import { useProduct } from '../../Context/UseContext';

const MainLayout = ({
  selectedCategories = [],
  searchQuery = '',
  onCategoryChange,
  onSearchChange,
  clearAllFilters
}) => {
  const [sortBy, setSortBy] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hideSearchBar, setHideSearchBar] = useState(false);

  const { cartItems, setCartItems, products = [] } = useProduct();

  const location = useLocation();
  const routeCategory = location.state?.category;

  useEffect(() => {
    if (routeCategory && onCategoryChange) {
      onCategoryChange(routeCategory);
    }
  }, [routeCategory]);

  const handleAddToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      return existing
        ? prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          )
        : [...prev, { ...product, qty: 1 }];
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isSidebarOpen && window.innerWidth < 768) {
        setHideSearchBar(window.scrollY > 50);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSidebarOpen]);

  return (
    <div className="relative min-h-screen font-sans bg-[#121212] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-10 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute top-40 -right-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <Topbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        selectedCategories={selectedCategories}
        handleCategoryChange={onCategoryChange}
      />

      <Navbar
        setSidebarOpen={setIsSidebarOpen}
        selectedCategories={selectedCategories}
        onCategoryChange={onCategoryChange}
      />

      <CartSidebar
        cartItems={cartItems}
        setCartItems={setCartItems}
        isDarkMode={isDarkMode}
      />

      <SearchBar
        onSearch={onSearchChange}
        isSidebarOpen={isSidebarOpen}
        hideSearchBar={hideSearchBar}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 mt-4">
        <section className="mb-6 overflow-hidden rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-[#171717] via-[#1f1f1f] to-[#252525] p-6 sm:p-8 text-white shadow-[0_22px_50px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-yellow-400/85">Curated Collection</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black leading-tight">Find Your Next Favorite Outfit</h2>
              <p className="mt-2 text-gray-300 text-sm sm:text-base">Trendy drops, premium quality, and unbeatable prices all in one place.</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-300 backdrop-blur">{products.length} Items</span>
              <span className="rounded-full border border-gray-700 bg-black/20 px-4 py-2 text-sm font-semibold text-gray-200 backdrop-blur">Fast Delivery</span>
              <span className="rounded-full border border-gray-700 bg-black/20 px-4 py-2 text-sm font-semibold text-gray-200 backdrop-blur">Cash on Delivery</span>
            </div>
          </div>
        </section>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 flex">
        <SidebarFilter
          selectedCategories={selectedCategories}
          onCategoryChange={onCategoryChange}
          className="hidden md:block sticky top-24"
        />

        <main className="flex-1 p-2 sm:p-4 md:p-6">
          {(selectedCategories.length > 0 || searchQuery) && clearAllFilters && (
            <div className="mb-4 p-3 rounded-2xl flex items-center justify-between border border-gray-800 bg-[#1a1a1a]/95 backdrop-blur shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">
                  Active filters:
                  {selectedCategories.length > 0 && (
                    <span className="ml-1 text-yellow-400">
                      {selectedCategories.length} categories
                    </span>
                  )}
                  {searchQuery && (
                    <span className="ml-1 text-yellow-300">
                      "{searchQuery}"
                    </span>
                  )}
                </span>
              </div>
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500 text-black shadow hover:bg-yellow-400 transition"
              >
                Clear All
              </button>
            </div>
          )}

          <SortingDropdown sortBy={sortBy} onChange={setSortBy} />
          <ProductGrid
            searchQuery={searchQuery}
            selectedCategories={selectedCategories}
            sortBy={sortBy}
            addToCart={handleAddToCart}
          />
        </main>
      </div>

      <ChatButton />
    </div>
  );
};

export default MainLayout;
