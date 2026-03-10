import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import BottomCartBar from './BottomCartBar';
import RelatedProducts from './RelatedProducts';
import CustomerReviews from './CustomerReviews';
import RecentlyViewed from './RecentlyViewed';
import StickyCartButton from './StickyCartButton';
import StickyProductHeader from './StickyProductHeader';
import StickyBuyNowButton from './StickyBuyNowButton';
import BuyNowModal from './BuyNowModal';
import SuccessMessageModal from './SuccessMessageModal';
import FloatingActionButtons from './FloatingActionButtons';
import ProductBreadcrumb from './ProductBreadcrumb';
import YouMayAlsoLike from './YouMayAlsoLike';
import ProductHighlights from './ProductHighlights';
import LimitedTimeOffer from './LimitedTimeOffer';
import DeliveryInfo from './DeliveryInfo';
import ProductFAQ from './ProductFAQ';
import ShopTheLook from './ShopTheLook';
import FloatingPromoBanner from './FloatingPromoBanner';
import RatingsSummary from './RatingsSummary';
import OrderSummary from './OrderSummary';
import { useProduct } from '../../Context/UseContext';
import DeliveryDetails from './DeliveryDetails';
import Navbar from '../NavberSection/Navber';
import TopProduct from './TopProduct';
import SellerInfoCard from './SellerInfoCard';
import Footer from './Footer';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { products, addToRecentlyViewed } = useProduct();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

useEffect(() => {
  if (products.length > 0) {
    const found = products.find((p) => {
      if (!p) return false;
      const productId = p.id || p._id;
      return productId?.toString() === id;
    });
    setProduct(found || null);
    if (found) addToRecentlyViewed(found);
    setLoading(false);
  }
}, [products, id]);


  if (loading) {
    return (
      <div className="min-h-screen text-white bg-black flex justify-center items-center text-xl">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen text-white bg-black flex justify-center items-center text-xl">
        Product not found.
      </div>
    );
  }

  const handleAddToCart = (item) => {
    console.log('Added to cart:', item);
  };

  const handleBuyNow = () => {
    setShowBuyNowModal(true);
  };

  const handleOrderSuccess = () => {
    setShowBuyNowModal(false);
    setShowSuccessModal(true);
  };

  return (
    <>
      <div className="bg-[#121212] text-white min-h-screen px-4 sm:px-8 py-6">
        <Navbar />
        <div className="max-w-6xl mx-auto">
          <ProductBreadcrumb category={product.category} productName={product.name} />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <ProductGallery images={product.images || []} key={product.id} />
          <ProductInfo product={product} onAddToCart={handleAddToCart} />

          <div className="md:col-span-2 flex grid-cols-2 justify-between">
            <DeliveryDetails />
            <SellerInfoCard productName={product.name} />
          </div>

          <div className="md:col-span-2">
            <ProductTabs
              description={product.description || 'No description available'}
              specification={[
                'Material: 100% Cotton',
                'Color: Deep Black',
                'Fit: Slim Fit',
                'Available Sizes: S, M, L, XL',
                'Made in Bangladesh',
              ]}
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-6">
          <ProductHighlights />
          <div className="flex items-center gap-4 text-xl mt-4">
            <span className="text-yellow-400 font-bold">৳{product.price}</span>
            {product.oldPrice && (
              <span className="line-through text-gray-500 text-base">৳{product.oldPrice}</span>
            )}
          </div>
          <LimitedTimeOffer durationInHours={2} />
        </div>
      </div>

      <div className="bg-gray-900">
        <RatingsSummary />
        <RelatedProducts currentProductId={product.id} />

        <StickyProductHeader product={product} onAddToCart={() => handleAddToCart(product)} />
        <BuyNowModal
          isOpen={showBuyNowModal}
          onClose={() => setShowBuyNowModal(false)}
          onSuccess={handleOrderSuccess}
        />
        <SuccessMessageModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
        <DeliveryInfo />
        <ProductFAQ />
        <FloatingActionButtons />
        <RecentlyViewed />
        <YouMayAlsoLike currentProductId={product.id} />
        <FloatingPromoBanner />
        <TopProduct />
        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;








