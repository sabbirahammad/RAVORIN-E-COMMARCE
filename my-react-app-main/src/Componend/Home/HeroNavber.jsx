import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import image from '../../assets/i.jpg';

const HeroBanner = () => {
  const [heroImage, setHeroImage] = useState(image); // Default fallback image
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('HeroBanner component rendered');

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, delay: 0.5, ease: 'easeOut' },
    },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  const MotionLink = motion(Link);

  // Fetch hero image as base64 data to avoid CORS issues
  const fetchHeroImage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching hero navbar image data from:', 'https://apii.ravorin.com/api/v1/hero-navbar/image-data');

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const response = await fetch('https://apii.ravorin.com/api/v1/hero-navbar/image-data', {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        clearTimeout(timeoutId);
        console.log('API response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Hero navbar image data received:', data);

          if (data.success && data.image) {
            // Use the base64 image data directly
            console.log('Using base64 image data');
            setHeroImage(data.image);
          } else {
            console.warn('No valid image data found in API response, using default');
            setHeroImage(image);
          }
        } else {
          console.warn(`API request failed with status ${response.status}, using default image`);
          setHeroImage(image);
        }
      } catch (fetchError) {
        console.error('Fetch error details:', {
          name: fetchError.name,
          message: fetchError.message,
          stack: fetchError.stack
        });
        setHeroImage(image);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn('Hero image fetch request timed out');
      } else {
        console.error('Error fetching hero image:', err);
      }
      setError(err.message || 'Failed to load hero image');
      setHeroImage(image);

    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch hero image on component mount only
  useEffect(() => {
    fetchHeroImage();
  }, [fetchHeroImage]);

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] md:h-[640px] lg:h-[700px] bg-gray-100 overflow-hidden">
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-gray-600">Loading...</div>
        </div>
      )}

      {/* Background Image */}
      <motion.img
        src={heroImage}
        alt="Hero Banner"
        className="object-cover w-full h-full"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        onError={(e) => {
          console.error('Hero image failed to load:', {
            currentSrc: e.target.src,
            naturalWidth: e.target.naturalWidth,
            naturalHeight: e.target.naturalHeight
          });
          setError('Failed to load hero image');

          // Prevent infinite loop by checking if we're already using the fallback
          if (e.target.src !== image) {
            console.log('Switching to default fallback image');
            e.target.src = image;
          } else {
            console.log('Default image also failed, using no-image.svg');
            e.target.src = '/no-image.svg';
          }
        }}
        onLoad={() => {
          console.log('Hero image loaded successfully:', {
            src: heroImage,
            isDefault: heroImage === image
          });
          setError(null); // Clear any previous errors
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-lg leading-tight sm:leading-tight md:leading-snug"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          PREMIUM CLOTHING. <br className="hidden sm:block" />
          AUTHENTIC STYLE.
        </motion.h1>

        <motion.p
          className="text-white text-sm sm:text-base md:text-xl lg:text-2xl mt-4 font-light tracking-wide drop-shadow-md"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          Discover the Finest Collection Tailored for You
        </motion.p>

        <MotionLink
          to="/products"
          className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-yellow-500 text-white text-base sm:text-lg font-semibold rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
        >
          Shop Now
        </MotionLink>
      </div>

      {/* Bottom gradient for smooth edge */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
};

export default HeroBanner;