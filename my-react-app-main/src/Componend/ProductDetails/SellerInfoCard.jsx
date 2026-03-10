import React from 'react';
import { FaCommentDots } from 'react-icons/fa';

const SellerInfoCard = ({ productName = 'Unknown Product' }) => {
  return (
    <div className="bg-[#161616] text-white rounded-md shadow-md p-4 w-full max-w-sm space-y-4">
      {/* Seller Info */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold leading-tight break-words">
            {productName}<br />Bazar
          </h3>
        </div>
        <button className="flex items-center gap-1 text-blue-400 text-sm hover:underline">
          <FaCommentDots className="text-base" />
          Chat Now
        </button>
      </div>

      {/* Ratings Grid */}
      <div className="grid grid-cols-3 gap-2 border border-gray-700 rounded text-center text-xs divide-x divide-gray-700">
        <div className="p-2">
          <p className="text-gray-400">Positive Seller Ratings</p>
          <p className="text-lg font-bold text-white mt-1">84%</p>
        </div>
        <div className="p-2">
          <p className="text-gray-400">Ship on Time</p>
          <p className="text-lg font-bold text-white mt-1">94%</p>
        </div>
        <div className="p-2">
          <p className="text-gray-400">Chat Response Rate</p>
          <p className="text-xs text-white mt-1">Not enough data</p>
        </div>
      </div>

      {/* Go to Store Button */}
      <div className="pt-2 text-center">
        <button className="text-blue-400 text-sm font-semibold hover:underline">
          GO TO STORE
        </button>
      </div>
    </div>
  );
};

export default SellerInfoCard;


