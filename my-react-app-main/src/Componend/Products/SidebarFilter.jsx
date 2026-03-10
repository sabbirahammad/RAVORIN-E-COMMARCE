// SidebarFilter.jsx
import React, { useState, useEffect } from 'react';

const SidebarFilter = ({ selectedCategories, onCategoryChange, className = '' }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://apii.ravorin.com/api/v1/categories');
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleExpand = (categoryId) => {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const handleCategoryClick = (category, subcategory) => {
    // Pass both category and subcategory for filtering
    if (onCategoryChange) {
      onCategoryChange(subcategory, category);
    }
  };

  if (loading) {
    return (
      <aside className={`bg-[#171717]/95 backdrop-blur text-white border border-gray-800 w-64 p-4 overflow-y-auto max-h-screen rounded-2xl shadow-[0_14px_32px_rgba(0,0,0,0.22)] ${className}`}>
        <h2 className="text-yellow-400 text-xl font-bold mb-4">Categories</h2>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Loading categories...</div>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={`bg-[#171717]/95 backdrop-blur text-white border border-gray-800 w-64 p-4 overflow-y-auto max-h-screen rounded-2xl shadow-[0_14px_32px_rgba(0,0,0,0.22)] ${className}`}>
        <h2 className="text-yellow-400 text-xl font-bold mb-4">Categories</h2>
        <div className="flex items-center justify-center h-32">
          <div className="text-red-400 text-sm text-center">
            Error loading categories
            <br />
            <span className="text-xs">{error}</span>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`bg-[#171717]/95 backdrop-blur text-white border border-gray-800 w-64 p-4 overflow-y-auto max-h-screen rounded-2xl shadow-[0_14px_32px_rgba(0,0,0,0.22)] ${className}`}>
      <h2 className="text-yellow-400 text-xl font-bold mb-4">Categories</h2>
      {categories.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400 text-sm text-center">No categories available</div>
        </div>
      ) : (
        categories.map((category) => (
          <div key={category.id || category._id} className="mb-6">
            <button
              onClick={() => toggleExpand(category.id || category._id)}
              className="flex justify-between w-full text-left font-semibold text-white text-lg mb-2 hover:text-yellow-400 transition-colors duration-200"
            >
              <span className="truncate">{category.title}</span>
              <span className="ml-2 flex-shrink-0">
                {expanded[category.id || category._id] ? '-' : '+'}
              </span>
            </button>
            {expanded[category.id || category._id] && category.items && category.items.length > 0 && (
              <ul className="pl-4 space-y-1">
                {category.items.map((subcategory, index) => (
                  <li
                    key={`${category.id || category._id}-${index}`}
                    className={`cursor-pointer hover:text-yellow-300 transition-colors duration-200 py-1 px-2 rounded ${
                      selectedCategories?.includes(subcategory)
                        ? 'text-yellow-300 font-semibold bg-yellow-500/10 border border-yellow-500/15'
                        : 'text-gray-400'
                    }`}
                    onClick={() => handleCategoryClick(category.title, subcategory)}
                    title={subcategory}
                  >
                    <span className="truncate block">{subcategory}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </aside>
  );
};

export default SidebarFilter;
