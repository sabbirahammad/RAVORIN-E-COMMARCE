// SidebarFilter.jsx
import React, { useState } from 'react';

const categories = {
  Mens: ['Half Sleeve T-Shirt', 'Full Sleeve T-Shirt', 'Shirt', 'Polo T-Shirt'],
  Womens: ['Dresses', 'Tops', 'Jeans'],
  Kids: ['T-Shirts', 'Frocks', 'Shorts'],
  Accessories: ['Bags', 'Watches', 'Caps'],
  hi:['hi']
};

const SidebarFilter = ({ selectedCategories, onCategoryChange, className = '' }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (cat) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <aside className={`bg-[#1a1a1a] text-gray-300 w-64 p-4 overflow-y-auto max-h-screen ${className}`}>
      <h2 className="text-white text-xl font-bold mb-4">Categories</h2>
      {Object.entries(categories).map(([category, subcats]) => (
        <div key={category} className="mb-6">
          <button
            onClick={() => toggleExpand(category)}
            className="flex justify-between w-full text-left font-semibold text-white text-lg mb-2 hover:text-yellow-400 transition-colors"
          >
            {category}
            <span>{expanded[category] ? '-' : '+'}</span>
          </button>
          {expanded[category] && (
            <ul className="pl-4 space-y-1">
              {subcats.map((subcat) => (
                <li
                  key={subcat}
                  className={`cursor-pointer hover:text-yellow-400 transition-colors ${
                    selectedCategories?.includes(subcat) ? 'text-yellow-400 font-semibold' : ''
                  }`}
                  onClick={() => onCategoryChange(subcat)}
                >
                  {subcat}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
};

export default SidebarFilter;
