
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const NavMenu = ({ isDarkMode, activeDropdown, setActiveDropdown }) => {
  const [mobileOpen, setMobileOpen] = useState(null);

  const menuItems = [
    {
      key: 'allcategories',
      label: 'All categories',
      content: [
        { title: 'Mens', items: ['T-shirts', 'Shirts'] },
        { title: 'Womens', items: ['Dresses', 'Tops'] },
        { title: 'Kids', items: ['Clothing', 'Accessories'] },
        { title: 'Footwear', items: ['Sneakers', 'Sandals'] },
        { title: 'Accessories', items: ['Watches', 'Bags'] },
        { title: 'Sports', items: ['Gear', 'Equipment'] },
        { title: 'Electronics', items: ['Phones', 'Laptops'] },
      ],
    },
    {
      key: 'featured',
      label: 'Featured selections',
      content: [
        { icon: '⚡', text: 'Top ranking' },
        { icon: '🧲', text: 'New arrivals' },
        { icon: '✅', text: 'Top deals' },
      ],
    },
    {
      key: 'help',
      label: 'Help Center',
      content: [
        { icon: '📦', text: 'Sample Center' },
        { icon: '💼', text: 'Online Trade Show' },
        { icon: '💡', text: 'Tips' },
        { icon: '🔴', text: 'LIVE' },
      ],
    },
    {
      key: 'seller',
      label: 'Become a Seller',
      content: [
        { icon: '🛒', text: 'Start Selling' },
        { icon: '📈', text: 'Grow Your Business' },
        { icon: '🤝', text: 'Join Trade' },
      ],
    },
  ];

  return (
    <>
      {/* Desktop version remains untouched */}
      <ul
        className={`hidden md:flex items-center space-x-8 text-sm font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        {menuItems.map(({ key, label, content }) => (
          <li
            key={key}
            className="relative"
            onMouseEnter={() => setActiveDropdown(key)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a
              href="#"
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              {label}
            </a>
            <AnimatePresence>
              {activeDropdown === key && (
                <motion.div
                  className={`absolute left-0 mt-2 rounded-md shadow-xl z-50 p-4 w-auto ${
                    isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex space-x-8">
                    {content.map((group) => (
                      <div key={group.title || group.text}>
                        {group.title && (
                          <h4
                            className={`text-xs mb-2 font-medium ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                          >
                            {group.title}
                          </h4>
                        )}
                        {(group.items || [group]).map((item) => (
                          <a
                            key={item.text || item}
                            href="#"
                            className={`block px-3 py-1 text-sm rounded transition-colors ${
                              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                            }`}
                          >
                            {item.icon && <span className="mr-2">{item.icon}</span>}
                            {item.text || item}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>

      {/* Mobile version with grid and icons */}
      <div className="md:hidden text-sm font-semibold">
        {menuItems.map(({ key, label, content }) => (
          <div key={key} className="border-b border-gray-700">
            <button
              onClick={() => setMobileOpen(mobileOpen === key ? null : key)}
              className="w-full flex justify-between items-center px-4 py-3 text-left text-white"
            >
              {label}
              <FiChevronDown
                className={`transform transition-transform ${
                  mobileOpen === key ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {mobileOpen === key && (
                <motion.div
                  className="bg-gray-800 text-white px-4 pb-4"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {content.map((group) => (
                      <div key={group.title || group.text}>
                        {group.title && (
                          <h4 className="text-xs font-medium text-gray-400 mb-1">
                            {group.title}
                          </h4>
                        )}
                        {(group.items || [group]).map((item) => (
                          <a
                            key={item.text || item}
                            href="#"
                            className="block py-1 text-xs text-white hover:text-yellow-400"
                          >
                            {item.icon && <span className="mr-1">{item.icon}</span>}
                            {item.text || item}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </>
  );
};

export default NavMenu;

