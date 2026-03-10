import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // ✅ navigation

const ads = [
  {
    title: "🔥 Hot Deal: 50% OFF on Men's T-Shirts!",
    subtitle: "Upgrade your style today.",
    bgGradient: 'bg-gradient-to-r from-red-700 via-red-600 to-red-500',
    targetUrl: '/products',
    category: 'Men',
  },
  {
    title: "🌿 Fresh New Arrivals for Women",
    subtitle: "Discover your new favorite outfit.",
    bgGradient: 'bg-gradient-to-r from-green-700 via-green-600 to-green-500',
    targetUrl: '/products',
    category: 'Women',
  },
  {
    title: "🚚 Free Shipping on Orders Over $50",
    subtitle: "Shop more, save more!",
    bgGradient: 'bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500',
    targetUrl: '/products',
    category: null, // No specific category
  },
  {
    title: "🎉 Limited Offer: Buy 1 Get 1 Free",
    subtitle: "Hurry, don't miss this deal!",
    bgGradient: 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-black',
    targetUrl: '/products',
    category: 'Premium',
  },
];

const variants = {
  enter: { opacity: 0, y: 50, scale: 0.95 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -50, scale: 0.95 },
};

const AdSection = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const ad = ads[index];

  const handleAdClick = () => {
    if (ad.targetUrl) {
      navigate(ad.targetUrl, {
        state: {
          highlightId: null,
          category: ad.category || null,
        },
      });
    }
  };

  return (
    <div className="w-full py-8 px-4">
      <div
        className="relative mx-auto rounded-2xl overflow-hidden shadow-xl max-w-screen-xl aspect-[16/6] sm:aspect-[16/5] md:aspect-[16/4]"
        aria-label="Advertisement banner"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onClick={handleAdClick}
            className={`${ad.bgGradient} w-full h-full flex flex-col justify-center items-center text-center px-6 sm:px-10 cursor-pointer`}
          >
            <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold drop-shadow-lg mb-2 sm:mb-4">
              {ad.title}
            </h1>
            <p className="text-sm sm:text-lg md:text-2xl font-medium drop-shadow-md">
              {ad.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 border-2 border-white ${
                i === index ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to ad ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdSection;



