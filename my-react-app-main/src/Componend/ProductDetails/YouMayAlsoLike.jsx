import React, { useState } from 'react';
import { useProduct } from '../../Context/UseContext';
import SizeSelectModal from './SizeSelectModal';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/GoogleAuth';

const YouMayAlsoLike = ({ currentProductId }) => {
  const [showModal, setShowModal] = useState(false);
  const [productToBuy, setProductToBuy] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const { products, addToCart } = useProduct();
  const {token} =useAuth()
  const navigate = useNavigate();

  const suggestedItems = products
    .filter((p) => (p._id || p.id) !== currentProductId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 10)
    .map((p, idx) => ({
      ...p,
      id: p._id || p.id || idx,
      name: p.name || p.title || 'Product',
      price: p.price || 0,
      oldPrice: p.oldPrice,
      img:
        (Array.isArray(p.images) && p.images[0]) ||
        p.image ||
        p.imageUrl ||
        '/fallback-image.jpg',
    }));

  // Add to Cart handler with backend integration
  const handleAddToCart = async (finalProduct) => {
    // Check if user is authenticated
    if (!token) {
      navigate('/auth');
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
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-6">You May Also Like</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {suggestedItems.map((item) => (
            <div
              key={item.id}
              className="rounded overflow-hidden shadow hover:shadow-lg transition bg-gray-900"
            >
              <Link to={`/product/${item.id}`}>
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-[200px] object-cover cursor-pointer"
                />
              </Link>
              <div className="p-3">
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
                className="w-full py-2 text-sm font-semibold text-white bg-black rounded 
                           border border-transparent 
                           hover:border-yellow-400 hover:shadow-[0_0_0_2px_rgba(253,224,71,0.5)] 
                           transition duration-200"
              >
                ➕ Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-all duration-300">
          ✅ Successfully added to cart!
        </div>
      )}

      {/* Modal */}
      <SizeSelectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={productToBuy}
        onConfirm={handleAddToCart}
      />
    </div>
  );
};

export default YouMayAlsoLike;





