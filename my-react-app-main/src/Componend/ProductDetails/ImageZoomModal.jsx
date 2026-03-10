import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const ImageZoomModal = ({ isOpen, onClose, images, selectedImage }) => {
  const [currentIndex, setCurrentIndex] = useState(images.indexOf(selectedImage));

  useEffect(() => {
    setCurrentIndex(images.indexOf(selectedImage));
  }, [selectedImage, images]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const handleNext = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    onSwipedDown: () => onClose(),
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        {...swipeHandlers}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-5xl w-full max-h-[90vh] bg-[#111] rounded-lg shadow-2xl overflow-hidden"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image with Zoom Label */}
          <div className="relative flex items-center justify-center overflow-hidden p-4">
            <img
              src={images[currentIndex]}
              alt="Zoom"
              className="w-full max-h-[80vh] object-contain rounded-md transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded shadow">
              🔍 Tap to Zoom
            </div>
            <div className="absolute top-4 left-4 text-sm bg-yellow-500 text-black px-2 py-1 rounded">
              {currentIndex + 1}/{images.length}
            </div>
          </div>

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-500"
            onClick={onClose}
          >
            ×
          </button>

          {/* Prev/Next */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-white text-4xl hover:text-yellow-400 transition"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-white text-4xl hover:text-yellow-400 transition"
          >
            ›
          </button>

          {/* Thumbnails */}
          <div className="flex overflow-x-auto gap-3 p-4 border-t border-gray-800 bg-[#181818]">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                onClick={() => setCurrentIndex(idx)}
                className={`h-16 w-16 object-cover rounded-md cursor-pointer border-2 ${
                  idx === currentIndex
                    ? 'border-yellow-400 scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                } transition-transform duration-200`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageZoomModal;

