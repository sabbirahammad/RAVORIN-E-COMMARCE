import React from 'react';
import { useProduct } from '../../Context/UseContext';
import { useParams } from 'react-router-dom';
import image from '../../assets/i.jpg'

const BrandBanner = () => {
  const {
    subcategories = [],
    allcategories = [],
    categories = [],
    categoryBanners = {},
    bannerImage
  } = useProduct();

  const { slug } = useParams();

  // Format "men-fashion" -> "Men Fashion"
  const formattedCategory =
    slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Category';

  const formatKey = (str) => str?.toLowerCase().replace(/\s+/g, '');

  const matchCategory = (target) =>
    formatKey(target) === formatKey(formattedCategory);

  // Step 1: Check categories
  let bannerImageUrl = '';
  const catMatch = categories.find((cat) => matchCategory(cat.title));
  if (catMatch?.image) {
    bannerImageUrl = catMatch.image;
  }

  // Step 2: Check in allcategories (match title or any item)
  if (!bannerImageUrl) {
    for (const cat of allcategories) {
      const matchTitle = matchCategory(cat.title);
      const matchItem = cat.items?.some((item) => matchCategory(item));
      if ((matchTitle || matchItem) && cat.image) {
        bannerImageUrl = cat.image;
        break;
      }
    }
  }

  // Step 3: Check in categories (already done in Step 1)
  if (!bannerImageUrl) {
    // This is already handled above, keeping for fallback
    bannerImageUrl = image;
  }

  // Step 4: Check categoryBanners map
  if (!bannerImageUrl && categoryBanners?.[formattedCategory]) {
    bannerImageUrl = categoryBanners[formattedCategory];
  }

  // Step 5: fallback
  if (!bannerImageUrl) {
    bannerImageUrl = image; // Fallback to a default image
  }

  return (
    <div className="relative w-full bg-[#121318] flex justify-center py-6">
      <img
        src={bannerImageUrl}
        alt={`${formattedCategory} Banner`}
        className="w-[1200px] h-[430px] object-cover mt-20 sm:mt-10 rounded-lg"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4">
        <h2
          className="text-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold animate-bounce-in text-center leading-tight"
          style={{
            fontFamily: "'Great Vibes', 'Roboto', cursive",
            textShadow: '0 0 12px rgba(0, 0, 0, 0.9), 0 0 24px rgba(0, 0, 0, 0.6)',
            letterSpacing: '0.06em',
          }}
        >
          Discover the Best of {formattedCategory}
        </h2>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Roboto:wght@700&display=swap');
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.8); }
          60% { opacity: 1; transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounceIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BrandBanner;


