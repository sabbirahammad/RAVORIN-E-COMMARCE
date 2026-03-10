import React, { useMemo, useState, useEffect } from 'react';
import { useProduct } from '../../Context/UseContext';
import { Link } from 'react-router-dom';

const PRODUCTS_PER_PAGE = 32;

const normalizeCategoryValue = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const getProductCategoryValues = (product) => {
  const rawCategories = [product?.category, product?.categories, product?.subcategory]
    .flat()
    .filter(Boolean);

  return rawCategories
    .map((item) => {
      if (typeof item === 'string') return item;
      return item?.name || item?.title || item?.label || '';
    })
    .filter(Boolean)
    .map(normalizeCategoryValue);
};

const ProductStrip = () => {
  const { products, selectedCategory, sortOption } = useProduct();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const normalizedSelectedCategory = normalizeCategoryValue(selectedCategory);

  const filteredProducts = useMemo(() => {
    if (!normalizedSelectedCategory) return products;

    return products.filter((product) =>
      getProductCategoryValues(product).some(
        (categoryValue) =>
          categoryValue === normalizedSelectedCategory ||
          categoryValue.includes(normalizedSelectedCategory) ||
          normalizedSelectedCategory.includes(categoryValue)
      )
    );
  }, [products, normalizedSelectedCategory]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case 'latest':
          return String(b._id || b.id || '').localeCompare(String(a._id || a.id || ''));
        case 'priceLowHigh':
          return Number(a.price || 0) - Number(b.price || 0);
        case 'priceHighLow':
          return Number(b.price || 0) - Number(a.price || 0);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="w-full space-y-6 p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <div
              key={product._id || product.id}
              className="flex flex-col items-center rounded-xl border border-[#2b2d35] bg-[#181a21] p-2 transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl"
            >
              <Link to={`/product/${product._id || product.id}`}>
                <img
                  src={
                    product.images && product.images[0]
                      ? product.images[0]
                      : 'https://via.placeholder.com/300x300?text=No+Image'
                  }
                  alt={product.name}
                  className="mb-3 h-48 w-full rounded-md object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
              </Link>
              <h3 className="line-clamp-2 text-center text-sm font-semibold text-gray-200">
                {product.name}
              </h3>
              <p className="mt-1 font-bold text-orange-400">Tk {product.price}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-gray-700 px-4 py-12 text-center text-gray-400">
            No products found for this category.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-md bg-[#1f1f1f] px-3 py-1 text-white hover:bg-[#333] disabled:opacity-30"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`rounded-md px-3 py-1 text-sm ${
                currentPage === i + 1
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#1f1f1f] text-gray-300 hover:bg-[#333]'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-md bg-[#1f1f1f] px-3 py-1 text-white hover:bg-[#333] disabled:opacity-30"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductStrip;
