import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ShopDropdownMenu = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [navigating, setNavigating] = useState(false);
  const closeTimeoutRef = useRef(null);
  const hasFetchedRef = useRef(false);
  const navigate = useNavigate();

  // Fetch categories from backend - optimized to prevent infinite loops
  const fetchCategories = useCallback(async () => {
    // Prevent multiple simultaneous calls and return if already fetched
    if (hasFetchedRef.current) return;

    try {
      setLoading(true);
      setError(null);
      hasFetchedRef.current = true;

      const res = await fetch(
        "https://apii.ravorin.com/api/v1/categories"
      );

      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Category fetch error:', err);
      setError("Error loading categories");
      setCategories([]);
      hasFetchedRef.current = false; // Allow retry on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if categories is empty and we haven't fetched yet
    if (categories.length === 0 && !hasFetchedRef.current) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  // Handle dropdown open/close with optimization
  const handleMouseEnter = useCallback(() => {
    // Don't open if we're navigating or if dropdown is already open
    if (navigating || isOpen) return;

    clearTimeout(closeTimeoutRef.current);
    setIsOpen(true);
  }, [navigating, isOpen]);

  const handleMouseLeave = useCallback(() => {
    // Don't close if we're navigating
    if (navigating) return;

    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  }, [navigating]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Handle category click with improved navigation optimization
  const handleCategoryClick = useCallback((categoryName) => {
    // Prevent multiple rapid clicks
    if (!categoryName || navigating) return;

    setNavigating(true);

    // Close dropdown immediately
    setIsOpen(false);
    clearTimeout(closeTimeoutRef.current);

    // Navigate immediately without delay to prevent flickering
    navigate("/products", {
      state: { category: categoryName },
      replace: false
    });

    // Reset navigating state after a shorter delay
    setTimeout(() => {
      setNavigating(false);
    }, 300);
  }, [navigate, navigating]);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Shop button */}
      <button
        className={`font-semibold flex items-center gap-1 transition-colors duration-200 ${
          isDarkMode
            ? 'text-white hover:text-gray-200'
            : 'text-gray-900 hover:text-gray-700'
        }`}
        aria-expanded={isOpen}
        disabled={navigating}
        type="button"
      >
        {navigating ? 'Loading...' : 'Shop'}
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu - only render when open to prevent unnecessary re-renders */}
      {isOpen && (
        <div
          className={`absolute top-full left-1/2 mt-2 p-6 rounded shadow-lg z-50 w-[900px] grid grid-cols-6 gap-6 ${
            isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-900 text-white"
          }`}
          style={{ transform: "translateX(-50%)" }}
          role="menu"
        >
          {loading && <p className="col-span-6 text-center">Loading categories...</p>}
          {error && <p className="col-span-6 text-center text-red-500">{error}</p>}
          {!loading && !error && categories.length === 0 && (
            <p className="col-span-6 text-center">No categories available</p>
          )}

          {!loading &&
            !error &&
            categories
              .filter(category => category && category.title && category.items && category.items.length > 0)
              .map((category) => (
              <div key={category.id || category.title}>
                <h3 className="font-semibold mb-2 text-white">{category.title}</h3>
                <ul className="space-y-2 text-sm">
                  {category.items?.map((item, index) => (
                    <li key={`${category.id || category.title}-${index}`}>
                      <button
                        onClick={() => handleCategoryClick(item)}
                        disabled={navigating}
                        className={`w-full text-left transition-colors duration-200 ${
                          navigating
                            ? 'opacity-50 cursor-not-allowed text-gray-500'
                            : 'hover:text-white cursor-pointer'
                        }`}
                        role="menuitem"
                        type="button"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ShopDropdownMenu;
