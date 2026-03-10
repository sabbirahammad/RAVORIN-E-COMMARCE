import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/GoogleAuth';

const resolveProductImage = (product) => {
  const rawImage = Array.isArray(product?.images) ? product.images[0] : product?.images || product?.image;

  if (!rawImage) {
    return '/no-image.svg';
  }

  if (typeof rawImage === 'string' && rawImage.startsWith('http')) {
    return rawImage;
  }

  return `https://apii.ravorin.com${rawImage}`;
};

const MyWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Fetch wishlist data from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('https://apii.ravorin.com/api/v1/user/wishlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Wishlist API response:', response.data);

        if (response.data.success) {
          setWishlist(response.data.wishlist);
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        if (err.response?.status === 401) {
          navigate('/auth');
        } else {
          setError('Failed to load wishlist');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token, navigate]);

  const handleRemove = async (productId) => {
    if (!token) {
      navigate('/auth');
      return;
    }

    try {
      const response = await axios.delete(`https://apii.ravorin.com/api/v1/user/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Remove item from local state
        setWishlist(prev => prev.filter(item => item.product._id !== productId));
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      if (err.response?.status === 401) {
        navigate('/auth');
      } else {
        alert('Failed to remove item from wishlist');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 bg-[#121318] min-h-screen text-[10px] sm:text-sm text-white max-w-4xl mx-auto">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">💖 My Wishlist</h2>
        <div className="flex justify-center items-center h-48 sm:h-64">
          <div className="animate-pulse text-gray-400">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-orange-500 border-solid rounded-full animate-spin mb-2"></div>
            <p className="text-[10px] sm:text-sm">Loading wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-[#121318] min-h-screen text-[10px] sm:text-sm text-white max-w-4xl mx-auto">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">💖 My Wishlist</h2>

      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded p-3 sm:p-4 mb-3 sm:mb-4">
          <p className="text-red-400 text-[10px] sm:text-sm">{error}</p>
        </div>
      )}

      {wishlist.length === 0 ? (
        <div className="text-center text-gray-400 py-12 sm:py-16 lg:py-24">
          <p className="text-sm sm:text-base">Your wishlist is empty. Start adding some products!</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-[#181a21] border border-[#2b2d35] rounded-lg mb-3 sm:mb-4 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 hover:shadow-lg transition"
            >
              <img
                src={resolveProductImage(item.product)}
                alt={item.product?.name || 'Product'}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded object-cover bg-white p-1 self-center sm:self-auto"
                onError={(e) => {
                  e.target.src = '/no-image.svg';
                }}
              />
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <Link
                  to={`/product/${item.product?._id || item.product?.id}`}
                  className="text-cyan-400 hover:underline font-semibold text-[10px] sm:text-sm lg:text-base block"
                >
                  {item.product?.name || 'Unknown Product'}
                </Link>
                <p className="text-gray-300 text-[10px] sm:text-sm">৳ {item.product?.price || 'N/A'}</p>
              </div>

              <div className="flex justify-center sm:justify-end sm:block">
                <button
                  onClick={() => handleRemove(item.product._id)}
                  className="text-red-500 hover:text-red-400 text-[9px] sm:text-xs lg:text-sm px-2 py-1 rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;

