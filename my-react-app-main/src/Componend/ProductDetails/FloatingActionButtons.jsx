import React, { useEffect, useState } from 'react';

const FloatingActionButtons = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    visible && (
      <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-3 items-end">
        {/* Scroll to Top */}
        <button
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full bg-gray-800 text-white hover:bg-yellow-500 shadow-lg flex items-center justify-center text-xl transition-all"
          title="Go to Top"
        >
          ↑
        </button>

        {/* Contact or WhatsApp */}
        <a
          href="https://wa.me/8801234567890" // replace with your WhatsApp number
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-green-600 text-white hover:bg-green-700 shadow-lg flex items-center justify-center text-xl transition-all"
          title="Contact on WhatsApp"
        >
          💬
        </a>
      </div>
    )
  );
};

export default FloatingActionButtons;

