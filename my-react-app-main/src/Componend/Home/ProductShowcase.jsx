import React from 'react';
import { useProduct } from '../../Context/UseContext';
import { Link } from 'react-router-dom';

const AllProductsPage = () => {
  const { products } = useProduct();

  return (
    <div className="py-8 px-4 sm:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-black mb-6">🛍️ All Collection</h2>

        {products.length === 0 ? (
          <p className="text-gray-400">No products available right now.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.slice(0, 25).map((item) => (
              <div
                key={item.id}
                className="rounded overflow-hidden shadow hover:shadow-lg transition bg-[#1a1a1a]"
              >
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.images?.[0] || '/no-image.jpg'}
                    alt={item.name}
                    className="w-full h-[200px] object-cover cursor-pointer"
                  />
                </Link>

                <div className="p-3">
                  <h3 className="text-sm font-medium text-white mb-1 truncate">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-400 font-bold text-sm">৳{item.price}</span>
                    {item.oldPrice && (
                      <span className="line-through text-gray-500 text-xs">৳{item.oldPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProductsPage;





