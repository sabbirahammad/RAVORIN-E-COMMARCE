// components/Sidebar/MobileSidebar.jsx
import React, { useState } from 'react';
import { X, Menu } from 'lucide-react';
import CategorySidebar from './CategorySidebar';

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="md:hidden p-2">
        <button
          onClick={() => setIsOpen(true)}
          className="text-white bg-[#1f1f1f] p-2 rounded-md"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay + Sidebar */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Sidebar Panel */}
          <div className="fixed top-0 left-0 h-full w-72 bg-[#1c1c1c] text-white z-50 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={22} />
              </button>
            </div>
            <CategorySidebar />
          </div>
        </>
      )}
    </>
  );
};

export default MobileSidebar;

