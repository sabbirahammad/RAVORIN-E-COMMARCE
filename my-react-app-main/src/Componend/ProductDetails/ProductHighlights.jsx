import React from 'react';
import {
  FaCheckCircle,
  FaShippingFast,
  FaUndo,
  FaShieldAlt,
} from 'react-icons/fa';

const highlights = [
  {
    icon: <FaCheckCircle className="text-yellow-400 text-2xl sm:text-xl" />,
    title: '100% Cotton',
    description: 'Soft, breathable & durable fabric',
  },
  {
    icon: <FaShippingFast className="text-yellow-400 text-2xl sm:text-xl" />,
    title: 'Fast Delivery',
    description: 'Get it delivered within 2-3 days',
  },
  {
    icon: <FaUndo className="text-yellow-400 text-2xl sm:text-xl" />,
    title: 'Easy Returns',
    description: '7-day hassle-free return policy',
  },
  {
    icon: <FaShieldAlt className="text-yellow-400 text-2xl sm:text-xl" />,
    title: 'Secure Payment',
    description: 'Your transactions are protected',
  },
];

const ProductHighlights = () => {
  return (
    <div className="bg-[#1a1a1a] border-t border-gray-700 py-6 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4">
        {highlights.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-white bg-[#2a2a2a] rounded-lg p-4 sm:p-3 shadow hover:shadow-md transition"
          >
            <div className="mb-2">{item.icon}</div>
            <h4 className="font-semibold text-sm sm:text-base text-center">{item.title}</h4>
            <p className="text-[12px] sm:text-xs text-gray-400 text-center leading-snug">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductHighlights;


