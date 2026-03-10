import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CartDrawer from './CartDrawer';
import AllCatagory from './AllCatagory';
import SidebarFilter from './SidebarFilter';
import { FiMenu, FiMoon, FiSun, FiShoppingCart } from 'react-icons/fi';
import { useProduct } from '../../Context/UseContext';

const Navbar = ({
  setSidebarOpen,
  selectedCategories = [],
  onCategoryChange
}) => {
  const { cartItems = [] } = useProduct();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
    : 0;

  const handleCategoryChange = (subcategory, categoryTitle) => {
    if (onCategoryChange) {
      onCategoryChange(subcategory, categoryTitle);
    }
  };

  const toggleSidebar = (open) => {
    setIsSidebarOpen(open);
    setSidebarOpen(open);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 px-6 py-4 flex justify-between items-center bg-[#1a1a1a]/95 backdrop-blur border-b border-gray-800 shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
        {/* Left: Logo & Menu (only on mobile) */}
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-2xl text-yellow-400 hover:text-yellow-300 transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-[#242424]"
            onClick={() => toggleSidebar(true)}
            aria-label="Open sidebar"
          >
            <FiMenu />
          </button>

          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight hover:text-yellow-300 transition-all duration-300 hover:scale-105"
          >
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Ravorin
            </span>
          </Link>
        </div>

        {/* Center: AllCategory (desktop only) */}
        <div className="hidden md:block">
          <AllCatagory isDarkMode={true} />
        </div>

        {/* Right: Theme toggle & Cart */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle dark mode"
            className="text-xl text-yellow-400 hover:text-yellow-300 transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-[#242424]"
          >
            {isDarkMode ? <FiMoon /> : <FiSun />}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
            className="relative p-2 rounded-full hover:bg-[#242424] hover:scale-110 transition-all duration-300 text-yellow-400 hover:text-yellow-300"
          >
            <FiShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 inline-flex items-center justify-center w-5 h-5 bg-yellow-500 text-black text-xs font-semibold rounded-full ring-2 ring-[#1a1a1a]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <CartDrawer
        isDarkMode={isDarkMode}
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
      />

      {isSidebarOpen && (
        <div className="fixed top-10 left-0 w-64 h-full z-40 p-4 overflow-y-auto transition-transform duration-300 md:hidden bg-[#171717] border-r border-gray-800 shadow-2xl shadow-black/40">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => toggleSidebar(false)}
              className="text-lg text-yellow-400 hover:text-yellow-300 transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-[#242424]"
            >
              Close
            </button>
          </div>
          <SidebarFilter
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            className="block md:hidden"
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
