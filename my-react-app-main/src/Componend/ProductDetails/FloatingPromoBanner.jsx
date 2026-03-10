import React, { useEffect, useState } from 'react';

const FloatingPromoBanner = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 15 seconds (optional)
    const timer = setTimeout(() => setVisible(false), 15000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 animate-bounce">
        <span className="text-sm font-semibold">
          🎉 20% OFF on all items — Limited Time!
        </span>
        <button
          onClick={() => setVisible(false)}
          className="text-black text-lg leading-none hover:text-red-600 font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default FloatingPromoBanner;

