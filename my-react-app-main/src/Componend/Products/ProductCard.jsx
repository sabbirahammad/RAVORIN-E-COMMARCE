import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ id, name, price, oldPrice, discount, image }) => {
  const navigate = useNavigate();

  const displayImage = Array.isArray(image)
    ? image[0]
    : image || '/fallback.jpg';

  const safePrice = Number(price) || 0;
  const safeOldPrice = Number(oldPrice) || 0;
  const safeDiscount = Number(discount) || 0;
  const computedDiscountPercent =
    safeDiscount > 0
      ? safeDiscount
      : safeOldPrice > safePrice && safeOldPrice > 0
        ? Math.round(((safeOldPrice - safePrice) / safeOldPrice) * 100)
        : 0;
  const saveAmount =
    safeOldPrice > safePrice
      ? safeOldPrice - safePrice
      : computedDiscountPercent > 0 && safePrice > 0
        ? Math.round((safePrice * computedDiscountPercent) / 100)
        : 0;

  const handleViewClick = (e) => {
    e.stopPropagation();
    navigate(`/product/${id}`);
  };

  return (
    <article className="group bg-[#1a1a1a] rounded-2xl shadow-[0_12px_26px_rgba(0,0,0,0.28)] overflow-hidden flex flex-col border border-gray-800 hover:-translate-y-1 hover:border-yellow-500/50 hover:shadow-[0_22px_38px_rgba(0,0,0,0.34)] transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
        {computedDiscountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-black text-[11px] px-2.5 py-1 rounded-full font-semibold shadow">
            -{computedDiscountPercent}%
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-base mb-2 text-white line-clamp-1">{name}</h3>

        {saveAmount > 0 && (
          <div className="text-xs text-center py-1.5 rounded-lg mb-3 text-yellow-300 bg-yellow-500/10 border border-yellow-500/15 font-medium">
            Save Tk {saveAmount}
          </div>
        )}

        <div className="text-center mb-4">
          {safeOldPrice > 0 && (
            <span className="line-through mr-2 text-sm text-gray-500">Tk {safeOldPrice}</span>
          )}
          <span className="font-bold text-xl text-yellow-400">Tk {safePrice}</span>
        </div>

        <button
          onClick={handleViewClick}
          className="bg-black hover:bg-yellow-500 text-white hover:text-black border border-gray-700 hover:border-yellow-500 font-semibold text-sm py-2.5 rounded-xl mt-auto transition-all duration-200 flex items-center justify-center gap-2"
        >
          View Details
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
