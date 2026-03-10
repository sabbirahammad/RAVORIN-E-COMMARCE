import React from 'react';

const ProductCategorySearch = ({ categories = [], selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onChange('')}
        className={`px-3 py-1 rounded-full border text-sm ${
          selected === '' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-3 py-1 rounded-full border text-sm capitalize ${
            selected === cat ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default ProductCategorySearch;


