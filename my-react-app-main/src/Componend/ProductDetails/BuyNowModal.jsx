import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderSummary from './OrderSummary';
import SuccessMessageModal from './SuccessMessageModal';

const BuyNowModal = ({ isOpen, onClose, product, qty = 1, size = 'M', showSuccess, setShowSuccess }) => {
  const handlePlaceOrder = () => {
    // Simulate placing order
    setShowSuccess(true);
    onClose(); // Close the Buy Now modal
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Box */}
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center p-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#181818] rounded-xl shadow-lg max-w-md w-full p-6 relative text-white">
              <h2 className="text-2xl font-bold mb-4">🛒 Confirm Your Order</h2>

              {/* Order Summary Section */}
              <OrderSummary product={product} qty={qty} size={size} />

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded font-bold"
              >
                Place Order
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-4 text-white text-2xl hover:text-red-400"
              >
                ×
              </button>
            </div>
          </motion.div>
        </>
      )}

      {/* Success Message Modal */}
      <SuccessMessageModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </AnimatePresence>
  );
};

export default BuyNowModal;



