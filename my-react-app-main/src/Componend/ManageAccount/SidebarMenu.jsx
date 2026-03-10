import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProduct } from '../../Context/UseContext';

const SidebarMenu = () => {
  const location = useLocation();
  const { user } = useProduct();

  const navLinks = [
    { path: '/profilecart', label: 'My Profile' },
    { path: '/addresses', label: 'Address Book' },
    { path: '/payments', label: 'My Payment Options' },
  ];

  const orderLinks = [
    { path: '/returns', label: 'My Returns' },
    { path: '/cancellations', label: 'My Cancellations' },
    { path: '/orders', label: 'All Orders' },
  ];

  const reviewLinks = [{ path: '/reviews', label: 'View Reviews' }];
  const wishlistLinks = [{ path: '/wishlist', label: 'Wishlist & Stores' }];

  return (
    <div className="w-full sm:w-64 lg:w-80 p-3 sm:p-4 lg:p-6 text-[12px] sm:text-[13px] text-white bg-[#0d0f1c] min-h-screen">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="pb-2 border-b border-gray-700">
          <p className="text-gray-300 mb-1 text-sm sm:text-base">Hello, {user?.name || 'User'}</p>
          <span className="bg-green-500 text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block">
            ✅ Verified Account
          </span>
        </div>

        {/* Manage My Account */}
        <div>
          <p className="text-blue-400 font-semibold mb-2 text-sm">Manage My Account</p>
          <ul className="space-y-1 sm:space-y-2">
            {navLinks.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`block py-1 px-2 rounded transition-colors hover:text-yellow-400 hover:bg-gray-800 ${
                    location.pathname === path ? 'text-yellow-400 font-semibold bg-gray-800' : ''
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* My Orders */}
        <div>
          <h3 className="text-white font-semibold mb-2 text-sm">My Orders</h3>
          <ul className="space-y-1 sm:space-y-2">
            {orderLinks.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`block py-1 px-2 rounded transition-colors hover:text-yellow-400 hover:bg-gray-800 ${
                    location.pathname === path ? 'text-yellow-400 font-semibold bg-gray-800' : ''
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* My Reviews */}
        <div>
          <h3 className="text-white font-semibold mb-2 text-sm">My Reviews</h3>
          <ul className="space-y-1 sm:space-y-2">
            {reviewLinks.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`block py-1 px-2 rounded transition-colors hover:text-yellow-400 hover:bg-gray-800 ${
                    location.pathname === path ? 'text-yellow-400 font-semibold bg-gray-800' : ''
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Wishlist */}
        <div>
          <h3 className="text-white font-semibold mb-2 text-sm">My Wishlist</h3>
          <ul className="space-y-1 sm:space-y-2">
            {wishlistLinks.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`block py-1 px-2 rounded transition-colors hover:text-yellow-400 hover:bg-gray-800 ${
                    location.pathname === path ? 'text-yellow-400 font-semibold bg-gray-800' : ''
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;









