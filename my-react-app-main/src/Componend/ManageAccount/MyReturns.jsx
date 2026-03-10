import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const res = await axios.get('https://apii.ravorin.com/api/returns'); // 🔁 Backend endpoint
        setReturns(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load returns. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 bg-[#121318] min-h-screen text-[10px] sm:text-sm text-white max-w-4xl mx-auto">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">🧾 My Returns</h2>
        <div className="flex justify-center items-center h-48 sm:h-64">
          <div className="animate-pulse text-gray-400">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-orange-500 border-solid rounded-full animate-spin mb-2"></div>
            <p className="text-[10px] sm:text-sm">Loading returns...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 bg-[#121318] min-h-screen text-[10px] sm:text-sm text-white max-w-4xl mx-auto">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">🧾 My Returns</h2>
        <div className="text-center py-8 sm:py-16">
          <p className="text-red-400 text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-[#121318] min-h-screen text-[10px] sm:text-sm text-white max-w-4xl mx-auto">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">🧾 My Returns</h2>

      {returns.length === 0 ? (
        <div className="text-center py-8 sm:py-16 lg:py-24">
          <p className="text-gray-400 text-sm sm:text-base mb-4">No returns found.</p>
          <Link
            to="/products"
            className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-4 sm:px-6 py-2 rounded text-[10px] sm:text-sm font-semibold transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {returns.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-[#181a21] border border-[#2b2d35] p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover bg-white p-1 self-center sm:self-auto"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-gray-400 text-[10px] sm:text-sm">Return Date: {item.returnDate}</p>
                <p className="text-gray-400 text-[10px] sm:text-sm">Reason: {item.reason}</p>
              </div>
              <span
                className={`text-[9px] sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full self-center sm:self-auto ${
                  item.status === 'Refunded'
                    ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                    : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReturns;


