import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../../Context/UseContext';

const CategoryMenu = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const { categories, loading, error } = useProduct();
  return (
    <div className="bg-[#1c1c1c] text-white text-[10px] sm:text-sm w-full shadow-md">
      {/* Desktop View */}
      <div className="hidden lg:flex h-[400px] xl:h-[500px]">
        {/* Main Category */}
        <div className="w-48 xl:w-60 bg-[#2c2c2c]">
          {categories.map((category, i) => (
            <div
              key={category.id}
              onMouseEnter={() => {
                setActiveCategory(i);
              }}
              className={`px-3 xl:px-4 py-2 xl:py-3 cursor-pointer hover:bg-[#3d3d3d] transition-colors ${
                activeCategory === i ? 'bg-[#3d3d3d]' : ''
              }`}
            >
              {category.title}
            </div>
          ))}
        </div>

        {/* Category Items */}
        {activeCategory !== null && categories[activeCategory]?.items?.length > 0 && (
          <div className="w-52 xl:w-64 bg-[#1e1e1e] border-l border-gray-800">
            {categories[activeCategory].items.map((item, j) => (
              <Link
                key={`${categories[activeCategory].id}-${j}`}
                to={`/category/${encodeURIComponent(item.toLowerCase().replace(/\s+/g, '-'))}`}
              >
                <div className="px-3 xl:px-4 py-2 xl:py-3 hover:text-orange-400 cursor-pointer hover:bg-gray-800 transition-colors text-[9px] xl:text-sm">{item}</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden divide-y divide-gray-700 max-h-[400px] overflow-y-auto">
        {categories.map((category, i) => (
          <div key={category.id} className="px-3 sm:px-4 py-3">
            <button
              onClick={() => setActiveCategory(activeCategory === i ? null : i)}
              className="w-full text-left font-semibold text-[11px] sm:text-sm hover:text-yellow-400 transition-colors flex items-center justify-between"
            >
              <span>{category.title}</span>
              <span className={`transform transition-transform ${activeCategory === i ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {activeCategory === i && category.items?.length > 0 && (
              <ul className="mt-2 ml-2 sm:ml-3 text-gray-300 space-y-1 text-[10px] sm:text-sm">
                {category.items.map((item, j) => (
                  <li key={`${category.id}-${j}`}>
                    <Link
                      to={`/category/${encodeURIComponent(item.toLowerCase().replace(/\s+/g, '-'))}`}
                      className="block py-1 hover:text-yellow-400 transition-colors"
                    >
                      - {item}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;



