import React, { useEffect, useState } from 'react';

const StickyBuyNowButton = ({ price, onAddToCart }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide the button when scrolled near the bottom
      const scrollTop = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (docHeight - scrollTop < 150) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      <button
        onClick={onAddToCart}
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-5 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
      >
        Buy Now – ৳{price}
      </button>
    </div>
  );
};

export default StickyBuyNowButton;


