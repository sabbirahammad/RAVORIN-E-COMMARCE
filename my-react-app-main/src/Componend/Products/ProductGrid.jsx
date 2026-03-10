import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useProduct } from '../../Context/UseContext';
import ProductCard from './ProductCard';
import ProductDetailsModal from './ProductDetailsModal';

const normalizeValue = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const getProductCategoryValues = (product) =>
  [product?.category, product?.categories, product?.subcategory]
    .flat()
    .filter(Boolean)
    .map((item) => {
      if (typeof item === 'string') return item;
      return item?.name || item?.title || item?.label || '';
    })
    .filter(Boolean)
    .map(normalizeValue);

const ProductGrid = ({ searchQuery = '', selectedCategories = [], sortBy }) => {
  const { products, setCartItems } = useProduct();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const state = location.state || {};
  const highlightId = state.highlightId || null;
  const selectedCategoryFromState = state.category || null;

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const productCategoryValues = getProductCategoryValues(product);

      const matchesCategory =
        selectedCategories.length > 0
          ? selectedCategories.some((selectedCat) => {
              const normalizedSelected = normalizeValue(selectedCat);
              return productCategoryValues.some(
                (value) =>
                  value === normalizedSelected ||
                  value.includes(normalizedSelected) ||
                  normalizedSelected.includes(value)
              );
            })
          : selectedCategoryFromState
            ? productCategoryValues.some((value) => {
                const normalizedSelected = normalizeValue(selectedCategoryFromState);
                return (
                  value === normalizedSelected ||
                  value.includes(normalizedSelected) ||
                  normalizedSelected.includes(value)
                );
              })
            : true;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (a.id === highlightId) return -1;
      if (b.id === highlightId) return 1;

      switch (sortBy) {
        case 'popularity':
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'default':
        default:
          return 0;
      }
    });

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      return exists
        ? prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          )
        : [...prev, { ...product, qty: 1 }];
    });
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 px-1 sm:mt-5 sm:gap-5 sm:px-4 lg:grid-cols-3 lg:gap-6 lg:px-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id || product.id}
              onClick={() => openModal(product)}
              className="cursor-pointer"
            >
              <ProductCard
                id={product._id || product.id}
                name={product.name}
                price={product.price}
                oldPrice={product.oldPrice}
                discount={product.discount}
                image={product.images}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400">
            No products found.
          </div>
        )}
      </div>

      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
        addToCart={handleAddToCart}
      />
    </>
  );
};

export default ProductGrid;
