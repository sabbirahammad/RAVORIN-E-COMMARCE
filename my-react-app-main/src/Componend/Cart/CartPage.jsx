import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlus, HiMinus, HiTrash } from 'react-icons/hi';
import { useProduct } from '../../Context/UseContext';
import { useAuth } from '../../Context/GoogleAuth';

const CartPage = () => {
  const { cartItems, setCartItems } = useProduct();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]); // ✅ প্রোডাক্ট স্টোর করবে
  const { token } = useAuth();

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch('https://apii.ravorin.com/api/v1/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      if (!Array.isArray(data.products)) {
        throw new Error('Expected an array of products');
      }
      setProducts(data.products);
    } catch (err) {
      console.error('Fetch products error:', err);
    }
  };

  // ✅ Fetch Cart Items
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://apii.ravorin.com/api/v1/cart', {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        });

        const data = await response.json();

        if (data?.cart?.items) {
          setCartItems(data.cart.items);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, [setCartItems, token]);

  // ✅ Fetch Products (once)
  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Wait for both cartItems and products to load
  useEffect(() => {
    if (cartItems.length > 0 && products.length > 0) {
      setIsLoading(false);
    } else if (cartItems.length === 0) {
      setIsLoading(false);
    }
  }, [cartItems, products]);

  // ✅ Helper: Get product by ID
  const getProductById = (id) => {
    return products.find((p) => p.id === id);
  };

  // ✅ Update Backend (PUT)
  const updateCartBackend = async (itemId, quantity) => {
    try {
      const response = await fetch(
        `https://apii.ravorin.com/api/v1/cart/items/${itemId}`,
        {
          method: 'PUT',
          // headers: {
          //   'Content-Type': 'application/json',
          //   Authorization: `Bearer ${token}`,
          // },
          body: JSON.stringify({ quantity }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update cart:', errorData);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  // ✅ Remove from Backend (DELETE)
  const removeFromBackend = async (itemId) => {
    try {
      const response = await fetch(
        `https://apii.ravorin.com/api/v1/cart/items/${itemId}`,
        {
          method: 'DELETE',
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to remove item:', errorData);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // ✅ Increment Quantity
  const incrementQty = async (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);

    const updatedItem = updatedItems.find((item) => item.id === id);
    if (updatedItem) {
      await updateCartBackend(id, updatedItem.quantity);
    }
  };

  // ✅ Decrement Quantity
  const decrementQty = async (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    setCartItems(updatedItems);

    const updatedItem = updatedItems.find((item) => item.id === id);
    if (updatedItem) {
      await updateCartBackend(id, updatedItem.quantity);
    }
  };

  // ✅ Remove Item
  const removeItem = async (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    await removeFromBackend(id);
  };

  // ✅ Total Price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center">
        <p className="text-xl">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col lg:flex-row p-6 gap-6">
      {/* Cart Section */}
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-bold">🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-400 mt-10 text-center">Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {cartItems.map(({ id, product_id, quantity, price }) => {
              const product = getProductById(product_id);
              const productName = product?.name || 'Loading...';
              const productImage = product?.images?.[0];

              return (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center bg-[#2A2A2A] rounded-xl p-4 shadow"
                >
                  {/* Optional Image */}
                  {productImage && (
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-12 h-12 object-cover rounded mr-4"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}

                  <div className="flex flex-col flex-1">
                    <span className="font-semibold">{productName}</span>
                    <span className="text-sm text-gray-400">৳{price} each</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[#333] rounded-full px-3 py-1">
                      <button
                        onClick={() => decrementQty(id)}
                        className="hover:text-yellow-400"
                        aria-label="Decrease quantity"
                      >
                        <HiMinus />
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => incrementQty(id)}
                        className="hover:text-yellow-400"
                        aria-label="Increase quantity"
                      >
                        <HiPlus />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(id)}
                      className="text-red-400 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <HiTrash />
                    </button>
                  </div>

                  <div className="font-bold">৳{price * quantity}</div>
                </motion.li>
              );
            })}
          </ul>
        )}

        {cartItems.length > 0 && (
          <div className="text-right pt-4 border-t border-gray-600/50">
            <p className="text-lg font-semibold">Total: ৳{totalPrice}</p>
            <button className="mt-3 bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-500 font-semibold">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* Right Animation Section */}
      <motion.div
        className="hidden lg:flex items-center justify-center w-full lg:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-64 h-64 bg-gradient-to-br from-yellow-500 to-pink-500 rounded-full shadow-2xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default CartPage;

