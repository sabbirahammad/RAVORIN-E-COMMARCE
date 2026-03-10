import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useProduct } from '../../Context/UseContext';
import { useAuth } from '../../Context/GoogleAuth';

const filters = [
  { label: 'Best Seller', active: true },
  { label: 'Keep Stylish' },
  { label: 'Special Discount' },
  { label: 'Official Store' },
];

const Products = () => {
  const navigate = useNavigate();
  const { products = [], loading, addToCart } = useProduct();
  const { token } = useAuth();
  const [activeFilter, setActiveFilter] = useState(filters[0].label);
  const [favorites, setFavorites] = useState(new Set());

  const displayProducts = useMemo(() => {
    if (products && products.length) {
      const mapped = products.slice(0, 20).map((p, idx) => {
        const numericPrice = Number(p.price) || 0;
        const numericOldPrice = Number(p.oldPrice) || 0;
        const discount = Math.max(0, Math.min(100, Number(p.discount) || 0));
        const computedOldPrice = numericOldPrice > numericPrice
          ? numericOldPrice
          : discount > 0 && numericPrice > 0
            ? Math.round(numericPrice / (1 - discount / 100))
            : 0;

        return {
          id: p._id || p.id || idx,
          title: p.name || p.title || 'Product',
          price: `Tk ${numericPrice}`,
          oldPrice: computedOldPrice ? `Tk ${computedOldPrice}` : '',
          numericPrice,
          numericOldPrice: computedOldPrice,
          discount,
          rating: p.rating || 5.0,
          badge: p.badge || (idx === 2 ? 'SALE' : '-'),
          isTopProduct: p.isTopProduct,
          isTrending: p.isTrending,
          officialStore: p.officialStore,
          img:
            (Array.isArray(p.images) && p.images[0]) ||
            p.image ||
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
          original: p,
        };
      });

      const applyFilter = (list) => {
        switch (activeFilter) {
          case 'Best Seller':
            return list.filter((p) => p.isTopProduct);
          case 'Keep Stylish':
            return list.filter((p) => p.isTrending);
          case 'Special Discount':
            return list.filter((p) => (p.discount || 0) > 0 || (p.numericOldPrice || 0) > (p.numericPrice || 0));
          case 'Official Store':
            return list.filter((p) => p.officialStore);
          default:
            return list;
        }
      };

      const filtered = applyFilter(mapped);
      return (filtered.length ? filtered : mapped).slice(0, 8);
    }

    return Array.from({ length: 8 }).map((_, idx) => ({
      id: idx,
      title: "Essential Men's Denim Jeans",
      price: 'Tk 2530',
      oldPrice: 'Tk 3999',
      discount: 37,
      rating: 5.0,
      badge: idx === 2 ? 'SALE' : '-',
      img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
    }));
  }, [products, activeFilter]);

  React.useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        setFavorites(new Set());
        return;
      }

      try {
        const response = await fetch('https://apii.ravorin.com/api/v1/user/wishlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Today's For You wishlist API response:", data);
        if (response.ok && data.success) {
          setFavorites(new Set(data.wishlist.map((item) => item.product?._id).filter(Boolean)));
        } else if (response.status === 401) {
          setFavorites(new Set());
        }
      } catch (error) {
        console.error('Failed to fetch wishlist for homepage products:', error);
      }
    };

    fetchWishlist();
  }, [token]);

  const toggleWishlist = async (event, product) => {
    event.stopPropagation();

    const productId = product.original?._id || product.id;
    if (!productId) return;

    if (!token) {
      navigate('/auth');
      return;
    }

    try {
      const isFav = favorites.has(productId);
      const response = await fetch(
        `https://apii.ravorin.com/api/v1/user/wishlist${isFav ? `/${productId}` : ''}`,
        {
          method: isFav ? 'DELETE' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: isFav ? undefined : JSON.stringify({ productId }),
        }
      );

      const data = await response.json();
      console.log("Today's For You wishlist toggle response:", data);
      if (!response.ok || !data.success) {
        if (response.status === 401) {
          navigate('/auth');
          return;
        }
        throw new Error(data.message || 'Wishlist update failed');
      }

      setFavorites((prev) => {
        const next = new Set(prev);
        if (isFav) {
          next.delete(productId);
        } else {
          next.add(productId);
        }
        return next;
      });
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
    }
  };

  return (
    <section className="w-full bg-[#121212] py-10">
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl font-black text-white">Today&apos;s For You!</h2>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.label}
                onClick={() => setActiveFilter(filter.label)}
                className={`px-5 py-3 rounded-2xl text-sm font-semibold border transition-all duration-150 ${
                  activeFilter === filter.label
                    ? 'bg-yellow-500 text-black border-yellow-500 shadow-md'
                    : 'bg-[#181818] text-gray-300 border-gray-800 hover:border-yellow-500/30 hover:text-yellow-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayProducts.map((product) => {
            const productId = product.id || product._id || 'item';
            const productPath = `/product/${productId}`;
            const isFav = favorites.has(productId);

            return (
              <div
                key={productId}
                className="bg-[#181818] rounded-3xl shadow-[0_18px_55px_rgba(0,0,0,0.18)] border border-gray-800 overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:border-yellow-500/30 cursor-pointer"
                onClick={() => navigate('/products')}
              >
                <div className="relative">
                  <Link to={productPath} className="block" onClick={(e) => e.stopPropagation()}>
                    <img
                      src={product.img}
                      alt={product.title}
                      className="w-full aspect-[4/3] object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <button
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#222222] text-gray-200 grid place-items-center shadow-md hover:text-yellow-400"
                    onClick={(e) => toggleWishlist(e, product)}
                  >
                    <FiHeart className={isFav ? 'text-rose-500' : ''} />
                  </button>

                  {product.discount > 0 ? (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold shadow-md">
                      -{product.discount}%
                    </span>
                  ) : product.badge === 'SALE' ? (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold shadow-md">
                      SALE
                    </span>
                  ) : null}
                </div>

                <div className="px-4 pt-4 pb-5 space-y-2">
                  <h3 className="text-base font-semibold text-white leading-snug">{product.title}</h3>
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    {'*****'.split('').map((star, idx) => (
                      <span key={idx}>{star}</span>
                    ))}
                    <span className="text-gray-400 font-semibold ml-1">{product.rating}</span>
                  </div>
                  <div className="flex items-end justify-between mt-1">
                    <div>
                      <div className="text-xl font-black text-yellow-400">{product.price}</div>
                      <div className="text-sm text-gray-400 line-through">{product.oldPrice}</div>
                    </div>
                    <button
                      className="w-12 h-12 rounded-2xl bg-yellow-500 text-black grid place-items-center shadow-md hover:bg-yellow-400 hover:shadow-lg"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (addToCart) {
                          await addToCart(product.original || {});
                        } else {
                          navigate('/product');
                        }
                      }}
                    >
                      <FiShoppingBag className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {loading && <div className="text-sm text-gray-400">Loading products...</div>}
      </div>
    </section>
  );
};

export default Products;
