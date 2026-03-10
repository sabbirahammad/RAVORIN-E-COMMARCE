import React, { useState } from 'react';

const ProductTabs = ({ description, specification }) => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="mt-8 md:col-span-2">
      {/* Tab Buttons */}
      <div className="flex gap-6 border-b border-gray-700 mb-4">
        <button
          className={`pb-2 font-medium ${
            activeTab === 'description'
              ? 'border-b-2 border-yellow-500 text-yellow-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button
          className={`pb-2 font-medium ${
            activeTab === 'specification'
              ? 'border-b-2 border-yellow-500 text-yellow-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('specification')}
        >
          Specification
        </button>
      </div>

      {/* Tab Content */}
      <div className="text-gray-300 text-sm leading-relaxed">
        {activeTab === 'description' && (
          <p>{description}</p>
        )}

        {activeTab === 'specification' && (
          <ul className="list-disc pl-6 space-y-1">
            {specification.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;


