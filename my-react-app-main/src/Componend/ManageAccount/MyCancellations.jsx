import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyCancellations = () => {
  const navigate = useNavigate();
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCancelledOrders = async () => {
      try {
        const res = await axios.get('https://apii.ravorin.com/api/orders/cancelled'); // ⬅️ Your real API here
        setCancelledOrders(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load cancelled orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchCancelledOrders();
  }, []);

  const handleMoreDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 bg-[#121318] min-h-screen text-[10px] sm:text-sm text-white max-w-4xl mx-auto">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">❌ My Cancellations</h2>
        <div className="flex justify-center items-center h-48 sm:h-64">
          <div className="animate-pulse text-gray-400">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-orange-500 border-solid rounded-full animate-spin mb-2"></div>
            <p className="text-[10px] sm:text-sm">Loading cancelled orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 bg-[#121318] min-h-screen text-[10px] sm:text-sm text-white max-w-4xl mx-auto">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">❌ My Cancellations</h2>
        <div className="text-center py-8 sm:py-16">
          <p className="text-red-400 text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-[#121318] min-h-screen text-[10px] sm:text-sm text-white max-w-4xl mx-auto">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">❌ My Cancellations</h2>

      {cancelledOrders.length === 0 ? (
        <div className="text-center py-8 sm:py-16 lg:py-24 text-gray-400">
          <p className="text-sm sm:text-base">You have no cancelled orders.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {cancelledOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#181a21] rounded shadow border border-[#2b2d35]"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:items-center p-3 sm:p-4 border-b border-[#2b2d35]">
                <div>
                  <p className="text-gray-400 text-[10px] sm:text-sm">Requested on {order.requestedDate}</p>
                  <p className="text-gray-400 text-[10px] sm:text-sm">
                    Order{' '}
                    <span className="text-cyan-400 hover:underline cursor-pointer text-[10px] sm:text-sm">
                      #{order.id}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleMoreDetails(order.id)}
                  className="text-cyan-400 hover:underline text-[9px] sm:text-xs lg:text-sm self-end sm:self-auto"
                >
                  MORE DETAILS
                </button>
              </div>

              {/* Product List */}
              <div className="space-y-2 sm:space-y-0">
                {order.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row sm:items-center p-3 sm:p-4 gap-3 sm:gap-4 border-t border-[#2b2d35] first:border-t-0"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover bg-white p-1 self-center sm:self-auto"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-sm sm:text-base lg:text-[15px] font-semibold mb-1">{product.name}</h3>
                      <p className="text-gray-400 text-[10px] sm:text-sm">Qty: {product.qty}</p>
                    </div>
                    <span className="bg-[#2b2d35] text-gray-300 text-[9px] sm:text-xs px-2 sm:px-3 py-1 rounded-full self-center sm:self-auto">
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCancellations;




