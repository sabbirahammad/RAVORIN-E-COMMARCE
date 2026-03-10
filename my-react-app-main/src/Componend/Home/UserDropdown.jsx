import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dummy auth user
  const user = {
    isLoggedIn: true,
    name: 'Sabbir',
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Close on scroll
  useEffect(() => {
    const handleScroll = () => {
      setOpen(false);
    };

    if (open) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [open]);

  const handleMenuClick = () => {
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#2a2a2a] transition text-white"
      >
        <span>MENU</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1e1e1e] text-white rounded-md shadow-lg border border-[#333] z-50">
          <ul className="py-2 text-sm">
            {user.isLoggedIn ? (
              <>
                <li>
                  <Link to="/orders" onClick={handleMenuClick} className="block px-4 py-2 hover:bg-[#2d2d2d]">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link to="/messages" onClick={handleMenuClick} className="block px-4 py-2 hover:bg-[#2d2d2d]">
                    Messages
                  </Link>
                </li>
                <li>
                  <Link to="/cartpayment" onClick={handleMenuClick} className="block px-4 py-2 hover:bg-[#2d2d2d]">
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" onClick={handleMenuClick} className="block px-4 py-2 hover:bg-[#2d2d2d]">
                    Favorites
                  </Link>
                </li>
                <li>
                  <Link to="/*" onClick={handleMenuClick} className="block px-4 py-2 hover:bg-[#2d2d2d]">
                    Account
                  </Link>
                </li>
                <hr className="border-gray-700 my-1" />
                <li>
                  <button onClick={handleMenuClick} className="w-full text-left px-4 py-2 hover:bg-[#2d2d2d]">
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={handleMenuClick} className="block px-4 py-2 hover:bg-[#2d2d2d]">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={handleMenuClick} className="block px-4 py-2 hover:bg-[#2d2d2d]">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" onClick={handleMenuClick} className="block px-4 py-2 hover:bg-[#2d2d2d]">
                    Track Order
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;




