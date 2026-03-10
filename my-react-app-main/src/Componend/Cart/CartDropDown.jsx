import React, { useEffect, useState } from 'react';
import { HiX, HiPlus, HiMinus, HiTrash } from 'react-icons/hi';
import { FaShoppingCart } from 'react-icons/fa';
import { useProduct } from '../../Context/UseContext';
import { useAuth } from '../../Context/GoogleAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CartDropdown = ({ isDarkMode, isOpen, setIsOpen }) => {
   const { cartItems, setCartItems, fetchCartItems } = useProduct();
   const { token, isAuthenticated } = useAuth();
   const [products, setProducts] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch('https://apii.ravorin.com/api/v1/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setProducts([]);
    }
  };

  // ✅ Use centralized cart management - no need for separate fetch
  useEffect(() => {
    if (isAuthenticated && token) {
      setIsLoading(false); // Cart data comes from context
    } else {
      setCartItems([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  // ✅ Fetch Products (once)
  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Helper: Get product by ID
  const getProductById = (id) => {
    return products.find((p) => (p._id === id || p.id === id));
  };

  // ✅ Increment Quantity - use direct API call with proper error handling
  const incrementQty = async (id) => {
    if (!isAuthenticated || !token) return;

    const currentQty = cartItems.find(item => item.id === id)?.quantity;
    if (!currentQty) return;

    try {
      const response = await fetch(
        `https://apii.ravorin.com/api/v1/cart/items/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: currentQty + 1 }),
        }
      );

      if (response.ok) {
        // Refresh cart data from context
        if (fetchCartItems) {
          await fetchCartItems();
        }
      } else {
        console.error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // ✅ Decrement Quantity - use direct API call with proper error handling
  const decrementQty = async (id) => {
    if (!isAuthenticated || !token) return;

    const currentQty = cartItems.find(item => item.id === id)?.quantity;
    if (currentQty <= 1) return;

    try {
      const response = await fetch(
        `https://apii.ravorin.com/api/v1/cart/items/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: currentQty - 1 }),
        }
      );

      if (response.ok) {
        // Refresh cart data from context
        if (fetchCartItems) {
          await fetchCartItems();
        }
      } else {
        console.error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // ✅ Remove Item - use direct API call with proper error handling
  const removeItem = async (id) => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await fetch(
        `https://apii.ravorin.com/api/v1/cart/items/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        // Refresh cart data from context
        if (fetchCartItems) {
          await fetchCartItems();
        }
      } else {
        console.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // ✅ Total Price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  // ✅ Loading State UI
  if (isLoading) {
    return (
      <div className="relative">
        <button
          aria-label="Shopping cart"
          className={`p-2 rounded-full hover:bg-yellow-400 hover:text-black transition-colors relative focus:outline-none focus:ring-2 focus:ring-yellow-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        >
          <FaShoppingCart className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full ring-2 ring-white">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        aria-label="Shopping cart"
        className={`p-2 rounded-full hover:bg-yellow-400 hover:text-black transition-colors relative focus:outline-none focus:ring-2 focus:ring-yellow-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaShoppingCart className="w-5 h-5" />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full ring-2 ring-white">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`absolute top-full mt-3 w-80 rounded-xl shadow-2xl z-[9999] overflow-hidden ${isDarkMode ? 'bg-gradient-to-b from-gray-800 to-gray-900 text-white' : 'bg-gradient-to-b from-white to-gray-100 text-gray-900'}`}
            style={{ right: '-100px' }}
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl tracking-tight">Your Cart</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close cart dropdown"
                  className="p-1 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <p className="text-sm text-center text-gray-400 py-8">
                  Your cart is empty.
                </p>
              ) : (
                <>
                  <ul className="divide-y divide-gray-600/50 max-h-60 overflow-y-auto mb-5">
                    {cartItems.map((item) => {
                      const product = getProductById(item.product_id);
                      const productName = product?.name || item.name || 'Loading...';
                      const productImage = item.image && item.image !== '/no-image.svg' 
                        ? item.image 
                        : product?.images?.[0] || '';

                      return (
                        <li
                          key={item.id}
                          className="flex justify-between items-center py-3 transition-all duration-200 hover:bg-gray-700/20 rounded-lg px-2"
                        >
                          {/* Product Image */}
                          {productImage && productImage !== '/no-image.svg' ? (
                            <img
                              src={productImage.startsWith('http') ? productImage : `https://apii.ravorin.com${productImage}`}
                              alt={productName}
                              className="w-10 h-10 object-cover rounded mr-3"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const fallback = e.target.nextSibling;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                              onLoad={(e) => {
                                const fallback = e.target.nextSibling;
                                if (fallback) fallback.style.display = 'none';
                              }}
                            />
                          ) : null}
                          
                          <div
                            className="w-10 h-10 rounded mr-3 bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold"
                            style={{ display: (!productImage || productImage === '/no-image.svg') ? 'flex' : 'none' }}
                          >
                            No Img
                          </div>

                          <div className="flex flex-col flex-1">
                            <span className="font-semibold text-sm">
                              {productName}
                            </span>
                            <span className="text-xs text-gray-400">
                              Size: {item.size || 'M'} | ৳{item.price} each
                            </span>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 bg-gray-800/50 rounded-full px-2 py-1">
                              <button
                                onClick={() => decrementQty(item.id)}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-600 transition-colors"
                                aria-label={`Decrease quantity of ${productName}`}
                              >
                                <HiMinus className="w-4 h-4" />
                              </button>
                              <span className="w-6 text-center text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => incrementQty(item.id)}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-600 transition-colors"
                                aria-label={`Increase quantity of ${productName}`}
                              >
                                <HiPlus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                              aria-label={`Remove ${productName} from cart`}
                            >
                              <HiTrash className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="font-semibold text-sm ml-2">
                            ৳{item.price * item.quantity}
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="flex justify-between font-bold text-lg mb-5 border-t border-gray-600/50 pt-4">
                    <span>Total:</span>
                    <span>৳{totalPrice.toFixed(2)}</span>
                  </div>

                  <Link to={"/cartpayment"} className="w-full">
                    <button className="w-full bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors shadow-md">
                      Proceed to Checkout
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartDropdown;


