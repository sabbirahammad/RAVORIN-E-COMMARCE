import React from 'react';
import { useProduct } from '../../Context/UseContext';

const BrandCategoryTitle = () => {
  const { selectedCategory, sortOption, setSortOption } = useProduct();

  return (
    <div className="bg-[#121318] text-white py-6 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="text-sm text-gray-400 uppercase tracking-wide">Category</p>
        <h2 className="text-2xl font-bold mt-1 text-cyan-400">
          {selectedCategory || "All Products"}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-gray-400">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="bg-[#1f1f1f] text-white border border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="popularity">Most Popular</option>
          <option value="latest">Newest First</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default BrandCategoryTitle;



