import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/GoogleAuth';

const CartPage = () => {
  const [products, setProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [shippingFee] = useState(150);
  const {token}=useAuth();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get('https://apii.ravorin.com/api/v1/cart',
           {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Token এখানে পাঠানো হচ্ছে
        },
      }
        );

        // Ensure 'cart.items' is the correct path in the response
        if (response.data && response.data.cart && response.data.cart.items) {
          setProducts(response.data.cart.items); // Update the state with the correct data
        } else {
          console.error("Invalid cart data structure:", response.data);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
    fetchCartData();
  }, []);

  // Handle "Select All" Change
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        selected: !selectAll,
      }))
    );
  };

  // Handle Product Selection
  const handleSelectProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, selected: !product.selected } : product
      )
    );
  };

  // Handle Promo Code Apply
  const handlePromoCodeApply = async () => {
    try {
      const response = await axios.post('/api/apply-promo', { promoCode });
      if (response.data.success) {
        setVoucherApplied(true);
      } else {
        alert('Invalid Promo Code');
      }
    } catch (error) {
      alert('Error applying promo code');
    }
  };

  // Calculate total price
  const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0) + shippingFee;

  // Handle Deletion of Selected Products
  const handleDeleteSelected = async () => {
    const selectedProductIds = products.filter((product) => product.selected).map((product) => product.id);
    try {
      const response = await axios.post('/api/cart/delete', { productIds: selectedProductIds });
      if (response.data.success) {
        setProducts((prevProducts) => prevProducts.filter((product) => !product.selected));
      }
    } catch (error) {
      console.error('Error deleting selected products:', error);
    }
  };

  // Check if any product is selected
  const isAnyProductSelected = products.some((product) => product.selected);

  return (
    <div className="min-h-screen bg-[#121318] text-white">
      <div className="flex flex-col lg:flex-row justify-between p-6">
        {/* Left Section - Cart Item */}
        <div className="flex-1 space-y-6">
          {/* Product List */}
          <div className="bg-[#1a1f24] rounded-lg p-6">
            {/* Select All and Delete */}
            <div className="flex justify-between mb-4">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="bg-[#2e3338] rounded-md"
                />
                <span className="text-lg font-medium">SELECT ALL ({products.length} item(s))</span>
              </div>
              <button
                onClick={handleDeleteSelected}
                className="text-red-500 hover:text-red-400 font-medium"
              >
                DELETE
              </button>
            </div>

            Product Items
            {products.length === 0 ? (
              <p className="text-gray-400 text-center">Your cart is empty</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={product.selected}
                      onChange={() => handleSelectProduct(product.id)}
                      className="bg-[#2e3338] rounded-md"
                    />
                    <img
                      src={product.product.images} // Accessing product.images which contains the image URL
                      alt={product.product.name}
                      className="w-20 h-20 object-contain rounded-md"
                    />
                    <div>
                      <h4 className="text-lg font-semibold">{product.product.name}</h4>
                      <p className="text-gray-400 text-sm">Color Family: Green</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium">৳ {product.price}</div>
                    <div className="text-sm line-through text-gray-400"> {product.originalPrice}</div>
                    <div className="text-red-400 text-sm"></div>
                  </div>
                  <div className="text-gray-400">
                    <span className="text-sm">Qty: </span>
                    <span>{product.quantity}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="w-full lg:w-80 space-y-6 mt-6 lg:mt-0">
          {/* Promotion Code */}
          <div>
            <h3 className="text-lg font-medium mb-3">Promotion</h3>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter Store/ Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handlePromoCodeApply}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-r-md transition-colors"
              >
                APPLY
              </button>
            </div>
            {voucherApplied && (
              <div className="mt-2 text-green-400 text-sm">Voucher Applied! 10% off</div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Items Total ({products.length} Items)</span>
                <span>৳ {total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Shipping Fee</span>
                <span>৳ {shippingFee}</span>
              </div>
              <hr className="border-gray-700" />
              <div className="flex justify-between text-lg font-medium">
                <span>Total:</span>
                <span>৳ {total}</span>
              </div>
              <p className="text-gray-400 text-xs">VAT included, where applicable</p>
            </div>

            {/* Proceed to Checkout Button */}
            <Link to="/cartpayment">
              <button
                disabled={!isAnyProductSelected}
                className={`w-full mt-6 ${!isAnyProductSelected ? 'bg-gray-400' : 'bg-gray-500 hover:bg-gray-700'} text-white font-medium py-3 rounded-lg transition-colors`}
              >
                Proceed to Checkout ({products.length})
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;





