import React from 'react';
import { Link } from 'react-router-dom';

const ProductBreadcrumb = ({ category = 'Men', productName }) => {
  return (
    <nav className="text-sm text-gray-400 mb-4">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-yellow-400">Home</Link>
        </li>
        <li>/</li>
        <li>
          <Link to={`/category/${category.toLowerCase()}`} className="hover:text-yellow-400">{category}</Link>
        </li>
        <li>/</li>
        <li className="text-white truncate max-w-[150px]">{productName}</li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumb;

