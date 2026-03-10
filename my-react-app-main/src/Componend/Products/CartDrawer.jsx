import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProduct } from '../../Context/UseContext';
import { useAuth } from '../../Context/GoogleAuth';
import { Link } from 'react-router-dom';

const CartDrawer = ({ isOpen, setIsOpen, isDarkMode }) => {
  const { cartItems, setCartItems } = useProduct();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { token } = useAuth();

  // Expose refresh function to parent components
  React.useImperativeHandle(React.forwardRef(() => ({})).ref, () => ({
    refreshCart: () => setRefreshTrigger(prev => prev + 1)
  }));

  // ✅ Fetch Cart Items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);

        // Get token from localStorage (context token might not be updated)
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          setCartItems([]);
          setIsLoading(false);
          return;
        }

        const res = await fetch('https://apii.ravorin.com/api/v1/cart', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();

        console.log('🛒 Raw cart data from API:', data);

        if (data?.success && data?.cart?.items) {
          // ✅ Properly map cart items with correct _id
          const mappedItems = data.cart.items.map(item => ({
            id: item._id, // ✅ This is the subdocument _id
            product_id: item.product_id?._id || item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || '/no-image.svg', // ✅ image already saved in DB
          }));

          console.log('🛒 Mapped cart items:', mappedItems);
          console.log('🛒 Cart items count:', mappedItems.length);

          setCartItems(mappedItems);
        } else if (data?.cart?.items) {
          // Handle case where success field might be missing
          const mappedItems = data.cart.items.map(item => ({
            id: item._id,
            product_id: item.product_id?._id || item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || '/no-image.svg',
          }));

          console.log('🛒 Cart items (no success field):', mappedItems);
          setCartItems(mappedItems);
        } else {
          console.log('🛒 No cart items found in response');
          setCartItems([]);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
          console.error('Network error - please check connection');
        } else if (res.status === 401) {
          console.error('Authentication failed - token may be invalid');
        }
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, setCartItems, refreshTrigger]);

  // ✅ Update Quantity
  const updateQty = async (itemId, qty) => {
    // Get token
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      alert('Please login to update cart');
      return;
    }

    // Optimistically update UI
    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: qty } : item
    );
    setCartItems(updatedCart);

    try {
      const res = await fetch(`https://apii.ravorin.com/api/v1/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ quantity: qty }),
      });

      if (!res.ok) {
        throw new Error('Failed to update quantity');
      }

      const data = await res.json();

      // Update with server response
      if (data?.success && data?.cart?.items) {
        const mappedItems = data.cart.items.map(item => ({
          id: item._id,
          product_id: item.product_id?._id || item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '/no-image.svg',
        }));
        setCartItems(mappedItems);
      }
    } catch (err) {
      console.error('Failed to update cart item:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
        alert('Network error. Please check your connection.');
      } else if (res.status === 401) {
        alert('Authentication failed. Please login again.');
      } else {
        alert('Failed to update cart item. Please try again.');
      }
      // Revert on error
      setCartItems(cartItems);
    }
  };

  const incrementQty = (id, currentQty) => updateQty(id, currentQty + 1);
  const decrementQty = (id, currentQty) => updateQty(id, Math.max(1, currentQty - 1));

  // ✅ Remove Item
  const removeItem = async (id) => {
    // Get token
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to remove items from cart');
      return;
    }

    // Optimistically update UI
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);

    try {
      const res = await fetch(`https://apii.ravorin.com/api/v1/cart/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to remove item');
      }

      const data = await res.json();

      // Update with server response
      if (data?.success && data?.cart?.items) {
        const mappedItems = data.cart.items.map(item => ({
          id: item._id,
          product_id: item.product_id?._id || item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '/no-image.svg',
        }));
        setCartItems(mappedItems);
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
        alert('Network error. Please check your connection.');
      } else if (res.status === 401) {
        alert('Authentication failed. Please login again.');
      } else {
        alert('Failed to remove item. Please try again.');
      }
      // Revert on error
      setCartItems(cartItems);
    }
  };

  // ✅ Clear Cart
  const clearCart = async () => {
    // Get token
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to clear cart');
      return;
    }

    // Optimistically update UI
    const previousCart = [...cartItems];
    setCartItems([]);

    try {
      const res = await fetch('https://apii.ravorin.com/api/v1/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to clear cart');
      }
    } catch (err) {
      console.error('Failed to clear cart:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
        alert('Network error. Please check your connection.');
      } else if (res.status === 401) {
        alert('Authentication failed. Please login again.');
      } else {
        alert('Failed to clear cart. Please try again.');
      }
      // Revert on error
      setCartItems(previousCart);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  if (isLoading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed top-16 right-4 w-[280px] z-50 p-4 rounded shadow-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
              }`}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
          >
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed top-16 right-4 w-[280px] max-h-[75vh] z-50 overflow-y-auto rounded-lg shadow-xl p-4 transition-all ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
            }`}
          initial={{ x: 50, opacity: 0, scale: 0.95 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 50, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold flex items-center gap-2">
              🛒 Your Cart
              <span className="bg-indigo-500 text-white text-xs rounded-full px-2 py-1">
                {totalItems}
              </span>
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold hover:text-yellow-400 transition-colors"
            >
              ×
            </button>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-8">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-3">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 bg-gray-900 dark:bg-gray-700 p-2 rounded"
                >
                  {/* Product Image */}
                  {item.image && item.image !== '/no-image.svg' ? (
                    <img
                      src={item.image.startsWith('http') ? item.image : `https://apii.ravorin.com${item.image}`}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-md border border-gray-600 flex-shrink-0"
                      onError={(e) => {
                        console.log('Image failed to load:', item.image);
                        e.target.style.display = 'none';
                        // Show the fallback div (next sibling)
                        const fallbackDiv = e.target.nextSibling;
                        if (fallbackDiv) {
                          fallbackDiv.style.display = 'flex';
                        }
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', item.image);
                        // Hide the fallback div when image loads successfully
                        const fallbackDiv = e.target.nextSibling;
                        if (fallbackDiv) {
                          fallbackDiv.style.display = 'none';
                        }
                      }}
                    />
                  ) : null}

                  {/* Fallback for no image or failed to load */}
                  <div
                    className="w-10 h-10 rounded-md border border-gray-600 flex-shrink-0 bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold"
                    style={{
                      display: (!item.image || item.image === '/no-image.svg') ? 'flex' : 'none'
                    }}
                  >
                    No Image
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-300">
                      {item.quantity} × ৳{item.price}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-center space-y-1">
                    <button
                      onClick={() => decrementQty(item.id, item.quantity)}
                      className="w-5 h-5 flex items-center justify-center bg-gray-600 dark:bg-gray-500 rounded-full text-xs hover:bg-gray-500 dark:hover:bg-gray-400 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-xs font-medium min-w-[16px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => incrementQty(item.id, item.quantity)}
                      className="w-5 h-5 flex items-center justify-center bg-gray-600 dark:bg-gray-500 rounded-full text-xs hover:bg-gray-500 dark:hover:bg-gray-400 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-600 text-xs font-bold ml-2 flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}

              <div className="border-t border-gray-600 pt-3 mt-3">
                <p className="text-sm font-semibold text-right mb-3">
                  Total: ৳{totalPrice.toFixed(2)}
                </p>
                <div className="flex gap-2">
                  <Link to="/cartpayment" className="flex-1">
                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-sm py-2 rounded transition-colors font-medium">
                      Checkout
                    </button>
                  </Link>
                  <button
                    onClick={clearCart}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded transition-colors font-medium"
                  >
                    Clear Cart
                  </button>
                </div>

              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
