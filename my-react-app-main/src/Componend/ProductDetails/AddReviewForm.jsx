import React, { useState } from 'react';

const AddReviewForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !rating || !comment) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit({ name, rating, comment, date: new Date().toISOString() });
    setName('');
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-white">Write a Review</h3>

      <div>
        <label className="block text-sm text-gray-300 mb-1">Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-1">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? 'text-yellow-400' : 'text-gray-500'
              } hover:scale-125 transition-transform`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-1">Comment</label>
        <textarea
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
        />
      </div>

      <button
        type="submit"
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded transition"
      >
        Submit Review
      </button>
    </form>
  );
};

export default AddReviewForm;


