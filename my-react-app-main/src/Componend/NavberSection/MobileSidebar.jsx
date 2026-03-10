import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiShoppingBag, FiInfo, FiUser, FiLogIn, FiLogOut, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MobileSidebar = ({ isDarkMode, isOpen, setIsOpen, isSignedIn, setIsSignedIn }) => {
  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { x: '100%', transition: { duration: 0.3 } },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, type: 'spring', stiffness: 300, damping: 25 },
    }),
  };

  const navLinks = [
    { icon: <FiHome />, text: 'Home', to: '/' },
    { icon: <FiShoppingBag />, text: 'Products', to: '/products' },
    { icon: <FiInfo />, text: 'About', to: '/about' },
    { icon: <FiInfo />, text: 'Help-Center', to: '/help-center' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            className={`fixed top-0 right-0 h-full w-72 p-6 z-50 ${isDarkMode ? 'bg-gray-900/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}`}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center mb-10">
              <Link to="/" className="text-2xl font-extrabold text-gray-700 tracking-tight">
                Alrizvan
              </Link>
              <button onClick={() => setIsOpen(false)}>
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center mb-8 p-4 rounded-lg bg-gray-800/50">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <p className="font-bold text-lg">{isSignedIn ? 'User Name' : 'Guest'}</p>
                <p className="text-sm text-gray-400">{isSignedIn ? 'user.name@example.com' : 'Welcome!'}</p>
              </div>
            </div>

            <nav>
              <ul>
                {navLinks.map((link, i) => (
                  <motion.li key={link.to} variants={navItemVariants} custom={i} initial="hidden" animate="visible">
                    <Link to={link.to} className="flex items-center space-x-4 text-lg font-semibold mb-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                      {link.icon}
                      <span>{link.text}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-gray-700 mt-8 pt-8">
              {isSignedIn ? (
                <motion.div variants={navItemVariants} custom={navLinks.length} initial="hidden" animate="visible">
                  <Link to="/profile" className="flex items-center space-x-4 text-lg font-semibold mb-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <FiUser />
                    <span>My Account</span>
                  </Link>
                </motion.div>
              ) : null}
              <motion.div variants={navItemVariants} custom={navLinks.length + 1} initial="hidden" animate="visible">
                <Link to={isSignedIn ? '#' : '/login'} onClick={() => setIsSignedIn(!isSignedIn)} className="flex items-center space-x-4 text-lg font-semibold p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                  {isSignedIn ? <FiLogOut /> : <FiLogIn />}
                  <span>{isSignedIn ? 'Logout' : 'Login'}</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;

