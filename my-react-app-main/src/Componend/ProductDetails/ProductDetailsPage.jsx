import React from 'react';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';

const ProductDetailsPage = () => {
  return (
    <div className="bg-[#121212] text-white min-h-screen px-6 py-10 flex flex-col lg:flex-row gap-10">
      {/* Left: Product Image Gallery */}
      <div className="w-full lg:w-1/2">
        <ProductGallery />
      </div>

      {/* Right: Product Information */}
      <div className="w-full lg:w-1/2">
        <ProductInfo />
      </div>
    </div>
  );
};

export default ProductDetailsPage;

