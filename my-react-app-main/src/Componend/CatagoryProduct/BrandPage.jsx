import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../../Context/UseContext';

import BrandBanner from './BrandBanner';
import BrandCategoryTitle from './BrandCategoryTitle';
import ProductStrip from './ProductStrip';
import BrandFooter from './BrandFooter';
import CategorySidebar from './CategorySidebar';
import SponsorComponent from './SponsorComponent';
import Topbar from '../Home/Topbar';
import FloatingActionButtons from '../ProductDetails/FloatingActionButtons';
import DiscountBanner from './DiscountBanner';

const normalizeCategoryValue = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const BrandPage = () => {
  const { slug } = useParams();
  const { setSelectedCategory } = useProduct();

  useEffect(() => {
    if (slug) {
      setSelectedCategory(normalizeCategoryValue(slug));
    }
  }, [slug, setSelectedCategory]);

  return (
    <div className="min-h-screen bg-[#121318]">
      <Topbar />
      <BrandBanner />
      <DiscountBanner />

      <div className="mx-auto flex max-w-[1240px] flex-col items-start px-4 py-2 md:flex-row">
        <div className="w-full md:w-1/4">
          <CategorySidebar />
        </div>

        <div className="w-full md:w-3/4">
          <BrandCategoryTitle />
          <ProductStrip />
          <FloatingActionButtons />
          <SponsorComponent />
          <BrandFooter />
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
