import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap } from 'react-icons/fi';

const fallbackHeroImages = [
  {
    src: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    alt: 'Dark denim pocket close-up',
  },
  {
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    alt: 'Person wearing denim jeans',
  },
  {
    src: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80',
    alt: 'Stacked denim clothes',
  },
];

const HeroSection = () => {
  const [heroImages, setHeroImages] = useState(fallbackHeroImages);

  useEffect(() => {
    const fetchHeroImages = async () => {
      const endpoints = [
        'https://apii.ravorin.com/api/v1/hero-images',
        'https://apii.ravorin.com/api/v1/hero-navbar',
      ];

      for (const url of endpoints) {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            if (res.status === 404) continue;
            break;
          }

          const data = await res.json();
          console.log(`Hero API response from ${url}:`, data);
          if (data?.success && Array.isArray(data?.heroImages?.images) && data.heroImages.images.length > 0) {
            const uploaded = data.heroImages.images.slice(0, 3).map((src, index) => ({
              src,
              alt: `Hero image ${index + 1}`,
            }));
            const mapped = [...uploaded];
            while (mapped.length < 3) {
              mapped.push(fallbackHeroImages[mapped.length]);
            }
            setHeroImages(mapped);
            return;
          }
        } catch (error) {
          console.error('Failed to fetch hero images:', url, error);
        }
      }
    };

    fetchHeroImages();
  }, []);

  return (
    <section className="w-full pb-6 pt-6 sm:pb-8 sm:pt-10">
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[26px] border border-gray-800 bg-gradient-to-r from-[#161616] via-[#1d1d1d] to-[#242424] text-white shadow-[0_20px_55px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 left-10 h-52 w-52 rounded-full bg-yellow-500/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
          </div>
          <div className="relative flex flex-col items-center gap-8 px-5 py-8 sm:px-8 sm:py-10 md:flex-row md:items-center md:gap-12 md:px-8 md:py-12 lg:px-12">
            <div className="flex flex-1 flex-col justify-center space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 self-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-300 backdrop-blur-md md:self-start">
                <span className="p-1.5 rounded-full bg-yellow-500/10 grid place-items-center">
                  <FiZap className="text-yellow-400" />
                </span>
                #Big Fashion Sale
              </div>

              <div className="space-y-3 text-center md:text-left">
                <h1 className="text-[2.2rem] font-black leading-[1.02] drop-shadow-[0_8px_18px_rgba(0,0,0,0.16)] sm:text-5xl lg:text-6xl">
                  Limited Time
                  <br />
                  <span className="text-yellow-400">50% OFF!</span>
                </h1>
                <p className="mx-auto max-w-sm text-sm text-gray-300 sm:text-xl md:mx-0 md:max-w-none">
                  Redefine Your Everyday Style
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 md:justify-start">
                <Link
                  to="/products"
                  className="inline-flex min-w-[168px] items-center justify-center gap-2 rounded-full bg-yellow-500 px-6 py-3 font-semibold text-black shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-400 hover:shadow-2xl sm:px-7 sm:py-3.5"
                >
                  Shop Now
                  <FiArrowRight className="text-lg" />
                </Link>
              </div>
            </div>

            <div className="relative flex w-full flex-1 items-center justify-center md:hidden">
              <div className="relative h-[280px] w-full max-w-[320px]">
                <div className="absolute left-1/2 top-1/2 w-[170px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] border border-gray-700 bg-black/10 shadow-[0_24px_50px_rgba(0,0,0,0.35)]">
                  <div className="aspect-[3/4]">
                    <img
                      src={heroImages[1]?.src || heroImages[0]?.src}
                      alt={heroImages[1]?.alt || heroImages[0]?.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = fallbackHeroImages[1]?.src || fallbackHeroImages[0]?.src;
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                <div className="absolute left-3 top-4 w-[96px] overflow-hidden rounded-[18px] border border-gray-700 bg-black/10 shadow-xl">
                  <div className="aspect-[3/4]">
                    <img
                      src={heroImages[0]?.src}
                      alt={heroImages[0]?.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = fallbackHeroImages[0]?.src;
                      }}
                    />
                  </div>
                </div>

                <div className="absolute bottom-4 right-3 w-[104px] overflow-hidden rounded-[18px] border border-gray-700 bg-black/10 shadow-xl">
                  <div className="aspect-[3/4]">
                    <img
                      src={heroImages[2]?.src || heroImages[0]?.src}
                      alt={heroImages[2]?.alt || heroImages[0]?.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = fallbackHeroImages[2]?.src || fallbackHeroImages[0]?.src;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden w-full flex-1 items-end justify-center gap-2.5 sm:gap-4 md:flex md:justify-center md:gap-4 lg:gap-5">
              {heroImages.map((img, index) => (
                <div
                  key={`${img.src}-${index}`}
                  className="relative aspect-[3/4] w-[88px] overflow-hidden rounded-[16px] border border-gray-700 bg-black/10 shadow-xl transition-transform duration-300 min-[420px]:w-[98px] sm:w-[120px] md:w-[180px] lg:w-[200px]"
                  style={{ transform: `translateY(${index === 1 ? '0' : index === 0 ? '18px' : '-6px'})` }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const fallback = fallbackHeroImages[index]?.src || '/no-image.svg';
                      e.currentTarget.src = fallback;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/18 to-transparent pointer-events-none" />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-4 left-5 flex items-center gap-2 sm:bottom-6 sm:left-8">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
