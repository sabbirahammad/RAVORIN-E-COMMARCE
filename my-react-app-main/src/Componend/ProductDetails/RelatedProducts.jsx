import React, { useState } from 'react';
import { useProduct } from '../../Context/UseContext';
import SizeSelectModal from './SizeSelectModal';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/GoogleAuth';

const RelatedProducts = ({ currentProductId }) => {
  const { products, addToCart } = useProduct();
const {token}=useAuth();
  const [showModal, setShowModal] = useState(false);
  const [productToBuy, setProductToBuy] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  // Step 1: Find current product
  const currentProduct = products?.find((p) => p.id === currentProductId);

  // Step 2: Filter related products by same category (case-insensitive)
  const relatedItems = currentProduct
    ? products
        .filter(
          (item) =>
            item.id !== currentProductId &&
            item.category?.toLowerCase() === currentProduct.category?.toLowerCase()
        )
        .slice(0, 5)
    : [];

  // Step 3: Add to cart handler (updated with backend integration)
  const handleAddToCart = async (finalProduct) => {
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    // Add default size if not specified
    const productWithSize = {
      ...finalProduct,
      size: finalProduct.size || 'M',
      selectedSize: finalProduct.selectedSize || 'M'
    };

    try {
      const result = await addToCart(productWithSize);

      if (result.success) {
        setShowModal(false);
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 2500);
      } else {
        console.error('Failed to add to cart:', result.message);
        alert(`Failed to add to cart: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setShowModal(false);
      setSuccessMessage(false);
      alert('Error adding product to cart. Please try again.');
    }
  };

  return (
    <div className="py-8 px-4 sm:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-6">🍭 Related Products</h2>

        {!currentProduct ? (
          <p className="text-gray-400 text-center">Loading related products...</p>
        ) : relatedItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {relatedItems.map((item) => (
              <div
                key={item.id}
                className="rounded overflow-hidden bg-[#1a1a1a] shadow hover:shadow-lg transition"
              >
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.images || '/fallback-image.jpg'} // Fixed to handle string type image URL
                    alt={item.name}
                    className="w-full h-[200px] object-cover cursor-pointer"
                  />
                </Link>

                <div className="p-3">
                  <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-400 font-bold text-sm">৳{item.price}</span>
                    {item.oldPrice && (
                      <span className="line-through text-gray-500 text-xs">৳{item.oldPrice}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setProductToBuy(item);
                    setShowModal(true);
                  }}
                  className="w-full py-2 text-sm font-semibold text-white bg-black border border-transparent rounded 
                             hover:border-yellow-400 hover:shadow-[0_0_0_2px_rgba(253,224,71,0.5)] 
                             transition duration-200"
                >
                  ➕ Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No related products found in this category.</p>
        )}
      </div>

      {/* ✅ Toast Message */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-all duration-300">
          ✅ Successfully added to cart!
        </div>
      )}

      {/* ✅ Size Selection Modal */}
      <SizeSelectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={productToBuy}
        onConfirm={handleAddToCart}
      />
    </div>
  );
};

export default RelatedProducts;







