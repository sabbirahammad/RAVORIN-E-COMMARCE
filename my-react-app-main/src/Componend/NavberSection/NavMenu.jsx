import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const NavMenu = ({ isDarkMode, activeDropdown, setActiveDropdown }) => {
  const [categories, setCategories] = useState([]); // parent categories
  const [subcategories, setSubCategories] = useState([]); // child subcategories
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch All Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          "https://apii.ravorin.com/api/v1/categories"
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Error loading categories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Render Categories Dropdown
  const renderAllCategoriesDropdown = (categories) => {
    return (
      <div className="flex ">
        {categories.slice(0, 6).map((category) => (
          <div key={category.id} className="min-w-[140px]">
            <h4
              className="text-sm font-semibold mb-2 text-gray-300"
            >
              {category.title}
            </h4>

            <div className="flex flex-col gap-2">
              {category.items
                .slice(0, 8)
                .map((item, index) => (
                  <Link
                    key={`${category.id}-${index}`}
                    to={`/category/${encodeURIComponent(
                      item.toLowerCase().replace(/\s+/g, "-")
                    )}`}
                  >
                    <div
                      className="px-3 py-1 rounded-md text-sm transition-colors duration-200  text-gray-200 hover:bg-gray-700 hover:text-white"
                    >
                      {item}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 🔹 Menu Items
  const menuItems = [
    {
      key: "allcategories",
      label: "All categories",
      dropdownContent:
        loading || error || !categories.length
          ? <p className="text-sm text-gray-400">No categories available</p>
          : renderAllCategoriesDropdown(categories),
      dropdownWidth: "auto",
    },
    {
      key: "featured",
      label: "Featured selections",
      dropdownContent: (
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Top ranking" },
            { icon: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z", text: "New arrivals" },
            { icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", text: "Top deals" },
          ].map((item, index) => (
            <Link
              key={index}
              to={`/category/${encodeURIComponent(
                item.text.toLowerCase().replace(/\s+/g, "-")
              )}`}
            >
              <div
                className="flex flex-col items-center justify-center p-3 rounded-md transition-colors duration-200  text-gray-200 hover:bg-gray-700 hover:text-white"
              >
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                <span className="text-sm font-medium text-center">
                  {item.text}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ),
      dropdownWidth: "w-80",
    },
    {
      key: "help",
      label: "Help Center",
      dropdownContent: (
        <div className="flex gap-6">
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { text: "Sample Center", link: "sample-center" },
              { text: "Online Trade Show", link: "online-trade-show" },
              { text: "Tips", link: "tips" },
              { text: "Live", link: "live" },
            ].map((item) => (
              <Link
                key={item.text}
                to={`/help-center?section=${item.link}`}
                className="flex flex-col items-center justify-center p-3 rounded-md transition-colors duration-200  text-gray-200 hover:bg-gray-700 hover:text-white"
              >
                <span className="text-sm font-medium text-center">
                  {item.text}
                </span>
              </Link>
            ))}
          </div>
          <div className="w-[160px] flex flex-col items-center justify-center p-3 rounded-md bg-gray-800 text-gray-200">
            <div className="w-full h-24 bg-gray-600 rounded-md mb-2"></div>
            <p className="text-sm font-medium text-center text-white">
              Need Help?
            </p>
            <p className="text-xs text-center text-gray-300">
              Contact us for support
            </p>
          </div>
        </div>
      ),
      dropdownWidth: "w-[460px]",
    },
  ];

  return (
    <div className="relative">
      {loading && (
        <div className="flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="text-center text-sm text-red-400 bg-red-900/20 border border-red-400 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {!loading && !error && (
        <ul
          className="md:flex items-center space-x-8 text-sm font-semibold text-white"
        >
          {menuItems.map(
            ({ key, label, dropdownContent, dropdownWidth }) => (
              <li
                key={key}
                className="relative"
                onMouseEnter={() => setActiveDropdown(key)}
                onMouseLeave={() => setActiveDropdown(null)}
                onClick={() =>
                  setActiveDropdown(activeDropdown === key ? null : key)
                }
              >
                <span className="hover:text-yellow-400 transition-all duration-300 cursor-pointer px-2 py-1 rounded-md hover:bg-gray-800">
                  {label}
                </span>

                <AnimatePresence>
                  {activeDropdown === key && (
                    <motion.div
                      className={`absolute left-0 mt-2 rounded-md shadow-xl z-50 p-4 ${dropdownWidth} bg-gray-900 text-white`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {dropdownContent}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default NavMenu;





