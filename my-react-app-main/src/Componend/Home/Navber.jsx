// components/Navbar.jsx
const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm px-4 py-3 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">
          FABRILIFE
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          <li><a href="#">Men</a></li>
          <li><a href="#">Women</a></li>
          <li><a href="#">Custom Print</a></li>
          <li><a href="#">Premium</a></li>
          <li><a href="#">Combo</a></li>
        </ul>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="border px-2 py-1 rounded text-sm hidden md:block"
          />
          <button className="text-gray-600 hover:text-black">🔍</button>
          <button className="text-gray-600 hover:text-black">🛒</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

