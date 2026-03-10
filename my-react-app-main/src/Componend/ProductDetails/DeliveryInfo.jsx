import React from 'react';

const DeliveryInfo = () => {
  return (
    <div className="max-w-6xl mx-auto mt-10 bg-[#1e1e1e] p-5 sm:p-6 rounded-lg shadow-md text-gray-300 space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">
        Delivery Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#2a2a2a] p-4 rounded-md shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-yellow-400 text-base mb-1">🚚 Estimated Delivery</h3>
          <p className="text-sm leading-relaxed">
            Delivery in 2-4 business days within Bangladesh.
          </p>
        </div>

        <div className="bg-[#2a2a2a] p-4 rounded-md shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-yellow-400 text-base mb-1">📦 Shipping Method</h3>
          <p className="text-sm leading-relaxed">
            Standard courier or home delivery available nationwide.
          </p>
        </div>

        <div className="bg-[#2a2a2a] p-4 rounded-md shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-yellow-400 text-base mb-1">🔄 Return Policy</h3>
          <p className="text-sm leading-relaxed">
            Easy 7-day return policy from date of delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;


