import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const DummyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 group-hover:text-yellow-400 group-hover:scale-110"
    style={{ color: '#9CA3AF' }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        'https://apii.ravorin.com/api/v1/categories'
      );
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();

      // adjust depending on your backend response
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Error loading categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-center text-gray-300 ml-3">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <p className="text-center text-red-400 bg-red-900/20 border border-red-400 rounded-lg px-4 py-2 inline-block">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center text-white">
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Shop by Category
        </span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {categories.map((category, index) => (
          <Link
            key={category.id || index}
            to={`/category/${encodeURIComponent(
              category.title.toLowerCase().replace(/\s+/g, '-')
            )}`}
            className="group rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600"
          >
            <DummyIcon />
            <span className="text-xs sm:text-sm font-medium transition-all duration-300 text-center mt-2 text-gray-200 group-hover:text-white group-hover:font-semibold">
              {category.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
