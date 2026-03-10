import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../Context/UseContext";

const ProductShowcase = () => {
  const { products } = useProduct();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!products || products.length === 0) {
    return (
      <section className="bg-gradient-to-br from-indigo-900 to-gray-900 flex items-center justify-center p-4 sm:p-6 min-h-[60vh]">
        <div className="text-center text-white animate-pulse">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            No Products Available
          </h2>
          <p className="text-sm sm:text-base md:text-lg max-w-md mx-auto">
            Stay tuned for our latest and greatest products coming soon!
          </p>
        </div>
      </section>
    );
  }

  const displayProducts = products.slice(0, 7);

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br  to-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-10 sm:mb-14 tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 ${
            isVisible ? "animate-slide-up" : "opacity-0"
          }`}
        >
          Discover Our Stellar Collection
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {displayProducts.map((product, i) => (
            <div
              key={product.id || i}
              className={`group relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg  transition-all duration-500 cursor-pointer transform ${
                isVisible ? "animate-slide-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
              tabIndex={0}
              aria-label={`Product: ${product.name || "Unnamed Product"}`}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img
                src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
                alt={product.name || "Product"}
                className="w-full h-36 sm:h-52 md:h-60 object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                <div className="w-full">
                  <h3 className="text-sm sm:text-lg font-semibold truncate">
                    {product.name || "Unnamed Product"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold text-base sm:text-xl">
                      ৳{product.price ?? 670}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs sm:text-sm text-gray-300 line-through">
                        ৳{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                New
              </div>
            </div>
          ))}

          <div
            className={`group relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${
              isVisible ? "animate-slide-up" : "opacity-0"
            }`}
            style={{ animationDelay: `${displayProducts.length * 0.1}s` }}
            onClick={() => navigate("/products")}
            tabIndex={0}
            aria-label="View more products"
          >
            <img
              src="https://via.placeholder.com/300x200?text=More"
              alt="View More Products"
              className="w-full h-36 sm:h-52 md:h-60 object-cover brightness-75 group-hover:brightness-100 group-hover:scale-110 transition-all duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-yellow-400 text-gray-900 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold text-sm sm:text-base md:text-lg shadow-lg group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 transform group-hover:scale-105">
                Explore All
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Inline CSS for animation
const styles = `
  @keyframes slideUp {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  .animate-slide-up {
    animation: slideUp 0.6s ease-out forwards;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ProductShowcase;

