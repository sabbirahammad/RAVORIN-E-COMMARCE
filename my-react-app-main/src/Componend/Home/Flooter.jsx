import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

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
    setTimeout(() => {
      setSubscribed(true);
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <footer className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-14 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent opacity-30 pointer-events-none animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Contact */}
          <div className="space-y-5">
            <h1 className="text-3xl font-extrabold text-yellow-400">YourBrand</h1>
            <p className="text-sm">Empowering your style with premium products. Join us!</p>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-yellow-400" />
                <a href="mailto:support@yourbrand.com">support@yourbrand.com</a>
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="text-yellow-400" />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-yellow-400" />
                <span>123 Tech Avenue, SF, CA</span>
              </p>
            </div>
            <div className="flex gap-4 text-yellow-400 text-lg">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <a key={i} href="#" className="hover:text-yellow-300 hover:scale-110 transition-all">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-yellow-400 pb-2">Quick Links</h2>
            <ul className="space-y-3 text-sm">
              {["Home", "Shop", "About Us", "Categories", "Contact"].map((text, i) => (
                <li key={i}>
                  <a
                    href={`/${text.replace(/\s+/g, "").toLowerCase()}`}
                    className="hover:text-yellow-400 transition"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-yellow-400 pb-2">Support</h2>
            <ul className="space-y-3 text-sm">
              {["Help Desk", "Returns", "Order Status", "Payment Options"].map((text, i) => (
                <li key={i}>
                  <a href={`/${text.replace(/\s+/g, "").toLowerCase()}`} className="hover:text-yellow-400 transition">
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-yellow-400 pb-2">Newsletter</h2>
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className={`w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 ${
                    error ? "ring-2 ring-red-500" : ""
                  }`}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-all"
                >
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </form>
            ) : (
              <p className="text-green-400">Thanks for subscribing!</p>
            )}
            <p className="text-xs text-gray-500 mt-2">Get exclusive offers and updates.</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} YourBrand. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#privacy" className="hover:text-yellow-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-yellow-400">Terms</a>
            <a href="#share" className="hover:text-yellow-400">Share</a>
          </div>
        </div>
      </div>

      <style>{`
        .animate-pulse {
          animation: pulse 8s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;

