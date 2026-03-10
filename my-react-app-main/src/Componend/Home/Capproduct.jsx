import React from 'react';
import { motion } from 'framer-motion';
import { useProduct } from '../../Context/UseContext';
import { useNavigate } from 'react-router-dom';

const Capproduct = () => {
  const { products, categories } = useProduct();
  const navigate = useNavigate();

  // ✅ তিনটা নির্দিষ্ট ক্যাটাগরি বেছে নিচ্ছি
  const targetCategories = ["men", "women", "kids"];

  // ✅ প্রতিটা ক্যাটাগরির জন্য প্রোডাক্ট ফিল্টার করে নিচ্ছি
  const categoryWiseProducts = targetCategories.flatMap((catName) => {
    return products
      .filter((product) => {
        const matchedCategory = categories.find(
          (cat) => cat.id === product.category_id
        );
        return matchedCategory?.name?.toLowerCase() === catName.toLowerCase();
      })
      .slice(0, 1); // 👉 প্রতিটা ক্যাটাগরি থেকে সর্বোচ্চ ২টা নেবে
  });

  const handleCardClick = (product) => {
    navigate('/products', {
      state: {
        highlightId: product.id,
        category: product.category,
      },
    });
  };

  if (!products || products.length === 0) {
    return (
      <div className="bg-black py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg font-semibold">No products available</p>
          <p className="text-sm text-gray-400 mt-2">Check back later for new items!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {categoryWiseProducts.map((product, index) => (
            <motion.div
              key={product.id || index}
              className="relative rounded-xl overflow-hidden shadow-lg shadow-yellow-500/40 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleCardClick(product)}
            >
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={product.name || 'Product'}
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end items-center p-4">
                <h2
                  className="text-white text-center max-w-[90%] truncate"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                    fontSize: '1.5rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {product.name || 'Unnamed Product'}
                </h2>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Capproduct;

