import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiHeart,
  FiArrowRight,
  FiZap,
  FiTrendingUp,
  FiFeather,
  FiUser,
  FiShuffle,
  FiList,
  FiGrid
} from 'react-icons/fi';
import { useProduct } from '../../Context/UseContext';
import { useAuth } from '../../Context/GoogleAuth';

const styleCategories = [
  { label: 'Slim Fit', icon: FiFeather, bg: 'from-[#1f1f1f] to-[#171717]', iconColor: 'text-yellow-400' },
  { label: 'Regular Fit', icon: FiTrendingUp, bg: 'from-[#1f1f1f] to-[#171717]', iconColor: 'text-yellow-400' },
  { label: 'Boys', icon: FiUser, bg: 'from-[#1f1f1f] to-[#171717]', iconColor: 'text-yellow-400' },
  { label: 'Bootcut', icon: FiShuffle, bg: 'from-[#1f1f1f] to-[#171717]', iconColor: 'text-yellow-400' },
  { label: 'Straight', icon: FiList, bg: 'from-[#1f1f1f] to-[#171717]', iconColor: 'text-yellow-400' },
  { label: 'All Styles', icon: FiGrid, bg: 'from-[#1f1f1f] to-[#171717]', iconColor: 'text-yellow-400' },
];

const fallbackPantCards = [
  {
    title: 'Slim Pant',
    slug: 'slim-fit',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Regular Pant',
    slug: 'regular-fit',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Cargo Pant',
    slug: 'cargo-pant',
    image:
      'https://images.unsplash.com/photo-1506629905607-45b5b7b60385?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Classic Pant',
    slug: 'straight',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
  },
];

const fallbackShirtCards = [
  {
    title: 'Formal Shirt',
    slug: 'formal-shirt',
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Casual Shirt',
    slug: 'casual-shirt',
    image:
      'https://images.unsplash.com/photo-1602810319428-019690571b5b?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Oxford Shirt',
    slug: 'oxford-shirt',
    image:
      'https://images.unsplash.com/photo-1603251579431-8041402bdeda?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Overshirt',
    slug: 'overshirt',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80',
  },
];

const toSlug = (value) => encodeURIComponent(String(value).toLowerCase().trim().replace(/\s+/g, '-'));
const normalizeValue = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const extractCategoryItems = (apiCategories) =>
  (Array.isArray(apiCategories) ? apiCategories : [])
    .flatMap((category) => (Array.isArray(category?.items) ? category.items : []))
    .filter(Boolean);

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

const getProductImage = (product) =>
  (Array.isArray(product?.images) && product.images[0]) ||
  product?.image ||
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80';

const buildCardsFromItems = (items, keywords, fallbackCards, products) => {
  const matchedItems = items.filter((item) => {
    const normalized = String(item).toLowerCase();
    return keywords.some((keyword) => normalized.includes(keyword));
  });

  const uniqueItems = matchedItems.filter(
    (item, index, self) =>
      index === self.findIndex((entry) => entry.toLowerCase() === String(item).toLowerCase())
  );

  if (uniqueItems.length === 0) {
    return fallbackCards;
  }

  return uniqueItems.slice(0, 4).map((item, index) => {
    const normalizedItem = normalizeValue(item);
    const matchingProduct = products.find((product) =>
      getProductCategoryValues(product).some(
        (categoryValue) =>
          categoryValue === normalizedItem ||
          categoryValue.includes(normalizedItem) ||
          normalizedItem.includes(categoryValue)
      )
    );

    return {
      title: item,
      slug: toSlug(item),
      image: matchingProduct ? getProductImage(matchingProduct) : fallbackCards[index % fallbackCards.length].image,
    };
  });
};

const FeaturedCategoryCard = ({ card }) => {
  const [hoverState, setHoverState] = useState({ active: false, x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setHoverState({
      active: true,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  };

  return (
    <Link
      to="/products"
      state={{ category: card.title }}
      className="group relative overflow-hidden rounded-[26px] border border-gray-800 bg-[#191919] shadow-[0_20px_50px_rgba(0,0,0,0.22)]"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseMove}
      onMouseLeave={() => setHoverState((prev) => ({ ...prev, active: false }))}
    >
      <div className="absolute inset-0">
        <img
          src={card.image}
          alt={card.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.05)_0%,rgba(10,10,10,0.18)_35%,rgba(10,10,10,0.72)_100%)]" />
      </div>

      <div className="relative flex min-h-[340px] items-end p-5 sm:min-h-[420px]">
        <div>
          <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            {card.title}
          </h3>
        </div>
      </div>

      <span
        className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-500/20 bg-black/65 px-3 py-1 text-[11px] font-semibold text-yellow-300 backdrop-blur-sm transition-opacity duration-150 ${
          hoverState.active ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: `${hoverState.x}px`,
          top: `${hoverState.y}px`,
        }}
      >
        {card.title}
      </span>
    </Link>
  );
};

