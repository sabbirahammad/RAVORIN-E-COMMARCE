import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/GoogleAuth';
import { useNavigate } from 'react-router-dom';
import { fetchDeliveryCosts, calculateDeliveryCost } from '../../services/deliveryCostService';

const tabs = ['All', 'To Pay', 'To Ship', 'To Receive', 'Cancelled', 'Completed'];

const MyOrdersPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryCosts, setDeliveryCosts] = useState({ dhakaInside: 60, dhakaOutside: 120 });
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // ✅ Orders, Products, and Delivery Costs - তিনটা API একসাথে call করি
        const [ordersRes, productsRes, deliveryCostsRes] = await Promise.all([
          axios.get( 'https://apii.ravorin.com/api/v1/user/orders',
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(
            'https://apii.ravorin.com/api/v1/products'
          ),
          fetchDeliveryCosts().catch(err => {
            console.warn('Failed to fetch delivery costs:', err);
            return { dhakaInside: 60, dhakaOutside: 120 }; // Default fallback
          }),
        ]);

        console.log("📦 Orders Response:", ordersRes.data);
        console.log("🛍️ Products Response:", productsRes.data);

        // ✅ Orders data processing - handle new API response structure
        const fetchedOrders = ordersRes.data?.orders || (ordersRes.data?.success ? [ordersRes.data] : []);

        // ✅ Products data processing - different response structure handle করি
        let fetchedProducts = [];
        if (Array.isArray(productsRes.data)) {
          fetchedProducts = productsRes.data;
        } else if (productsRes.data?.products) {
          fetchedProducts = productsRes.data.products;
        } else if (productsRes.data?.data) {
          fetchedProducts = productsRes.data.data;
        }

        setOrders(fetchedOrders);
        setProducts(fetchedProducts);
        setDeliveryCosts(deliveryCostsRes);

        console.log("✅ Processed Orders:", fetchedOrders.length);
        console.log("✅ Processed Products:", fetchedProducts.length);
        console.log("✅ Delivery Costs:", deliveryCostsRes);

      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 401) {
          navigate('/auth');
        } else if (err.response?.status === 404) {
          setError('Orders not found.');
        } else {
          setError('Failed to load data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // ✅ Get product image from order item (product data is now populated)
  const getProductImage = (item) => {
    // Try to get product data - handle both populated and ID-only cases
    const product = typeof item.product_id === 'object' ? item.product_id : null;

    // If product is populated (object), try to get images from it
    if (product) {
      // Handle populated product images (Cloudinary URLs)
      if (product.images) {
        if (Array.isArray(product.images) && product.images.length > 0) {
          const firstImage = product.images[0];
          // Cloudinary URLs already start with 'http', use them directly
          if (firstImage) return firstImage;
        } else if (typeof product.images === 'string' && product.images) {
          // Cloudinary URLs already start with 'http', use them directly
          return product.images;
        }
      }

      // Alternative image fields from populated product
      if (product.image) return product.image;
      if (product.thumbnail) return product.thumbnail;
    }

    // Fallback to order item's own image field (from cart data)
    if (item.image) return item.image;
    
    // Try to find product by ID from products array
    if (item.product_id) {
      const productId = typeof item.product_id === 'object' ? item.product_id._id || item.product_id.id : item.product_id;
      const foundProduct = products.find(p => p._id === productId || p.id === productId);
      
      if (foundProduct?.images) {
        if (Array.isArray(foundProduct.images) && foundProduct.images.length > 0) {
          return foundProduct.images[0];
        } else if (typeof foundProduct.images === 'string') {
          return foundProduct.images;
        }
      }
      
      if (foundProduct?.image) return foundProduct.image;
      if (foundProduct?.thumbnail) return foundProduct.thumbnail;
    }

    return '/no-image.svg';
  };

  // ✅ Status mapping for better display
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    switch (statusLower) {
      case 'completed':
      case 'delivered':
        return 'bg-green-600 text-white';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-600 text-white';
      case 'pending':
      case 'to pay':
        return 'bg-yellow-600 text-black';
      case 'processing':
      case 'to ship':
        return 'bg-blue-600 text-white';
      case 'shipped':
      case 'to receive':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  // ✅ Tab filtering এ status mapping করি
  const getFilteredOrders = () => {
    return orders.filter((order) => {
      // Tab filtering
      let matchTab = false;
      const orderStatus = order.status?.toLowerCase() || '';
      
      switch (activeTab) {
        case 'All':
          matchTab = true;
          break;
        case 'To Pay':
          matchTab = orderStatus === 'pending' || order.payment_status === 'pending';
          break;
        case 'To Ship':
          matchTab = orderStatus === 'processing' || orderStatus === 'confirmed';
          break;
        case 'To Receive':
          matchTab = orderStatus === 'shipped' || orderStatus === 'out_for_delivery';
          break;
        case 'Cancelled':
          matchTab = orderStatus === 'cancelled' || orderStatus === 'canceled';
          break;
        case 'Completed':
          matchTab = orderStatus === 'completed' || orderStatus === 'delivered';
          break;
        default:
          matchTab = orderStatus.includes(activeTab.toLowerCase());
      }

      // Search filtering
       const matchSearch = !searchTerm ||
         (order.orderNumber || order._id)?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
         order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         order.items?.some((item) =>
           item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.product_id?.name?.toLowerCase().includes(searchTerm.toLowerCase())
         );

      return matchTab && matchSearch;
    });
  };

  const filteredOrders = getFilteredOrders();

  // ✅ Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  // ✅ Calculate total items in order
  const getTotalItems = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // ✅ Recalculate order total with current delivery costs
  const getRecalculatedTotal = (order) => {
    // Calculate subtotal from items
    const subtotal = order.items?.reduce((total, item) => {
      return total + ((item.price || 0) * (item.quantity || 1));
    }, 0) || 0;

    // Get shipping address from order
    const shippingAddress = order.shippingAddress;

    // Calculate current delivery cost based on shipping address
    const currentDeliveryCost = calculateDeliveryCost(shippingAddress, deliveryCosts);

    // Return new total
    return (subtotal + currentDeliveryCost).toFixed(2);
  };

  if (loading) {
    return (
      <div className="bg-[#121318] min-h-screen text-white px-4 py-6 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">My Orders</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-400">
            <div className="w-8 h-8 border-t-2 border-orange-500 border-solid rounded-full animate-spin mb-2"></div>
            <p>Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121318] min-h-screen text-white px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">My Orders</h2>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded p-3 sm:p-4 mb-3 sm:mb-4">
          <p className="text-red-400 text-[10px] sm:text-sm">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 sm:gap-3 border-b border-gray-700 pb-2 mb-3 sm:mb-4 text-[10px] sm:text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 px-2 sm:px-3 py-1 transition-all duration-200 whitespace-nowrap ${
              activeTab === tab
                ? 'border-b-2 border-orange-500 text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-[#1f1f27] rounded p-2 sm:p-3 mb-3 sm:mb-4">
        <input
          type="text"
          placeholder="Search by order ID, name, product, or SKU"
          className="w-full bg-[#2b2b33] text-white px-3 sm:px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 text-[10px] sm:text-sm transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Orders Count */}
      {!error && (
        <div className="mb-3 sm:mb-4">
          <p className="text-[10px] sm:text-sm text-gray-400">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>
      )}

      {/* Orders List */}
      {!error && filteredOrders.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#181a21] rounded-lg shadow-lg p-3 sm:p-4 transition-all duration-200 hover:shadow-xl hover:bg-[#1a1c24]"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3 sm:mb-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <span className="text-[10px] sm:text-sm font-medium text-white">
                      Order #{order.orderNumber || order._id}
                    </span>
                    <span
                      className={`text-[8px] sm:text-xs px-2 sm:px-3 py-1 rounded-full ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-[9px] sm:text-xs text-gray-400 space-y-1">
                    <p>Date: {formatDate(order.createdAt)}</p>
                    <p>Customer: {order.user?.name || 'N/A'}</p>
                    <p>Total Items: {getTotalItems(order.items)}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-base sm:text-lg font-semibold text-white">৳ {getRecalculatedTotal(order)}</p>
                  <p className="text-[9px] sm:text-xs text-gray-400">
                    Payment: {order.paymentStatus || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 sm:space-y-3">
                {order.items && Array.isArray(order.items) ? (
                  order.items.map((item, idx) => (
                    <div key={`${order.id}-${idx}`} className="flex gap-2 sm:gap-4 p-2 sm:p-3 bg-[#1f1f27] rounded">
                      <div className="flex-shrink-0">
                        <img
                          src={getProductImage(item)}
                          alt={item.name || 'Product'}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded bg-gray-200"
                          onError={(e) => {
                            e.target.src = '/no-image.svg';
                          }}
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-[10px] sm:text-sm font-medium text-white mb-1 line-clamp-2">
                          {item.product_id?.name || item.name || 'Unknown Product'}
                        </h4>

                        <div className="text-[9px] sm:text-xs text-gray-400 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:gap-4 gap-1">
                            <span>Price: ৳ {item.price?.toFixed(2) || '0.00'}</span>
                            <span>Qty: {item.quantity || 1}</span>
                            <span className="font-medium text-white">
                              Subtotal: ৳ {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] sm:text-sm text-gray-400 text-center py-4">
                    No items found in this order
                  </p>
                )}
              </div>

              {/* Additional Info */}
              {(order.shippingAddress || order.paymentMethod || order.notes) && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                  <div className="text-[9px] sm:text-xs text-gray-400 space-y-1">
                    {order.shippingAddress && (
                      <p><span className="font-medium text-white">Address:</span> {`${order.shippingAddress.address}, ${order.shippingAddress.city}`}</p>
                    )}
                    {order.paymentMethod && (
                      <p><span className="font-medium text-white">Payment Method:</span> {order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                    )}
                    {order.notes && (
                      <p><span className="font-medium text-white">Notes:</span> {order.notes}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !error && (
          <div className="text-center py-8 sm:py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-400 text-base sm:text-lg">No orders found</p>
            <p className="text-gray-500 text-[10px] sm:text-sm mt-2">
              {activeTab !== 'All'
                ? `No orders found in "${activeTab}" category`
                : searchTerm
                ? 'Try adjusting your search terms'
                : 'You haven\'t placed any orders yet'}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default MyOrdersPage;
