import React from 'react';

const RatingsSummary = ({ average = 4.3, total = 187, breakdown = [90, 50, 30, 10, 7] }) => {
  const starLabels = [5, 4, 3, 2, 1];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <h2 className="text-2xl font-bold mb-4">⭐ Customer Ratings</h2>

      <div className="flex items-start gap-6">
        {/* Average rating box */}
        <div className="bg-[#1f1f1f] p-6 rounded-lg text-center">
          <div className="text-4xl font-bold text-yellow-400">{average.toFixed(1)}</div>
          <div className="text-gray-400 text-sm mt-1">{total} reviews</div>
        </div>

        {/* Star breakdown */}
        <div className="flex-1 space-y-2">
          {starLabels.map((star, index) => {
            const count = breakdown[index];
            const percent = (count / total) * 100;

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-12 text-sm text-gray-300">{star} star</span>
                <div className="flex-1 bg-gray-700 h-2 rounded overflow-hidden">
                  <div
                    className="bg-yellow-400 h-2"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <span className="w-10 text-sm text-gray-400 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingsSummary;