const Catagoryproduct = () => {
  const navigate = useNavigate();
  const { products = [], categories: apiCategories = [] } = useProduct();
  const { token } = useAuth();
  const [favorites, setFavorites] = useState(new Set());

  const displayProducts = useMemo(() => {
    if (products && products.length) {
      return products.slice(0, 10).map((p, idx) => {
        const numericPrice = Number(p.price) || 0;
        const numericOldPrice = Number(p.oldPrice) || 0;
        const explicitDiscount = Math.max(0, Math.min(100, Number(p.discount) || 0));
        const computedDiscount = explicitDiscount > 0
          ? explicitDiscount
          : numericOldPrice > numericPrice && numericOldPrice > 0
            ? Math.round(((numericOldPrice - numericPrice) / numericOldPrice) * 100)
            : 0;

        return {
          id: p._id || p.id || idx,
          img:
            (Array.isArray(p.images) && p.images[0]) ||
            p.image ||
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80',
          title: p.name || p.title || 'Product',
          discount: computedDiscount > 0 ? `-${computedDiscount}%` : 'SALE',
          original: p,
        };
      });
    }
    return Array.from({ length: 10 }).map((_, idx) => ({
      id: idx,
      title: 'Denim Collection',
      discount: '-50%',
      img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80',
    }));
  }, [products]);

  const categoryItems = useMemo(() => extractCategoryItems(apiCategories), [apiCategories]);

  const featuredPantCards = useMemo(
    () =>
      buildCardsFromItems(
        categoryItems,
        ['pant', 'trouser', 'jeans', 'jogger', 'short'],
        fallbackPantCards,
        products
      ),
    [categoryItems, products]
  );

  const featuredShirtCards = useMemo(
    () =>
      buildCardsFromItems(
        categoryItems,
        ['shirt', 't-shirt', 't shirt', 'polo'],
        fallbackShirtCards,
        products
      ),
    [categoryItems, products]
  );

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
        console.log('Flash sale wishlist API response:', data);
        if (response.ok && data.success) {
          setFavorites(new Set(data.wishlist.map((item) => item.product?._id).filter(Boolean)));
        } else if (response.status === 401) {
          setFavorites(new Set());
        }
      } catch (error) {
        console.error('Failed to fetch wishlist for flash sale:', error);
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
      console.log('Flash sale wishlist toggle response:', data);
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
      console.error('Flash sale wishlist toggle failed:', error);
    }
  };

  return (
    <section className="w-full bg-[#121212] py-10">
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-10 space-y-8">
        {/* Category pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {styleCategories.map(({ label, icon: Icon, bg, iconColor }) => {
            const slug = encodeURIComponent(label.toLowerCase().replace(/\s+/g, '-'));
            return (
              <Link
                key={label}
                to={`/category/${slug}`}
                className="flex flex-col items-center gap-3 group"
              >
                <div className={`w-20 h-20 rounded-2xl border border-gray-800 bg-gradient-to-br ${bg} shadow-[0_12px_28px_rgba(0,0,0,0.16)] flex items-center justify-center transition-transform duration-150 group-hover:-translate-y-1 group-hover:border-yellow-500/40`}>
                  <Icon className={`text-3xl ${iconColor}`} />
                </div>
                <span className="text-sm font-semibold text-gray-200">{label}</span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Pantwear</h2>
              <p className="mt-1 text-sm text-gray-400">Refined silhouettes designed for modern everyday style.</p>
            </div>
            <Link
              to="/products"
              className="hidden items-center gap-2 text-sm font-semibold text-yellow-400 sm:inline-flex"
            >
              Explore All <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featuredPantCards.map((card) => (
              <FeaturedCategoryCard key={card.title} card={card} />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Shirtwear</h2>
              <p className="mt-1 text-sm text-gray-400">Statement shirts with polished structure and easy layering.</p>
            </div>
            <Link
              to="/products"
              className="hidden items-center gap-2 text-sm font-semibold text-yellow-400 sm:inline-flex"
            >
              Explore All <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featuredShirtCards.map((card) => (
              <FeaturedCategoryCard key={card.title} card={card} />
            ))}
          </div>
        </div>

        {/* Flash sale row */}
        <div className="bg-[#181818] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.20)] border border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-yellow-500 text-black grid place-items-center shadow-md">
                  <FiZap className="text-xl" />
                </span>
                <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-yellow-400 leading-none">Flash Sale</span>
                </div>
              </div>
            </div>
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-2 text-yellow-400 font-semibold"
            >
              See All <FiArrowRight />
            </Link>
          </div>

          {/* Products */}
          <div className="px-4 pb-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-3xl overflow-hidden shadow-[0_14px_35px_rgba(0,0,0,0.18)] bg-[#111111] border border-gray-800"
                >
                  <div className="relative">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.img}
                        alt={product.title}
                        className="w-full aspect-square object-cover"
                        loading="lazy"
                      />
                    </Link>
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold shadow-md">
                      {product.discount}
                    </span>
                    <button
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#1f1f1f] text-gray-200 grid place-items-center shadow-md hover:text-yellow-400"
                      onClick={(e) => toggleWishlist(e, product)}
                    >
                      <FiHeart
                        className={favorites.has(product.original?._id || product.id) ? 'text-rose-500' : ''}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Catagoryproduct;
