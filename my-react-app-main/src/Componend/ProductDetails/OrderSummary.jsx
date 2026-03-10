import React from 'react';

const OrderSummary = ({ product, qty = 1, size = 'M' }) => {
  // Prevent crash if product is undefined
  if (!product) {
    return (
      <div className="bg-[#1f1f1f] text-white p-4 rounded-md shadow-md mt-4">
        <p className="text-red-400">⚠️ Product data is not available.</p>
      </div>
    );
  }

  const total = (product.price * qty).toFixed(2);

  return (
    <div className="bg-[#1f1f1f] text-white p-4 rounded-md shadow-md mt-4">
      <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">🧾 Order Summary</h3>

      <div className="flex items-center gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded"
        />
        <div>
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-gray-400">Size: {size}</p>
          <p className="text-sm text-gray-400">Qty: {qty}</p>
          <p className="text-yellow-400 font-semibold mt-1">
         Total: ৳{total}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;


