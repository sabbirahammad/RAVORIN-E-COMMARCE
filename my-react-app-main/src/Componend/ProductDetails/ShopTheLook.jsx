import React from 'react';
import { useProduct } from '../../Context/UseContext'; // Adjust the path if needed

const ShopTheLook = () => {
  const { products, cartItems, setCartItems } = useProduct();

  // Example: Select 3 products to "Shop the Look"
  const lookItems = products.slice(0, 3); // You can customize this logic

  const handleAddToCart = (product) => {
    const isAlreadyInCart = cartItems.find((item) => item.id === product.id);
    if (isAlreadyInCart) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...product, qty: 1 }]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 p-6 bg-[#1e1e1e] text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-yellow-400">🛍️ Shop The Look</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {lookItems.map((item) => (
          <div key={item.id} className="bg-[#2a2a2a] p-4 rounded-lg hover:shadow-lg transition">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-yellow-400 font-bold text-lg">৳{item.price}</p>
            <button
              className="mt-2 w-full bg-yellow-500 text-black py-1.5 rounded hover:bg-yellow-600 font-semibold"
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopTheLook;


