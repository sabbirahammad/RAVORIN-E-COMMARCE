import React from 'react';

const sampleReviews = [
  {
    id: 1,
    name: 'Rakib Hossain',
    rating: 5,
    comment: 'Excellent quality t-shirt. Fits perfectly and the color doesn’t fade!',
  },
  {
    id: 2,
    name: 'Sadia Afrin',
    rating: 4,
    comment: 'Good product overall. Would love more color options.',
  },
  {
    id: 3,
    name: 'Tanvir Ahmed',
    rating: 5,
    comment: 'Comfortable and stylish. Great for daily use.',
  },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-1 text-yellow-400 text-sm">
    {Array(5)
      .fill()
      .map((_, i) => (
        <span key={i}>{i < rating ? '★' : '☆'}</span>
      ))}
  </div>
);

const CustomerReviews = () => {
  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 sm:px-8">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Customer Reviews</h2>
      <div className="space-y-6">
        {sampleReviews.map((review) => (
          <div
            key={review.id}
            className="bg-[#1f1f1f] border border-gray-700 p-4 rounded-md shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold text-white">{review.name}</h4>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-gray-400 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;


