import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/GoogleAuth';
import { fetchDeliveryCosts, calculateDeliveryCost } from '../../services/deliveryCostService';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState({ itemsTotal: 0, deliveryFee: 0, total: 0 });
  const [paymentOption, setPaymentOption] = useState('cod'); // 'cod' or 'online'
  const [error, setError] = useState('');
  const [deliveryCosts, setDeliveryCosts] = useState({ dhakaInside: 60, dhakaOutside: 120 });
  const [newOrder, setNewOrder] = useState({
    shippingAddress: '',
    customerName: '',
    customerPhone: '',
    paymentMethod: '',
    notes: '',
  });
  const {token} =useAuth()

  useEffect(() => {
    fetchCartData();
    loadDeliveryCosts();
  }, []);

  // Load delivery costs from backend
  const loadDeliveryCosts = async () => {
    try {
      const costs = await fetchDeliveryCosts();
      setDeliveryCosts(costs);
    } catch (error) {
      console.error('Failed to load delivery costs:', error);
      // Keep default values
    }
  };

  // Fetch cart data
  const fetchCartData = async () => {
    try {
      const response = await axios.get('https://apii.ravorin.com/api/v1/cart',
         {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Token এখানে পাঠানো হচ্ছে
        },
      }
      );
      if (response.data && response.data.cart && response.data.cart.items) {
        setCartItems(response.data.cart.items);
        const itemsTotal = response.data.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        // Calculate delivery fee based on shipping address if available
        const deliveryFee = calculateDeliveryFee(newOrder.shippingAddress);
        setOrderSummary((prev) => ({
          ...prev,
          itemsTotal: itemsTotal,
          deliveryFee: deliveryFee,
          total: itemsTotal + deliveryFee,
        }));
      } else {
        setError('Failed to fetch cart data');
      }
    } catch (err) {
      setError('Error fetching cart data');
    }
  };

  // Calculate delivery fee based on shipping address
  const calculateDeliveryFee = (shippingAddress) => {
    if (!shippingAddress) {
      return deliveryCosts.dhakaOutside; // Default to outside if no address
    }
    return calculateDeliveryCost(shippingAddress, deliveryCosts);
  };

  // Recalculate totals when shipping address changes
  const handleShippingAddressChange = (address) => {
    setNewOrder({ ...newOrder, shippingAddress: address });
    const deliveryFee = calculateDeliveryFee(address);
    setOrderSummary((prev) => ({
      ...prev,
      deliveryFee: deliveryFee,
      total: prev.itemsTotal + deliveryFee,
    }));
  };

  // Handle payment option change (Online Payment / COD)
  const handlePaymentOptionChange = (option) => {
    setPaymentOption(option);
    setNewOrder({ ...newOrder, paymentMethod: option });
  };

  // Place order
  const handleOrder = async () => {
    try {
      const orderData = {
        shippingAddress: newOrder.shippingAddress,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        paymentMethod: newOrder.paymentMethod,
        notes: newOrder.notes,
      };

      const response = await axios.post('https://apii.ravorin.com/api/v1/orders',{
         headers: {
            Authorization: `Bearer ${token}`,
          },
      }, orderData);
      if (response.status === 200) {
        alert('Order placed successfully!');
        setNewOrder({ shippingAddress: '', customerName: '', customerPhone: '', paymentMethod: '', notes: '' });
      } else {
        setError('Failed to create order');
      }
    } catch (err) {
      setError('Failed to create order: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white relative px-4 py-6">
      {error && <div className="p-4 text-red-400">{error}</div>}

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Section - Order Details */}
        <div className="flex-1 bg-gray-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-medium mb-4">Order Details</h2>

          {/* Product List */}
          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-center">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((product) => (
                <div key={product.id} className="flex justify-between items-center border-b border-gray-600 py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.product.images}
                      alt={product.product.name}
                      className="w-16 h-16 object-contain rounded-md"
                    />
                    <div>
                      <h4 className="text-lg font-semibold">{product.product.name}</h4>
                      <p className="text-gray-400 text-sm">Qty: {product.quantity}</p>
                    </div>
                  </div>
                  <div className="text-lg font-medium">৳ {product.price * product.quantity}</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-between text-lg font-medium">
            <span className="text-gray-400">Items Total:</span>
            <span>৳ {orderSummary.itemsTotal}</span>
          </div>
          <div className="mt-2 flex justify-between text-lg font-medium">
            <span className="text-gray-400">Delivery Fee:</span>
            <span>৳ {orderSummary.deliveryFee}</span>
          </div>
          <div className="mt-4 border-t border-gray-600 pt-4 flex justify-between text-2xl font-bold">
            <span>Total:</span>
            <span>৳ {orderSummary.total}</span>
          </div>
        </div>

        {/* Right Section - Payment Options */}
        <div className="w-full lg:w-96 bg-gray-700 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-medium mb-4">Payment Options</h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="cod"
                checked={paymentOption === 'cod'}
                onChange={() => handlePaymentOptionChange('cod')}
                className="text-teal-500"
              />
              <label htmlFor="cod" className="text-lg">Cash on Delivery</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="online"
                name="paymentMethod"
                value="online"
                checked={paymentOption === 'online'}
                onChange={() => handlePaymentOptionChange('online')}
                className="text-teal-500"
              />
              <label htmlFor="online" className="text-lg">Online Payment</label>
            </div>

            {/* Payment Instructions */}
            {paymentOption === 'online' && (
              <div className="mt-4">
                <p className="text-gray-400">Please proceed with the payment via our secure payment gateway.</p>
               <Link to='/payment'>
                <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg">
                  Go to Online Payment
                </button>
               </Link>
              </div>
            )}
            {paymentOption === 'cod' && (
              <div className="mt-4">
                <p className="text-gray-400">You will pay cash on delivery. Please have the exact amount ready.</p>
              </div>
            )}
          </div>

          {/* Proceed to Payment Button */}
          <button
            onClick={handleOrder}
            disabled={cartItems.length === 0}
            className={`w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : ''}`}
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

