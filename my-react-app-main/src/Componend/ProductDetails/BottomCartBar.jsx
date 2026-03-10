import React from 'react';

const BottomCartBar = ({ price, onAddToCart }) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 block md:hidden bg-[#1a1a1a] border-t border-gray-700 shadow-inner px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="text-lg text-white font-semibold">
          Total: <span className="text-yellow-400">৳{price}</span>
        </div>
        <button
          onClick={onAddToCart}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded font-semibold transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BottomCartBar;

