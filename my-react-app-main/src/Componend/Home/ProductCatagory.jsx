import React from "react";
import { useProduct } from "../../Context/UseContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProductCategoryGrid = () => {
  const { categories } = useProduct();

  if (!categories || categories.length === 0) {
    return <p className="text-center text-red-500">No categories available</p>;
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-screen-xl mx-auto text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent mb-3">
          Discover Categories That Define You
        </h2>
        <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-6">
          Unlock a world of choices. Stylish, bold, and tailored just for your lifestyle.
        </p>
        <a
          href="/category"
          className="inline-block px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300"
        >
          Browse Categories
        </a>
      </motion.div>

      <div className="max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
            viewport={{ once: true }}
            className="group bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-md hover:shadow-cyan-500/20 transition-transform duration-300 hover:scale-105"
          >
            <Link to={`/category/${encodeURIComponent(cat.name?.toLowerCase().replace(/\s+/g, '-'))}`} className="block group">

              <div className="relative w-full h-36 sm:h-40 md:h-44 lg:h-48 overflow-hidden rounded-lg">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200x300?text=No+Image";
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full text-center bg-gradient-to-t from-black/70 to-transparent p-1.5 rounded-b-lg">
                  <p className="text-white font-medium text-xs sm:text-sm truncate">
                    {cat.name}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductCategoryGrid;












