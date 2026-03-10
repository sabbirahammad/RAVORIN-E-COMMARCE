import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sizes = ['S', 'M', 'L', 'XL'];

const SizeSelectModal = ({ isOpen, onClose, product, onConfirm }) => {
  const [selectedSize, setSelectedSize] = useState('M'); // Fixed typo: usefinger -> useState
  const [qty, setQty] = useState(1);

  const handleConfirm = () => {
    if (product && onConfirm) {
      onConfirm({ ...product, selectedSize, qty });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-0 top-0 z-50 flex justify-center p-4"
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.8, ease: 'easeOut' }}
          >
            <div className="bg-gray-900 w-11/12 sm:max-w-xs rounded-b-2xl rounded-t-none p-5 relative border-b-4 border-gradient-to-r from-cyan-400 to-pink-500">
              {/* Grabber Handle */}
              <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-3" />

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-800 text-cyan-300 flex items-center justify-center hover:bg-cyan-400 hover:text-gray-900 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>

              {/* Product Card */}
              <div className="text-center mb-4">
                {product?.image && (
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover mx-auto rounded-lg border-2 border-cyan-400/40"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <h3 className="text-base font-semibold text-white mt-2">{product?.name || 'Select Options'}</h3>
              </div>

              {/* Size Options */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-300 mb-1">Size</label>
                <div className="flex justify-center gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-w-[40px] ${
                        selectedSize === size
                          ? 'bg-cyan-400 text-gray-900'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-cyan-300'
                      }`}
                      whileHover={{ scale: 1.1, boxShadow: '0 0 6px rgba(34, 211, 238, 0.5)' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-300 mb-1">Quantity</label>
                <div className="flex items-center justify-center gap-3">
                  <motion.button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 rounded-full bg-gray-800 text-gray-300 hover:text-pink-400 hover:bg-gray-700 transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    −
                  </motion.button>
                  <span className="text-lg font-medium text-white">{qty}</span>
                  <motion.button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 rounded-full bg-gray-800 text-gray-300 hover:text-pink-400 hover:bg-gray-700 transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Confirm Button */}
              <motion.button
                onClick={handleConfirm}
                className="w-full bg-gray-500 text-white py-2.5 rounded-lg font-medium hover:bg-gray-600 transition shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SizeSelectModal;



