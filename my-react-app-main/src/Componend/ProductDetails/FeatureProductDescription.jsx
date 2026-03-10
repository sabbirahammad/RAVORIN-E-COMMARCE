import React from 'react';

const FeatureProductDescription = () => {
  return (
    <div className="max-w-6xl mx-auto text-gray-600 p-8 rounded-xl shadow-lg mt-12">
      <h2 className="text-sm sm:text-sm font-bold text-gray-400 mb-4">Why You'll Love This Product</h2>

      <p className="mb-4 text-[10px] sm:text-sm leading-relaxed">
        Crafted with care and precision, our premium apparel is more than just clothing — it's a statement of style and comfort. 
        Whether you're heading out with friends, attending a casual event, or just relaxing at home, this product offers unmatched versatility.
      </p>

      <ul className="list-disc list-inside text-[10px] sm:text-sm space-y-2">
        <li><span className="text-yellow-400 font-semibold">Soft & Breathable:</span> Made from 100% cotton for all-day comfort.</li>
        <li><span className="text-yellow-400 font-semibold">Modern Fit:</span> Tailored to give a sleek and confident look.</li>
        <li><span className="text-yellow-400 font-semibold">Durable Quality:</span> Stitched to last through multiple washes.</li>
        <li><span className="text-yellow-400 font-semibold">Locally Made:</span> Proudly crafted in Bangladesh.</li>
      </ul>
    </div>
  );
};

export default FeatureProductDescription;

