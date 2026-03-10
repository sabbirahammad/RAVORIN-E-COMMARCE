import React, { useEffect, useState } from 'react';

const StickyCartButton = ({ price, onAddToCart }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide when scrolling near the bottom of the page
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
    <div className="fixed bottom-20 right-4 z-50 md:hidden">
      <button
        onClick={onAddToCart}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-5 py-3 rounded-full shadow-lg transition duration-300"
      >
        🛒 Add to Cart – ৳{price}
      </button>
    </div>
  );
};

export default StickyCartButton;

