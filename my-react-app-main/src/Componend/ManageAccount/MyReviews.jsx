import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyReviews = () => {
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews from backend API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/api/reviews/my'); // তোমার API endpoint দিন
        console.log('Fetched Data:', res.data);

        // Check if data is array or wrapped inside object
        if (Array.isArray(res.data)) {
          setMyReviews(res.data);
        } else if (Array.isArray(res.data.reviews)) {
          setMyReviews(res.data.reviews);
        } else {
          setMyReviews([]);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        setMyReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Delete review handler (send delete request to backend)
  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm('Are you sure you want to delete this review?');
    if (!confirmed) return;

    try {
      await axios.delete(`/api/reviews/${reviewId}`); // তোমার delete API
      setMyReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Could not delete the review. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 text-white text-center bg-[#121318] min-h-screen">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">📝 My Reviews</h2>
        <div className="flex justify-center items-center h-48 sm:h-64">
          <div className="animate-pulse text-gray-400">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-orange-500 border-solid rounded-full animate-spin mb-2"></div>
            <p className="text-[10px] sm:text-sm">Loading your reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-[#121318] min-h-screen text-[10px] sm:text-sm text-white max-w-4xl mx-auto">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6">📝 My Reviews</h2>

      {myReviews.length === 0 ? (
        <div className="text-center text-gray-400 py-12 sm:py-16 lg:py-24">
          <p className="text-sm sm:text-base">You haven't reviewed any product yet.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {myReviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#181a21] border border-[#2b2d35] rounded-lg mb-3 sm:mb-4 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 transition hover:shadow-lg"
            >
              {/* Product Image */}
              <img
                src={review.productImage}
                alt={review.productName}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded object-cover bg-white p-1 self-center sm:self-auto"
              />

              {/* Info */}
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <Link
                  to={`/product/${review.productId}`}
                  className="text-cyan-400 hover:underline font-semibold text-[10px] sm:text-sm lg:text-base block"
                >
                  {review.productName}
                </Link>
                <p className="text-gray-300 text-[10px] sm:text-sm">{review.message}</p>
                <p className="text-gray-500 text-[9px] sm:text-xs mt-1">Reviewed on {review.date}</p>
              </div>

              {/* Delete */}
              <div className="flex justify-center sm:justify-end sm:block">
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-500 hover:text-red-400 text-[9px] sm:text-xs lg:text-sm px-2 py-1 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;

