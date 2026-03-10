import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/GoogleAuth';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch order details from backend
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://apii.ravorin.com/api/v1/orders/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Order data received:', response.data);
        console.log('Image URLs:', response.data.order.items?.map(item => item.image));

        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError('Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        if (err.response?.status === 404) {
          setError('Order not found');
        } else if (err.response?.status === 403) {
          setError('Not authorized to view this order');
        } else {
          setError('Failed to load order details');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, token]);

  // Calculate subtotal from order items
  const subtotal = order?.items?.reduce(
    (acc, item) => acc + (item.price * item.quantity),
    0
  ) || 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#121318] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#121318] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/manage-account/orders')}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // No order data
  if (!order) {
    return (
      <div className="min-h-screen bg-[#121318] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Order not found</p>
          <button
            onClick={() => navigate('/manage-account/orders')}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 bg-[#121318] min-h-screen text-[10px] sm:text-sm text-white space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <button
          onClick={() => navigate('/manage-account/orders')}
          className="text-cyan-400 text-[10px] sm:text-[13px] hover:underline self-start"
        >
          ← Back to My Orders
        </button>
        <h2 className="text-lg sm:text-xl font-semibold">Order Details</h2>
      </div>

      {/* Order Info */}
      <div className="bg-[#181a21] rounded p-3 sm:p-4 border border-[#2b2d35] space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <p className="text-[10px] sm:text-sm">Order ID: <span className="text-cyan-400">#{order.orderNumber || order._id}</span></p>
          <p className="text-[10px] sm:text-sm">Status: <span className={`font-medium ${
            order.status === 'delivered' ? 'text-green-400' :
            order.status === 'cancelled' ? 'text-red-400' :
            order.status === 'processing' ? 'text-yellow-400' :
            'text-gray-400'
          }`}>
            {order.status?.toUpperCase()}
          </span></p>
          <p className="text-[10px] sm:text-sm">Placed on: {new Date(order.createdAt || order.orderDate).toLocaleDateString()}</p>
          {order.paymentMethod && (
            <p className="text-[10px] sm:text-sm">Payment Method: <span className="text-cyan-400">{order.paymentMethod.replace('_', ' ').toUpperCase()}</span></p>
          )}
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-medium">Items</h3>
        {order.items && order.items.length > 0 ? (
          order.items.map((item, index) => (
            <div
              key={item._id || index}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-[#181a21] border border-[#2b2d35] p-3 sm:p-4 rounded"
            >
              <img
                src={
                  item.image && (
                    item.image.startsWith('http')
                      ? item.image
                      : `https://apii.ravorin.com${item.image}`
                  )
                }
                alt={item.name}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white p-1 object-cover rounded self-center sm:self-auto"
                onError={(e) => {
                  console.log('Image failed to load for', item.name, ':', e.target.src);
                  e.target.src = '/no-image.svg';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully for', item.name);
                }}
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
                <p className="text-gray-400 text-[10px] sm:text-sm">Qty: {item.quantity}</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-gray-300 text-sm sm:text-base">৳ {item.price?.toFixed(2) || '0.00'}</p>
                <p className="text-gray-400 text-[9px] sm:text-xs">
                  Total: ৳ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm sm:text-base">No items found in this order.</p>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-[#181a21] border border-[#2b2d35] p-3 sm:p-4 rounded space-y-2">
        <h3 className="font-semibold text-white text-sm sm:text-base">Order Summary</h3>
        <div className="space-y-1 sm:space-y-2">
          <div className="flex justify-between text-[10px] sm:text-sm">
            <span className="text-gray-400">Subtotal ({order.items?.length || 0} items)</span>
            <span>৳ {order.subtotal?.toFixed(2) || subtotal.toFixed(2)}</span>
          </div>
          {order.tax !== undefined && (
            <div className="flex justify-between text-[10px] sm:text-sm">
              <span className="text-gray-400">Tax</span>
              <span>৳ {order.tax?.toFixed(2) || '0.00'}</span>
            </div>
          )}
          {order.shippingCost !== undefined && (
            <div className="flex justify-between text-[10px] sm:text-sm">
              <span className="text-gray-400">Shipping Cost</span>
              <span>৳ {order.shippingCost?.toFixed(2) || '0.00'}</span>
            </div>
          )}
          <hr className="border-gray-600 my-2" />
          <div className="flex justify-between text-base sm:text-lg font-bold text-orange-400">
            <span>Total:</span>
            <span>৳ {order.total?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="bg-[#181a21] border border-[#2b2d35] p-3 sm:p-4 rounded">
          <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Shipping Address</h3>
          <div className="text-gray-300 text-[10px] sm:text-sm space-y-1">
            <p className="font-medium">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="bg-[#181a21] border border-[#2b2d35] p-3 sm:p-4 rounded">
          <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Order Notes</h3>
          <p className="text-gray-300 text-[10px] sm:text-sm">{order.notes}</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;


