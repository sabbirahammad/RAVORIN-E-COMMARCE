import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const SuccessMessageModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#1e1e1e] text-white rounded-lg p-6 w-11/12 max-w-sm text-center shadow-2xl border border-green-600"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <FaCheckCircle className="text-green-400 text-4xl mx-auto mb-2" />
            <h2 className="text-lg font-semibold mb-1">Added to Cart!</h2>
            <p className="text-sm text-gray-400 mb-4">Your item was added successfully.</p>

            <div className="flex justify-center gap-4 text-sm">
              <button
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded"
              >
                Continue Shopping
              </button>
              <Link to="/cart">
                <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded">
                  Go to Cart
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessMessageModal;

