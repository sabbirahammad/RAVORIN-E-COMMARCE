import React from 'react';
import { useProduct } from '../../Context/UseContext';

const FavoritesPage = () => {
  const { favorites = [] } = useProduct();

  return (
    <div className="p-4 text-white min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">Your Favorites</h2>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-400">No favorite items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-screen-xl w-full justify-items-center">
          {favorites.map((product) => (
            <div key={product.id} className="bg-[#181a21] p-4 rounded-lg w-60 shadow hover:shadow-lg transition">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover mb-3 rounded-md"
              />
              <h3 className="text-sm font-semibold text-center">{product.name}</h3>
              <p className="text-orange-400 font-bold text-center">৳ {product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;



