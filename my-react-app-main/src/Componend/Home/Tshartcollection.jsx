import React, { useState } from "react";
import { useProduct } from "../../Context/UseContext";
import { useNavigate } from "react-router-dom";

const TshirtShowcase = () => {
  const { products,categories } = useProduct();
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();


  // ✅ Filter only T-shirt category
  const tshirtProducts = products
  .filter((product) => {
    const matchedCategory = categories.find(
      (cat) => cat.id === product.category_id
    );

    if (matchedCategory?.name?.toLowerCase() === 't-shirt') {
      console.log("Matched Product:", product.name, matchedCategory);
      return true;
    }

    return false;
  })
  .slice(0, 6);


  const handleClick = (item) => {
    navigate('/products', {
      state: {
        highlightId: item.id,
        category: item.category,
      },
    });
  };

  const toggleName = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-12 px-2 sm:px-4 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
          Explore Our Latest T-Shirts
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
          {tshirtProducts.map((item, index) => (
            <div
              key={item.id || index}
              className="relative rounded-xl shadow-md overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
              onClick={() => {
                toggleName(index);
                handleClick(item);
              }}
            >
              <img
                src={item.images?.[0] || '/no-image.jpg'} // Default image if not available
                alt={item.name}
                className="w-full h-40 sm:h-52 object-cover rounded-xl group-hover:opacity-90 transition duration-300"
                loading="lazy"
              />

              <div
                className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-3 py-2
                  transform transition-transform duration-300 ease-in-out
                  ${activeIndex === index ? "translate-y-0" : "translate-y-full"}
                `}
                style={{ pointerEvents: "none" }}
              >
                <h3
                  className="text-xs sm:text-sm font-semibold text-center truncate"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TshirtShowcase;








