import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/GoogleAuth";

const ProductDetailsModal = ({ isOpen, onClose, product, addToCart }) => {
   const [selectedImage, setSelectedImage] = useState(null);
   const [isAdding, setIsAdding] = useState(false);
   const [selectedSize, setSelectedSize] = useState('');
   const { token } = useAuth();
   const navigate = useNavigate();

  useEffect(() => {
    if (product?.images) {
      const images = Array.isArray(product.images) ? product.images : [product.images];
      setSelectedImage(images[0]);
    } else {
      setSelectedImage('/no-image.svg');
    }
    // Reset selected size when product changes
    setSelectedSize('');
  }, [product]);

  if (!product) return null;

  const images = Array.isArray(product.images) ? product.images : [product.images];

  const handleAddToCart = async () => {
    if (isAdding) return; // Prevent double-click

    // Validate size selection
    if (!selectedSize) {
      alert('Please select a size before adding to cart');
      return;
    }

    // Check if user is authenticated - try context first, then localStorage
    let authToken = token || localStorage.getItem('token');

    if (!authToken) {
      console.log('❌ No token found, redirecting to auth');
      navigate('/auth');
      return;
    }

    console.log('🔑 Token found:', authToken.substring(0, 20) + '...');
    console.log('📦 Sending request to add to cart for product:', product._id || product.id, 'Size:', selectedSize);

    try {
      setIsAdding(true);

      const response = await fetch('https://apii.ravorin.com/api/v1/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`, // ✅ Use the authToken variable
        },
        body: JSON.stringify({
          product_id: product._id || product.id, // ✅ Use _id first
          quantity: 1,
          size: selectedSize, // ✅ Include selected size
        }),
      });

      console.log('📦 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.cart) {
          // ✅ Map cart items properly
          const mappedItems = data.cart.items.map(item => ({
            id: item._id,
            product_id: item.product_id?._id || item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || '/no-image.svg',
          }));
          
          addToCart(mappedItems); // Update context
          onClose();
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to add product to cart:', errorData);
        if (response.status === 401) {
          console.log('❌ 401 Unauthorized - token may be invalid');
          navigate('/auth');
        } else {
          alert(`Failed to add product to cart: ${errorData.message || 'Please try again.'}`);
        }
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Error adding to cart. Please try again.');
      }
    } finally {
      setIsAdding(false);
    }
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

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#181818] rounded-lg w-full max-w-lg sm:max-w-3xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 text-white shadow-xl relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-4 text-2xl font-bold hover:text-yellow-500 transition-colors"
              >
                ×
              </button>

              <div className="flex flex-col md:flex-row gap-5">
                <div className="md:w-1/2 space-y-2">
                  <img
                    src={selectedImage || '/no-image.svg'}
                    alt={product.name}
                    className="w-full rounded object-contain max-h-64 md:max-h-80 bg-gray-900"
                    onError={(e) => {
                      e.target.src = '/no-image.svg';
                    }}
                  />
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          onClick={() => setSelectedImage(img)}
                          onError={(e) => {
                            e.target.src = '/no-image.svg';
                          }}
                          className={`h-16 w-16 object-cover rounded cursor-pointer border-2 transition-all ${
                            selectedImage === img 
                              ? 'border-yellow-400 scale-105' 
                              : 'border-gray-600 hover:border-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:w-1/2 flex flex-col">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h2>
                  <p className="text-gray-400 mb-4 text-sm sm:text-base line-clamp-3">
                    {product.description}
                  </p>

                  <div className="mb-4">
                    {product.oldPrice && (
                      <span className="line-through text-gray-600 mr-3 text-base sm:text-lg">
                        ৳{product.oldPrice}
                      </span>
                    )}
                    <span className="text-yellow-500 font-bold text-xl sm:text-2xl">
                      ৳{product.price}
                    </span>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-2 text-sm font-medium rounded-md border transition-all ${
                            selectedSize === size
                              ? 'bg-yellow-500 text-black border-yellow-500'
                              : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {selectedSize && (
                      <p className="text-sm text-green-400 mt-1">
                        Selected: {selectedSize}
                      </p>
                    )}
                  </div>

                  {product.stock !== undefined && (
                    <p className="text-sm text-gray-400 mb-4">
                      {product.stock > 0 ? (
                        <span className="text-green-400">In Stock ({product.stock} available)</span>
                      ) : (
                        <span className="text-red-400">Out of Stock</span>
                      )}
                    </p>
                  )}

                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || (product.stock !== undefined && product.stock === 0) || !selectedSize}
                    className={`mt-auto bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded text-sm sm:text-base font-medium transition-colors ${
                      isAdding || (product.stock !== undefined && product.stock === 0) || !selectedSize
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {isAdding ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailsModal;









