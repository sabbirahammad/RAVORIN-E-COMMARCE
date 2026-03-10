import React from 'react';

const ShareButtons = ({ product }) => {
  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this product: ${product.name}`;

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Product link copied to clipboard!');
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => handleShare('facebook')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
      >
        Facebook
      </button>
      <button
        onClick={() => handleShare('twitter')}
        className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded text-sm"
      >
        Twitter
      </button>
      <button
        onClick={() => handleShare('whatsapp')}
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
      >
        WhatsApp
      </button>
      <button
        onClick={() => handleShare('copy')}
        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
      >
        Copy Link
      </button>
    </div>
  );
};

export default ShareButtons;


