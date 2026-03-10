import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsLoading(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
   <footer className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-14 px-4 sm:px-8 md:px-12 overflow-hidden">
  {/* Background Parallax Layer */}
  <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent opacity-30 pointer-events-none animate-pulse" />

  <div className="relative max-w-7xl mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-8">
      {/* Brand */}
      <div className="space-y-4 sm:text-left text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 tracking-tight">Ravorin</h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          Empowering your style and lifestyle with premium products.
        </p>
        <div className="space-y-2 text-sm">
          <p className="flex justify-center sm:justify-start items-center gap-2">
            <FaEnvelope className="text-yellow-400" />
            <a href="mailto:support@Ravorin.com" className="hover:text-yellow-300 transition">
              support@Ravorin.com
            </a>
          </p>
          <p className="flex justify-center sm:justify-start items-center gap-2">
            <FaPhone className="text-yellow-400" />
            <a href="tel:+1234567890" className="hover:text-yellow-300 transition">
              +1 (234) 567-890
            </a>
          </p>
          <p className="flex justify-center sm:justify-start items-center gap-2">
            <FaMapMarkerAlt className="text-yellow-400" />
            <span>123 Tech Avenue, San Francisco</span>
          </p>
        </div>
        <div className="flex justify-center sm:justify-start gap-4 mt-4 text-yellow-400 text-lg">
          <a href="#" className="hover:text-yellow-300 hover:scale-110 transition-all duration-300"><FaFacebookF /></a>
          <a href="#" className="hover:text-yellow-300 hover:scale-110 transition-all duration-300"><FaTwitter /></a>
          <a href="#" className="hover:text-yellow-300 hover:scale-110 transition-all duration-300"><FaInstagram /></a>
          <a href="#" className="hover:text-yellow-300 hover:scale-110 transition-all duration-300"><FaLinkedinIn /></a>
        </div>
      </div>

      {/* Links & Support */}
      <div className="sm:text-left text-center">
        <h2 className="text-lg font-semibold text-white mb-4 border-b-2 border-yellow-400 inline-block">Quick Links</h2>
        <ul className="space-y-2 text-sm">
          {["Home", "Shop", "About Us", "Blog", "Contact"].map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase().replace(/\s+/g, "")}`} className="text-gray-300 hover:text-yellow-400 transition">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="sm:text-left text-center">
        <h2 className="text-lg font-semibold text-white mb-4 border-b-2 border-yellow-400 inline-block">Support</h2>
        <ul className="space-y-2 text-sm">
          {["FAQ", "Help Desk", "Returns", "Order Status", "Payment Options"].map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase().replace(/\s+/g, "")}`} className="text-gray-300 hover:text-yellow-400 transition">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter */}
      <div className="sm:text-left text-center">
        <h2 className="text-lg font-semibold text-white mb-4 border-b-2 border-yellow-400 inline-block">Newsletter</h2>
        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="flex flex-col items-center sm:items-start space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className={`w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${error ? "ring-2 ring-red-500" : ""}`}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              className="bg-yellow-400 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-500 transition-all disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        ) : (
          <p className="text-green-400 font-semibold flex items-center gap-2 justify-center sm:justify-start">
            ✔ Thank you for subscribing!
          </p>
        )}
        <p className="mt-4 text-sm text-gray-500 leading-relaxed">
          Stay ahead with exclusive offers & updates.
        </p>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="mt-10 pt-6 border-t border-gray-700 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
      <p>© {new Date().getFullYear()} Ravorin. All rights reserved.</p>
      <div className="flex gap-4 flex-wrap justify-center sm:justify-end">
        <a href="#privacy" className="hover:text-yellow-400 transition">Privacy Policy</a>
        <a href="#terms" className="hover:text-yellow-400 transition">Terms of Service</a>
        <a href="#" className="hover:text-yellow-400 transition">Share on Twitter</a>
      </div>
    </div>
  </div>

  {/* Pulse Animation */}
  <style>
    {`
      .animate-pulse {
        animation: pulse 6s infinite ease-in-out;
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.5; }
      }
    `}
  </style>
</footer>

  );
};

export default Footer;
