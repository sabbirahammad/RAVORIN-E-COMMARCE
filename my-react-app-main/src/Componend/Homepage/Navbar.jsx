import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiChevronDown,
  FiGrid,
  FiHeart,
  FiSearch,
  FiShoppingCart
} from 'react-icons/fi';
import { useProduct } from '../../Context/UseContext';
import { useAuth } from '../../Context/GoogleAuth';
import UserMenu from '../NavberSection/UserMenu';

const Navbar = () => {
  const navigate = useNavigate();
  const { products = [], cartItems = [] } = useProduct();
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState(false);
  const [loadingCats, setLoadingCats] = useState(false);
  const [catError, setCatError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCats(true);
        setCatError('');
        const res = await fetch('https://apii.ravorin.com/api/v1/categories');
        if (!res.ok) throw new Error('Failed to load categories');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        setCatError('Could not load categories');
        console.error(err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (!token) {
        setWishlistCount(0);
        return;
      }

      try {
        const response = await fetch('https://apii.ravorin.com/api/v1/user/wishlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok && data.success) {
          setWishlistCount(Array.isArray(data.wishlist) ? data.wishlist.length : 0);
        } else {
          setWishlistCount(0);
        }
      } catch (error) {
        console.error('Failed to fetch wishlist count:', error);
        setWishlistCount(0);
      }
    };

    fetchWishlistCount();
  }, [token]);

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
    : 0;

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    setMobileSearchOpen(false);
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
  };

  const suggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term || !products.length) return [];
    return products
      .filter((p) => (p.name || p.title || '').toLowerCase().includes(term))
      .slice(0, 6)
      .map((p) => ({
        id: p._id || p.id,
        label: p.name || p.title || 'Product',
      }));
  }, [products, searchTerm]);

  const handleSelectSuggestion = (id) => {
    setSearchTerm('');
    navigate(id ? `/product/${id}` : '/products');
  };

  return (
    <header className="w-full bg-[#1a1a1a] border-b border-gray-800 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-10 py-4 flex items-center gap-3 sm:gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/ravorin-logo.png"
              alt="Ravorin logo"
              className="w-11 h-11 rounded-xl object-cover border border-gray-700 shadow"
              onError={(e) => {
                e.currentTarget.src = '/vite.svg';
              }}
            />
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Ravorin
            </span>
          </Link>
        </div>

        {/* Categories */}
        <div className="hidden lg:block relative">
          <button
            onClick={() => setOpenCategories((p) => !p)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold bg-[#151515] border border-gray-700 shadow-sm hover:bg-[#202020] transition-all duration-200"
          >
            <span className="w-5 h-5 rounded-md bg-yellow-500/10 text-yellow-400 grid place-items-center shadow-sm">
              <FiGrid className="text-sm" />
            </span>
            Categories
            <FiChevronDown className="text-lg text-gray-400" />
          </button>
          {openCategories && (
            <div className="absolute left-0 mt-3 w-64 max-h-72 overflow-y-auto rounded-2xl border border-gray-800 bg-[#181818] shadow-xl z-20">
              <div className="p-3 border-b border-gray-800 text-sm font-semibold text-gray-300 flex items-center justify-between">
                <span>All Categories</span>
                {loadingCats && <span className="text-xs text-yellow-400">Loading...</span>}
              </div>
              <div className="divide-y divide-gray-800">
                {catError && (
                  <div className="px-4 py-3 text-sm text-rose-500">{catError}</div>
                )}
                {!catError &&
                  (categories.length ? (
                    categories.map((cat) => {
                      const label = cat.title || cat.name || 'Unnamed';
                      const slug = label.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <Link
                          key={cat.id || cat._id || label}
                          to={`/category/${encodeURIComponent(slug)}`}
                          className="block px-4 py-3 text-sm text-gray-300 hover:bg-[#232323] hover:text-yellow-300"
                          onClick={() => setOpenCategories(false)}
                        >
                          {label}
                        </Link>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      {loadingCats ? 'Loading...' : 'No categories found'}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="hidden flex-1 md:block">
          <form onSubmit={handleSearch} className="relative block">
            <button
              type="submit"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 text-lg"
              aria-label="Search"
            >
              <FiSearch />
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search premium denim, brands, styles..."
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#111111] border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-transparent transition-all"
            />
            {suggestions.length > 0 && (
              <div className="absolute mt-2 w-full bg-[#181818] border border-gray-700 rounded-2xl shadow-lg overflow-hidden z-30">
                {suggestions.map((item) => (
                  <button
                    type="button"
                    key={item.id || item.label}
                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-[#232323] hover:text-yellow-300"
                    onClick={() => handleSelectSuggestion(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="rounded-full p-3 text-gray-300 transition-all hover:bg-[#202020] hover:text-yellow-300 md:hidden"
            aria-label="Open search"
            aria-expanded={mobileSearchOpen}
          >
            <FiSearch className="text-xl" />
          </button>

          <div className="flex items-center h-12 px-1 text-gray-200">
            <UserMenu
              isDarkMode={true}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              compact={true}
              mobileFriendly={true}
            />
          </div>

          <Link
            to="/wishlist"
            className="relative hidden rounded-full p-3 text-gray-300 transition-all hover:bg-[#202020] hover:text-yellow-300 sm:block"
            aria-label="Wishlist"
          >
            <FiHeart className="text-xl" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-yellow-500 text-[11px] font-bold text-black shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cartpayment"
            className="relative p-3 rounded-full text-gray-300 hover:text-yellow-300 hover:bg-[#202020] transition-all"
            aria-label="Cart"
          >
            <FiShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-[11px] font-bold text-black bg-yellow-500 rounded-full grid place-items-center shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="border-t border-gray-800 px-4 pb-4 md:hidden"
          >
            <form onSubmit={handleSearch} className="relative mt-3">
              <button
                type="submit"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 text-lg"
                aria-label="Search"
              >
                <FiSearch />
              </button>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="h-12 w-full rounded-2xl border border-gray-700 bg-[#111111] pl-11 pr-12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-medium text-gray-400"
              >
                Close
              </button>
              {suggestions.length > 0 && (
                <div className="absolute mt-2 w-full overflow-hidden rounded-2xl border border-gray-700 bg-[#181818] shadow-lg z-30">
                  {suggestions.map((item) => (
                    <button
                      type="button"
                      key={item.id || item.label}
                      className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#232323] hover:text-yellow-300"
                      onClick={() => handleSelectSuggestion(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      {/* close dropdown when clicking outside simple handler */}
      {openCategories && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenCategories(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Navbar;
