import React, { useState } from 'react';

const faqs = [
  {
    question: "How can I track my order?",
    answer: "After placing an order, you'll receive a tracking link via email and in your account dashboard."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 7 days of delivery. Items must be unused and in original packaging."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently we only ship within Bangladesh, but international options are coming soon!"
  },
  {
    question: "How can I contact customer support?",
    answer: "You can email us or use the contact form. Our support team is available 24/7."
  },
  {
    question: "Can I cancel or change my order?",
    answer: "Yes, if the order hasn’t shipped yet. Please contact support as soon as possible."
  }
];

const FaqPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-[#121318] text-white min-h-screen px-6 py-12 md:px-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[#333] rounded-lg p-4 cursor-pointer bg-[#1a1a1a] hover:bg-[#1f1f1f]"
              onClick={() => toggle(index)}
            >
              <h3 className="text-lg font-semibold flex justify-between items-center">
                {faq.question}
                <span>{activeIndex === index ? '−' : '+'}</span>
              </h3>
              {activeIndex === index && (
                <p className="mt-2 text-gray-400 text-sm">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;

