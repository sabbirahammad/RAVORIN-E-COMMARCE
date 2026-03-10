import React from 'react';

const Topbar = () => {
  return (
    <div className="hidden md:flex bg-[#111111] text-gray-200 text-sm px-4 py-2 justify-between items-center border-b border-gray-800 shadow-sm">
      <div className="flex items-center space-x-4">
        <span className="text-yellow-400">EXCLUSIVE T-SHIRTS ON SALE</span>
        <span className="text-gray-500">|</span>
        <span className="text-gray-300">Limited time only</span>
      </div>
      <div className="flex items-center space-x-4">
        <a href="#" className="hover:text-yellow-300 transition-colors">Order Bulk / Corporate Sales</a>
        <a href="#" className="hover:text-yellow-300 transition-colors">Store Locations</a>
        <a href="/about" className="hover:text-yellow-300 transition-colors">About Us</a>
        <a href="#" className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors">Login</a>
      </div>
    </div>
  );
};

export default Topbar;
