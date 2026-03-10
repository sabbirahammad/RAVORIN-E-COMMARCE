import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessMessageModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="bg-white text-center px-6 py-5 rounded-lg shadow-lg border border-green-500 w-80">
            <FaCheckCircle className="text-green-500 text-3xl mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-800">Add to Cart</h3>
            <p className="text-sm text-gray-600 mt-1 mb-3">Product added to cart successfully.</p>
            <button
              onClick={onClose}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessMessageModal;


