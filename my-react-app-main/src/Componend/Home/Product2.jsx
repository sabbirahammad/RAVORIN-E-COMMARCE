import React from 'react';
import { motion } from 'framer-motion';
import { useProduct } from '../../Context/UseContext';
import { useNavigate } from 'react-router-dom';

const ProductShowcase = () => {
  const { products,categories } = useProduct();
  const navigate = useNavigate();
  // ✅ Filter only "Male" category
const maleProducts = products
  .filter((product) => {
    const matchedCategory = categories.find(
      (cat) => cat.id === product.category_id
    );

    if (matchedCategory?.name?.toLowerCase() === 'kids') {
      return true;
    }

    return false;
  })
  .slice(0, 7);

  if (!maleProducts || maleProducts.length === 0) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg font-semibold">No products available</p>
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
    <div className="bg-gradient-to-b from-gray-900 to-black py-12 px-4 flex justify-center items-start">
      <div className="max-w-screen-xl w-full rounded-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {maleProducts[0] && (
            <motion.div
              className="relative rounded-xl overflow-hidden cursor-pointer shadow-lg shadow-yellow-500/30"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleCardClick(maleProducts[0])}
            >
              <img
                src={maleProducts[0].images?.[0] || '/no-image.jpg'}
                alt={maleProducts[0].name}
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-xl font-semibold text-white truncate">{maleProducts[0].name}</h3>
                <p className="text-yellow-400 font-medium">৳{maleProducts[0].price}</p>
                <p className="text-gray-400 text-sm line-through">৳{maleProducts[0].oldPrice}</p>
                <motion.button
                  onClick={(e) => handleViewClick(e, maleProducts[0])}
                  className="mt-2 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-yellow-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {maleProducts.slice(1, 10).map((product, idx) => (
              <motion.div
                key={product.id}
                className="relative rounded-lg overflow-hidden shadow-md shadow-yellow-400/20 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleCardClick(product)}
              >
                <img
                  src={product.images?.[0] || '/no-image.jpg'}
                  alt={product.name}
                  className="w-full h-40 md:h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <h4 className="text-white text-sm truncate">{product.name}</h4>
                  <p className="text-yellow-400 text-xs">৳{product.price}</p>
                  <p className="text-gray-400 text-xs line-through">৳{product.oldPrice}</p>
                  <motion.button
                    onClick={(e) => handleViewClick(e, product)}
                    className="mt-1 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs hover:bg-yellow-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;






