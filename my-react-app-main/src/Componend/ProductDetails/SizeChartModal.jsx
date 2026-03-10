import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SizeChartModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1e1e1e] text-white rounded-lg p-6 w-full max-w-xl shadow-lg overflow-y-auto max-h-[80vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Size Chart</h2>
                <button onClick={onClose} className="text-2xl hover:text-red-400">×</button>
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-yellow-400 border-b border-gray-600">
                    <th className="p-2">Size</th>
                    <th className="p-2">Chest (inches)</th>
                    <th className="p-2">Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="p-2 text-center">S</td>
                    <td className="p-2 text-center">36</td>
                    <td className="p-2 text-center">26</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-2 text-center">M</td>
                    <td className="p-2 text-center">38</td>
                    <td className="p-2 text-center">27</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="p-2 text-center">L</td>
                    <td className="p-2 text-center">40</td>
                    <td className="p-2 text-center">28</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-center">XL</td>
                    <td className="p-2 text-center">42</td>
                    <td className="p-2 text-center">29</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SizeChartModal;



