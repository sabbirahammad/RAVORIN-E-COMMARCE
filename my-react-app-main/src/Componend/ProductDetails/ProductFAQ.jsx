import React, { useState } from 'react';

const faqData = [
  {
    question: "What is the fabric material?",
    answer: "The t-shirt is made from 100% premium cotton which is breathable, soft, and durable.",
  },
  {
    question: "Is it machine washable?",
    answer: "Yes, you can machine wash it with cold water. Avoid bleach and tumble drying for longevity.",
  },
  {
    question: "Does the color fade after washing?",
    answer: "No, the fabric is colorfast and retains its color after multiple washes.",
  },
  {
    question: "How do I choose the right size?",
    answer: "Use the size chart linked above. For a snug fit, choose your exact size. For a looser fit, size up.",
  },
];

const ProductFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-[#1e1e1e] text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-yellow-400">📋 Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border border-gray-700 rounded-md">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-4 py-3 focus:outline-none flex justify-between items-center"
            >
              <span>{faq.question}</span>
              <span className="text-yellow-400">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="px-4 pb-3 text-gray-300">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFAQ;

