import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, Info, Check, X, MapPin } from 'lucide-react';
import AddressForm from './AddressForm';
import { useAuth } from '../../Context/GoogleAuth';
import { fetchDeliveryCosts, calculateDeliveryCost } from '../../services/deliveryCostService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { token, initialized } = useAuth();

  const [promoCode, setPromoCode] = useState('');
  const [showEditSidebar, setShowEditSidebar] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderSummary, setOrderSummary] = useState({ itemsTotal: 0, deliveryFee: 0, total: 0 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryCosts, setDeliveryCosts] = useState({ dhakaInside: 60, dhakaOutside: 120 });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://apii.ravorin.com/api/v1/products');
      if (res.data.success && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  // ✅ Load delivery costs from backend
  const loadDeliveryCosts = async () => {
    try {
      const costs = await fetchDeliveryCosts();
      setDeliveryCosts(costs);
    } catch (error) {
      console.error('Failed to load delivery costs:', error);
      // Keep default values
    }
  };

  // ✅ Helper: Get product by ID
  const getProductById = (id) => {
    return products.find((p) => p.id === id);
  };

  // ✅ Fetch Cart Data
  const fetchCartData = async () => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
      console.warn("⚠️ fetchCartData: No token");
      return;
    }

    try {
      const response = await axios.get('https://apii.ravorin.com/api/v1/cart', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log('🛒 Cart API Response:', response.data);

      // Handle different response formats
      let cartItemsData = [];
      if (response.data?.success && response.data?.cart?.items) {
        cartItemsData = response.data.cart.items;
      } else if (response.data?.cart?.items) {
        cartItemsData = response.data.cart.items;
      } else if (Array.isArray(response.data)) {
        cartItemsData = response.data;
      }

      console.log('🛒 Cart items data:', cartItemsData);

      if (cartItemsData && cartItemsData.length > 0) {
        setCartItems(cartItemsData);

        const itemsTotal = cartItemsData.reduce(
          (total, item) => total + (item.price * item.quantity || 0),
          0
        );

        // Calculate delivery fee based on selected pickup point (shipping address)
        const deliveryFee = calculateDeliveryFee(selectedPickupPoint !== null ? pickupPoints[selectedPickupPoint] : null);

        setOrderSummary((prev) => ({
          ...prev,
          itemsTotal: parseFloat(itemsTotal.toFixed(2)),
          deliveryFee: deliveryFee,
          total: parseFloat((itemsTotal + deliveryFee).toFixed(2)),
        }));

        console.log('✅ Cart loaded with', cartItemsData.length, 'items');
      } else {
        console.log('⚠️ Cart is empty or no items found');
        setCartItems([]);
      }
    } catch (err) {
      console.error('❌ Error fetching cart data:', err);
      console.error('❌ Response data:', err.response?.data);
      setCartItems([]);
    }
  };

  // ✅ Fetch Addresses
  const fetchAddresses = async () => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
      console.warn("⚠️ fetchAddresses: No token");
      return;
    }

    try {
      const response = await axios.get('https://apii.ravorin.com/api/v1/user/addresses', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.success) {
        setAddresses(response.data.addresses || []);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      if (err.response?.status === 401) {
        navigate('/auth');
      } else {
        setError('Failed to fetch addresses');
      }
    }
  };

  // ✅ Fetch Pickup Points (using addresses as pickup points for now)
  const fetchPickupPoints = async () => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
      console.warn("⚠️ fetchPickupPoints: No token");
      return;
    }

    try {
      const response = await axios.get('https://apii.ravorin.com/api/v1/user/addresses', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.success) {
        // Use addresses as pickup points for now
        setPickupPoints(response.data.addresses || []);
      }
    } catch (err) {
      console.error('Error fetching pickup points:', err);
      if (err.response?.status === 401) {
        navigate('/auth');
      } else {
        setError('Failed to fetch pickup points');
      }
    }
  };

  // ✅ Critical: Wait for auth initialization AND token
  useEffect(() => {
    console.log("🔍 [CHECKOUT] Current Auth State:", { token: !!token, initialized });

    if (!initialized) {
      console.log("⏳ [CHECKOUT] Waiting for auth initialization...");
      return;
    }

    if (!token) {
      console.log("❌ [CHECKOUT] No token after initialization. Redirecting to /auth...");
      navigate('/auth');
      setIsLoading(false);
      return;
    }

    console.log("✅ [CHECKOUT] Auth initialized and token available. Starting data fetch...");

    setIsLoading(true);

    Promise.all([
      fetchProducts(),
      fetchAddresses(),
      fetchPickupPoints(),
      fetchCartData(),
      loadDeliveryCosts(),
    ])
      .then(() => {
        console.log("🎉 [CHECKOUT] All data fetched successfully!");
        console.log("🛒 Cart items count:", cartItems.length);
        console.log("📍 Pickup points count:", pickupPoints.length);
        console.log("🏠 Addresses count:", addresses.length);

        // Check if cart is empty after fetching data
        // if (cartItems.length === 0) {
        //   console.warn("⚠️ [CHECKOUT] Cart is empty after fetch");
        //   setError("Your cart is empty. Please add items to your cart before proceeding to checkout.");
        // }
      })
      .catch((err) => {
        console.error("❌ [CHECKOUT] Error during data fetch:", err);
        setError("Failed to load checkout data. Please refresh.");
      })
      .finally(() => {
        console.log("✅ [CHECKOUT] Setting isLoading = false");
        setIsLoading(false);
      });
  }, [token, initialized, navigate]);

  // ✅ EMERGENCY TIMEOUT — Force stop loading after 5 seconds
  useEffect(() => {
    const emergencyTimer = setTimeout(() => {
      if (isLoading) {
        console.warn("🛠️ [CHECKOUT] EMERGENCY: Forcing loading off after 5s");
        setIsLoading(false);
        setError("System is slow. Please refresh the page.");
      }
    }, 5000);

    return () => clearTimeout(emergencyTimer);
  }, [isLoading]);

  const handleApplyPromo = async () => {
    setError('Promo code functionality not implemented');
  };

  const handleSelectPickupPoint = (index) => {
    if (index < 0 || index >= pickupPoints.length) {
      setError('Invalid pickup point selected.');
      return;
    }
    setSelectedPickupPoint(index);
    setShowPickupModal(false);

    // Recalculate delivery fee when pickup point changes
    const deliveryFee = calculateDeliveryFee(pickupPoints[index]);
    setOrderSummary((prev) => ({
      ...prev,
      deliveryFee: deliveryFee,
      total: prev.itemsTotal + deliveryFee,
    }));
  };

  // Calculate delivery fee based on shipping address
  const calculateDeliveryFee = (shippingAddress) => {
    if (!shippingAddress) {
      return deliveryCosts.dhakaOutside; // Default to outside if no address
    }
    return calculateDeliveryCost(shippingAddress, deliveryCosts);
  };

  const handleOrder = async () => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
      navigate('/auth');
      return;
    }

    setError("");

    // Check if cart has items
    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty. Please add items to cart before placing an order.");
      return;
    }

    if (selectedPickupPoint === null || selectedPickupPoint === undefined) {
      setError("Please select a pickup point.");
      return;
    }

    if (!paymentMethod.trim()) {
      setError("Please select a payment method.");
      return;
    }

    // Validate payment method format
    const validPaymentMethods = ['cash_on_delivery', 'credit_card', 'debit_card', 'bkash', 'nagad'];
    const formattedPaymentMethod = paymentMethod.toLowerCase().replace(/\s+/g, '_');
    if (!validPaymentMethods.includes(formattedPaymentMethod)) {
      setError("Please select a valid payment method.");
      return;
    }

    const selectedPoint = pickupPoints[selectedPickupPoint];

    if (!selectedPoint?.fullName || !selectedPoint?.phone || !selectedPoint?.address) {
      setError("Selected pickup point is missing required information.");
      return;
    }

    // Prepare shipping address data
    const shippingAddress = {
      fullName: selectedPoint.fullName,
      phone: selectedPoint.phone,
      address: selectedPoint.address,
      city: selectedPoint.city,
      postalCode: selectedPoint.postalCode,
      country: selectedPoint.country || 'Bangladesh',
    };

    const orderData = {
      shippingAddress,
      paymentMethod: formattedPaymentMethod,
      notes: notes,
    };

    console.log("📦 Sending order data:", orderData);

    try {
      const response = await axios.post(
        "https://apii.ravorin.com/api/v1/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Order Response:", response.data);

      if (response.data.success) {
        alert("Order placed successfully!");

        // Clear cart after successful order
        try {
          const clearToken = token || localStorage.getItem('token');
          await axios.delete('https://apii.ravorin.com/api/v1/cart', {
            headers: {
              Authorization: `Bearer ${clearToken}`,
            },
          });
        } catch (cartError) {
          console.warn('Failed to clear cart:', cartError);
        }

        if (formattedPaymentMethod === "cash_on_delivery") {
          navigate("/orders");
        } else {
          navigate(`/payments/${response.data.order._id}`);
        }
      }
    } catch (err) {
      console.error("❌ Order creation error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        console.log('❌ 401 Unauthorized during order creation - redirecting to auth');
        navigate('/auth');
      } else {
        setError(`Failed to create order: ${err.response?.data?.message || 'Please try again.'}`);
      }
    }
  };

  // ✅ Loading UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121318] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Checkout</h2>
          <p className="text-gray-400">
            {!initialized
              ? "Initializing authentication system..."
              : !token
              ? "Redirecting to login..."
              : "Fetching your cart, addresses, and products..."}
          </p>
          <p className="text-xs text-gray-500 mt-4">This should only take a few seconds.</p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-800 rounded text-xs">
              <div>Debug: token = {token ? '✅ Present' : '❌ Null'}</div>
              <div>Debug: initialized = {initialized ? '✅ True' : '❌ False'}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121318] text-white relative pb-20">
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-md z-50 max-w-md text-center shadow-lg">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            {error.includes("cart is empty") && (
              <button
                onClick={() => navigate('/products')}
                className="ml-4 bg-white text-red-500 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
              >
                Add Items
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Layout — Responsive: Flex-col on mobile, flex-row on desktop */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left Section — Main Form */}
          <div className="flex-1 space-y-6">
            {/* Debug Info (Dev Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-800 p-3 rounded text-xs mb-4">
                <div>Token: {token ? '✅ Present' : '❌ Missing'}</div>
                <div>Initialized: {initialized ? '✅ Yes' : '⏳ No'}</div>
                <div>Cart Items: {cartItems.length}</div>
              </div>
            )}

            {/* Shipping & Billing */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">Shipping & Billing</h2>
                <button
                  onClick={() => setShowEditSidebar(true)}
                  className="text-orange-400 hover:text-orange-300 font-medium text-sm md:text-base"
                >
                  EDIT
                </button>
              </div>

              {selectedPickupPoint !== null && pickupPoints[selectedPickupPoint] && (
                <div className="space-y-2 mb-4 p-4 border border-gray-700 rounded-lg bg-gray-800">
                  <h3 className="font-medium text-lg">Selected Pickup Point</h3>
                  <div className="flex flex-col md:flex-row md:space-x-4">
                    <div className="flex-1">
                      <div className="flex">
                        <span className="text-gray-400 w-24 md:w-32">Name:</span>
                        <span>{pickupPoints[selectedPickupPoint].fullName || 'N/A'}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-400 w-24 md:w-32">Phone:</span>
                        <span>{pickupPoints[selectedPickupPoint].phone || 'N/A'}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-400 w-24 md:w-32">Address:</span>
                        <span>
                          {`${pickupPoints[selectedPickupPoint].address || ''}, ${
                            pickupPoints[selectedPickupPoint].city || ''
                          }, ${pickupPoints[selectedPickupPoint].postalCode || ''}`.trim() || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div
                className="mt-4 border border-blue-500 rounded-lg p-4 bg-gray-800 cursor-pointer hover:bg-gray-700 transition"
                onClick={() => setShowPickupModal(true)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 mb-1 text-sm md:text-base">
                      {selectedPickupPoint !== null ? 'Change Pickup Point' : 'Select a Ravorin Pick-up Point'}
                    </p>
                    <div className="flex items-center text-gray-400 text-xs md:text-sm">
                      <span>{pickupPoints.length} suggested collection point(s) nearby</span>
                      <Info className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Details</h3>

              <div>
                <label className="block mb-2 text-gray-300 text-sm">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white text-sm"
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="Cash On Delivery">Cash On Delivery</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bkash">Bkash</option>
                  <option value="Nagad">Nagad</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-300 text-sm">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white text-sm"
                  placeholder="Any special instructions..."
                ></textarea>
              </div>
            </div>

            {/* Delivery Option & Cart Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Package 1 of 1</h3>
                <div className="text-gray-400 text-sm">
                  <span>Fulfilled by </span>
                  <span className="text-white font-medium">Elite</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-gray-300 mb-3 text-sm">Delivery Option</h4>
                <div className="border border-teal-500 rounded-lg p-4 bg-gray-800">
                  <div className="flex items-center mb-2">
                    <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center mr-3">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium text-sm">
                      {selectedPickupPoint !== null ? 'Pickup Point Delivery' : 'No Delivery Option Selected'}
                    </span>
                  </div>
                  <div className="ml-8 text-sm">
                    <div className="font-medium mb-1">
                      {selectedPickupPoint !== null ? 'Pickup Point Delivery' : 'Please select a pickup point'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              {cartItems.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                  <p className="text-gray-400 text-xl mb-4">Your cart is empty</p>
                  <button
                    onClick={() => navigate('/products')}
                    className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const product = getProductById(item.product_id);
                  const productName = product?.name || 'Unknown Product';
                  const productImage = product?.images?.[0] || '/no-image.svg';

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 p-4 border border-gray-700 rounded-lg bg-gray-800 space-y-3 md:space-y-0"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={productImage.startsWith('http') ? productImage : `https://apii.ravorin.com${productImage}`}
                          alt={productName}
                          className="w-20 h-20 object-contain rounded-md border border-gray-600"
                          onError={(e) => {
                            e.target.src = '/no-image.svg';
                          }}
                        />
                        <div>
                          <h4 className="text-lg font-semibold">{productName}</h4>
                        </div>
                      </div>
                      <div className="text-right md:text-left md:ml-auto">
                        <div className="text-lg font-medium">৳ {(item.price || 0).toFixed(2)}</div>
                      </div>
                      <div className="text-gray-400 text-sm">
                        <span>Qty: </span>
                        <span>{item.quantity || 1}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Section — Order Summary (Sticky on Desktop, Static on Mobile) */}
          <div className="w-full lg:w-80 space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div>
              <h3 className="text-lg font-medium mb-3">Promotion</h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter Store/ Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-r-md transition-colors text-sm"
                >
                  APPLY
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              <div className="space-y-3 bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Items Total ({cartItems.length} Items)</span>
                  <span>৳ {orderSummary.itemsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Delivery Fee</span>
                  <span>৳ {orderSummary.deliveryFee.toFixed(2)}</span>
                </div>
                <hr className="border-gray-700 my-2" />
                <div className="flex justify-between text-lg font-bold text-orange-400">
                  <span>Total:</span>
                  <span>৳ {orderSummary.total.toFixed(2)}</span>
                </div>
                <p className="text-gray-400 text-xs mt-2">VAT included, where applicable</p>
              </div>

              <button
                onClick={handleOrder}
                disabled={selectedPickupPoint === null || !paymentMethod || cartItems.length === 0}
                className={`w-full mt-6 py-4 rounded-lg font-bold text-base transition-colors ${
                  selectedPickupPoint !== null && paymentMethod && cartItems.length > 0
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {cartItems.length === 0 ? 'Cart is Empty' : 'Proceed to Pay'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pickup Modal */}
      {showPickupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-600">
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Select Pickup Point</h3>
              <button onClick={() => setShowPickupModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-700 bg-gray-700 text-gray-300 text-sm font-medium">
              <div className="col-span-1"></div>
              <div className="col-span-3">Full name</div>
              <div className="col-span-4">Address</div>
              <div className="col-span-2">City</div>
              <div className="col-span-2">Phone Number</div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {pickupPoints.length > 0 ? (
                pickupPoints.map((point, index) => (
                  <div
                    key={point.id || point._id || index}
                    className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition md:grid-cols-12 grid-cols-1"
                    onClick={() => handleSelectPickupPoint(index)}
                  >
                    {/* Mobile View */}
                    <div className="md:hidden col-span-12 p-3 border-b border-gray-600">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white">{point.fullName || 'N/A'}</h4>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPickupPoint === index
                              ? 'bg-teal-500 border-teal-500'
                              : 'border-gray-500'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPickupPoint(index);
                          }}
                        >
                          {selectedPickupPoint === index && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-1">📍 {point.address || 'N/A'}</p>
                      <p className="text-gray-300 text-sm mb-1">🏙️ {point.city || 'N/A'}</p>
                      <p className="text-gray-300 text-sm">📞 {point.phone || 'N/A'}</p>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block col-span-1 flex items-start pt-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPickupPoint === index
                            ? 'bg-teal-500 border-teal-500'
                            : 'border-gray-500'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPickupPoint(index);
                        }}
                      >
                        {selectedPickupPoint === index && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                    <div className="hidden md:block col-span-3">
                      <div className="text-white font-medium">{point.fullName || 'N/A'}</div>
                    </div>
                    <div className="hidden md:block col-span-4">
                      <div className="text-gray-300 text-sm">
                        <p>{point.address || 'N/A'}</p>
                        <p>{(point.city || '') + (point.postalCode ? `, ${point.postalCode}` : '') || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="hidden md:block col-span-2">
                      <div className="text-gray-300">{point.city || 'N/A'}</div>
                    </div>
                    <div className="hidden md:block col-span-2">
                      <div className="text-gray-300">{point.phone || 'N/A'}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 text-lg">No pickup points available.</div>
              )}
            </div>
            <div className="flex flex-col-reverse md:flex-row justify-end space-x-0 md:space-x-4 space-y-3 md:space-y-0 p-4 md:p-5 border-t border-gray-700 bg-gray-800">
              <button
                onClick={() => setShowPickupModal(false)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded font-medium w-full md:w-auto"
              >
                CANCEL
              </button>
              <button
                onClick={() => setShowPickupModal(false)}
                disabled={selectedPickupPoint === null}
                className={`px-6 py-2 rounded font-medium w-full md:w-auto ${
                  selectedPickupPoint !== null
                    ? 'bg-teal-500 hover:bg-teal-600 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Sidebar */}
      {showEditSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-5xl relative border border-gray-600">
            <button
              onClick={() => setShowEditSidebar(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="p-4 md:p-5">
              <h3 className="text-xl font-bold text-white mb-4">Edit Address</h3>
              <AddressForm
                onClose={() => setShowEditSidebar(false)}
                onBack={() => setShowEditSidebar(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;


