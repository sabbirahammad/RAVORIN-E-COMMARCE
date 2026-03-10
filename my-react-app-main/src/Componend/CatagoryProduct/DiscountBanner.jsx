import React from 'react';
import { Link } from 'react-router-dom';

const DiscountBanner = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-[1200px] bg-gradient-to-r from-[#ff5722] via-[#ff9800] to-[#ffc107] text-white rounded-xl overflow-hidden px-6 py-10 sm:px-12 sm:py-16 my-10 shadow-md">
        {/* Content */}
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">Mega Discount Week!</h2>
            <p className="text-sm sm:text-base">
              Up to <span className="font-bold text-white text-lg">60% OFF</span> on top brands. Limited time only!
            </p>
          </div>

          <Link
            to="/products"
            className="bg-white text-[#ff5722] hover:bg-orange-100 font-semibold px-6 py-2 rounded-md transition text-sm sm:text-base"
          >
            Shop Now
          </Link>
        </div>

        {/* Optional background image overlay */}
        <img
          src="https://i.imgur.com/nOQZzFl.png"
          alt="Discount decoration"
          className="absolute right-4 bottom-0 w-28 sm:w-36 opacity-20 sm:opacity-30 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default DiscountBanner;


