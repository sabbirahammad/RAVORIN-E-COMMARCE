import React from 'react';

const RecentOrdersTable = () => {
  return (
    <div className="px-2 sm:px-4 pt-4 sm:pt-6 text-white text-[10px] sm:text-[11px]">
      <h2 className="text-[14px] sm:text-[15px] font-semibold mb-2">Recent Orders</h2>

      <div className="bg-[#0d0f1c] rounded">
        {/* Mobile: Horizontal scroll wrapper */}
        <div className="overflow-x-auto">
          {/* Table Headings */}
          <div className="grid grid-cols-4 min-w-[500px] px-3 sm:px-4 py-2 border-b border-gray-800 text-gray-400 font-semibold text-[9px] sm:text-[10px]">
            <span>Order #</span>
            <span>Placed On</span>
            <span>Items</span>
            <span className="text-right">Total</span>
          </div>

          {/* Order Row 1 */}
          <div className="grid grid-cols-4 min-w-[500px] items-center px-3 sm:px-4 py-3 border-b border-gray-800">
            <span className="truncate font-mono text-[9px] sm:text-[10px]">638754800796505</span>
            <span className="text-[9px] sm:text-[10px]">08/03/2023</span>
            <div className="flex justify-center">
              <img
                src="https://i.ibb.co/nc9GQJh/image.jpg"
                alt="item"
                className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">৳ 653</span>
              <a href="#" className="text-blue-400 hover:text-blue-300 text-[9px] sm:text-[10px] transition-colors">MANAGE</a>
            </div>
          </div>

          {/* Order Row 2 */}
          <div className="grid grid-cols-4 min-w-[500px] items-center px-3 sm:px-4 py-3">
            <span className="truncate font-mono text-[9px] sm:text-[10px]">638753818496505</span>
            <span className="text-[9px] sm:text-[10px]">08/03/2023</span>
            <div className="flex justify-center">
              <img
                src="https://i.ibb.co/nc9GQJh/image.jpg"
                alt="item"
                className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">৳ 643</span>
              <a href="#" className="text-blue-400 hover:text-blue-300 text-[9px] sm:text-[10px] transition-colors">MANAGE</a>
            </div>
          </div>
        </div>

        {/* Mobile: Show scroll indicator */}
        <div className="sm:hidden text-center py-2">
          <span className="text-gray-400 text-[8px]">← Scroll to see more →</span>
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersTable;

