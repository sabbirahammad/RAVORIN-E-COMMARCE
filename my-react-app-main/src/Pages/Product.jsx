import React, { useState, useCallback } from 'react'
import Navber from '../Componend/NavberSection/Navber'
import MainLayout from '../Componend/Products/MainLayout'

const Product = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryChange = useCallback((subcategory, categoryTitle) => {
    const filterKey = subcategory;
    setSelectedCategories((prev) => {
      const exists = prev.includes(filterKey);
      if (exists) {
        return prev.filter((c) => c !== filterKey);
      } else {
        return [...prev, filterKey];
      }
    });
  }, []);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
  };

  return (
    <div className="font-sans bg-[#121212] text-white min-h-screen">
      <MainLayout
        selectedCategories={selectedCategories}
        searchQuery={searchQuery}
        onCategoryChange={handleCategoryChange}
        onSearchChange={setSearchQuery}
        clearAllFilters={clearAllFilters}
      />
    </div>
  )
}

export default Product
