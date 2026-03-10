import React from 'react';
import { motion } from 'framer-motion';
import { useProduct } from '../../Context/UseContext';
import { useNavigate } from 'react-router-dom';

const ProductShowcase = () => {
  const { products, categories } = useProduct();
  const navigate = useNavigate();

  // ✅ Guard for async data
  if (!products || !categories || products.length === 0 || categories.length === 0) {
    return (
      <div className="bg-black py-12 px-4 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg font-semibold">Loading products...</p>
        </div>
      </div>
    );
  }

  // Filter Male category products
  const maleProducts = products
    .filter((product) => {
      const matchedCategory = categories.find(
        (cat) => cat.id === product.category_id
      );
      return matchedCategory?.name?.toLowerCase() === 'men';
    });

  if (!maleProducts || maleProducts.length === 0) {
    return (
      <div className="bg-black py-12 px-4 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg font-semibold">No male products available</p>
          <p className="text-sm text-gray-400">Check back later for new items!</p>
        </div>
      </div>
    );
  }

  const handleCardClick = (product) => {
    navigate('/products', {
      state: {
        highlightId: product.id,
        category: product.category,
      },
    });
  };

  const handleViewClick = (e, product) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-9 gap-4 sm:gap-6">

          {/* Left Small Cards */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-2 gap-4 rounded-lg p-2"
               style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0))' }}>
            {maleProducts.slice(1, 5).map((product, index) => (
              <SmallProductCard
                key={product.id}
                product={product}
                index={index}
                handleViewClick={handleViewClick}
                handleCardClick={handleCardClick}
              />
            ))}
          </div>

          {/* Center Featured Product */}
          {maleProducts[0] && (
            <motion.div
              className="col-span-1 sm:col-span-2 lg:col-span-3 relative rounded-xl overflow-hidden cursor-pointer shadow-lg shadow-yellow-500/30"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleCardClick(maleProducts[0])}
            >
              <img
                src={maleProducts[0].images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={maleProducts[0].name || 'Featured Product'}
                className="w-full h-[300px] sm:h-[400px] lg:h-[490px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-lg sm:text-xl font-semibold text-white truncate">{maleProducts[0].name}</h3>
                <p className="text-yellow-400 text-sm sm:text-base font-medium">৳{maleProducts[0].price}</p>
                <p className="text-gray-400 text-xs sm:text-sm line-through">৳{maleProducts[0].oldPrice}</p>
                <motion.button
                  onClick={(e) => handleViewClick(e, maleProducts[0])}
                  className="mt-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium hover:bg-yellow-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Right Small Cards */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-2 gap-4 rounded-lg p-2"
               style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))' }}>
            {maleProducts.slice(5, 8).map((product, index) => (
              <SmallProductCard
                key={product.id}
                product={product}
                index={index}
                handleViewClick={handleViewClick}
                handleCardClick={handleCardClick}
              />
            ))}

            {/* More Options Card */}
            <motion.div
              className="relative flex items-center justify-center bg-gray-500 text-black rounded-lg h-36 sm:h-48 cursor-pointer hover:bg-gray-600 transition"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/products')}
            >
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <p className="text-sm font-semibold">More Products</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SmallProductCard = ({ product, index, handleViewClick, handleCardClick }) => {
  const price = product.price ?? 1000;
  const oldPrice = product.oldPrice ?? 1500;

  return (
    <motion.div
      className="relative rounded-lg overflow-hidden cursor-pointer shadow-md shadow-yellow-400/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => handleCardClick(product)}
    >
      <img
        src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={product.name || 'Product'}
        className="w-full h-36 sm:h-48 object-cover rounded"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <p className="text-xs sm:text-sm font-semibold text-white truncate">{product.name}</p>
        <p className="text-yellow-400 text-xs sm:text-sm font-medium">৳{price}</p>
        <p className="text-gray-400 text-xs line-through">৳{oldPrice}</p>
        <motion.button
          className="mt-1 bg-yellow-500 text-black px-2 py-0.5 rounded-full text-xs font-medium hover:bg-yellow-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => handleViewClick(e, product)}
        >
          View
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductShowcase;




