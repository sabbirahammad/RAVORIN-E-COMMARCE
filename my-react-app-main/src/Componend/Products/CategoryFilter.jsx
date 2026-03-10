import React from 'react';

const allCategories = ['Polo T-Shirt', 'Premium T-Shirt', 'Kids'];

const CategoryFilter = ({ selected, onChange }) => {
  const toggleCategory = (category) => {
    if (selected.includes(category)) {
      onChange(selected.filter((item) => item !== category));
    } else {
      onChange([...selected, category]);
    }
  };

  return (
    <div className="p-4 text-white bg-[#1e1e1e] w-[220px]">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      {allCategories.map((cat) => (
        <label key={cat} className="block mb-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(cat)}
            onChange={() => toggleCategory(cat)}
            className="mr-2 accent-yellow-500"
          />
          {cat}
        </label>
      ))}
    </div>
  );
};

export default CategoryFilter;

