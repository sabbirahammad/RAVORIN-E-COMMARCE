import React, { useState } from 'react';
import ImageZoomModal from './ImageZoomModal';

const ProductGallery = ({ images = [] }) => { // Default to empty array if images is not provided
  const [selectedImage, setSelectedImage] = useState(images);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const openZoomModal = (image) => {
    setSelectedImage(image);
    setIsZoomOpen(true);
  };

  // Ensure that images is an array before calling .map
  const validImages = Array.isArray(images) ? images : [images]; // Changed to images

  return (
    <div className="space-y-4">
      {/* Main Preview Image */}
      <div
        className="w-full aspect-square rounded-lg overflow-hidden cursor-zoom-in"
        onClick={() => openZoomModal(selectedImage)}
      >
        <img
          src={selectedImage}
          alt="product"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Thumbnail Images */}
      <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600">
        {validImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`thumb-${index}`}
            className={`h-20 w-20 rounded-md object-cover cursor-pointer border-2 ${
              selectedImage === img ? 'border-yellow-400' : 'border-transparent'
            }`}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>

      {/* Zoom Modal */}
      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={validImages}
        selectedImage={selectedImage}
      />
    </div>
  );
};

export default ProductGallery;










