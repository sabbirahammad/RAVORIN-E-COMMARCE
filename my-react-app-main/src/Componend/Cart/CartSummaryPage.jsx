import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Heart, Minus, Percent, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useAuth } from '../../Context/GoogleAuth';
import { useProduct } from '../../Context/UseContext';
import { fetchDeliveryCosts } from '../../services/deliveryCostService';

const resolveImage = (image) => {
  if (!image) return '/no-image.svg';
  return image.startsWith('http') ? image : `https://apii.ravorin.com${image}`;
};

const CartSummaryPage = () => {
  const navigate = useNavigate();
  const { token, initialized } = useAuth();
  const { products = [], addToCart } = useProduct();
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [deliveryCosts, setDeliveryCosts] = useState({ dhakaInside: 60, dhakaOutside: 120 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [pendingItems, setPendingItems] = useState(new Set());
  const [addingProductId, setAddingProductId] = useState(null);

  const loadCheckoutSummary = async () => {
    if (!token) {
      return;
    }

    try {
      setError('');

      const [cartResponse, fetchedDeliveryCosts, wishlistResponse] = await Promise.all([
        axios.get('https://apii.ravorin.com/api/v1/cart', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetchDeliveryCosts(),
        axios.get('https://apii.ravorin.com/api/v1/user/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setDeliveryCosts(fetchedDeliveryCosts);
      setCartItems(cartResponse.data?.cart?.items || []);
      setFavorites(
        new Set(
          (wishlistResponse.data?.wishlist || [])
            .map((item) => item.product?._id)
            .filter(Boolean)
        )
      );
    } catch (err) {
      console.error('Failed to load cart summary:', err);
      setError('Failed to load cart data.');
    }
  };

  useEffect(() => {
    const initializeCheckoutSummary = async () => {
      if (!initialized) return;

      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        setLoading(true);
        await loadCheckoutSummary();
      } catch (err) {
        console.error('Failed to load cart summary:', err);
        setError('Failed to load cart data.');
      } finally {
        setLoading(false);
      }
    };

    initializeCheckoutSummary();
  }, [initialized, navigate, token]);

  const setItemPending = (itemId, isPending) => {
    setPendingItems((prev) => {
      const next = new Set(prev);
      if (isPending) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }
      return next;
    });
  };

  const handleUpdateQuantity = async (itemId, nextQuantity) => {
    if (!token) {
      navigate('/auth');
      return;
    }

    if (nextQuantity < 1) {
      return;
    }

    const currentItems = [...cartItems];
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: nextQuantity } : item
      )
    );
    setItemPending(itemId, true);

    try {
      const response = await fetch(`https://apii.ravorin.com/api/v1/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: nextQuantity }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update quantity');
      }
    } catch (err) {
      console.error('Failed to update cart item quantity:', err);
      setCartItems(currentItems);
      setError(err.message || 'Failed to update quantity.');
    } finally {
      setItemPending(itemId, false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!token) {
      navigate('/auth');
      return;
    }

    const currentItems = [...cartItems];
    setCartItems((prev) => prev.filter((item) => item._id !== itemId));
    setItemPending(itemId, true);

    try {
      const response = await fetch(`https://apii.ravorin.com/api/v1/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to remove item');
      }
    } catch (err) {
      console.error('Failed to remove cart item:', err);
      setCartItems(currentItems);
      setError(err.message || 'Failed to remove item.');
    } finally {
      setItemPending(itemId, false);
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!productId) return;

    if (!token) {
      navigate('/auth');
      return;
    }

    const isFav = favorites.has(productId);

    try {
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
      if (!response.ok || !data.success) {
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
    } catch (err) {
      console.error('Failed to update wishlist from cart summary:', err);
      setError(err.message || 'Failed to update wishlist.');
    }
  };

  const summary = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    );
    const serviceCharge = cartItems.length ? deliveryCosts.dhakaOutside : 0;
    const total = subtotal + serviceCharge;

    return {
      subtotal,
      serviceCharge,
      total,
    };
  }, [cartItems, deliveryCosts.dhakaOutside]);

  const suggestedProducts = useMemo(() => {
    const cartProductIds = new Set(
      cartItems
        .map((item) => item.product_id?._id || item.product_id)
        .filter(Boolean)
        .map((id) => String(id))
    );

    return products
      .filter((product) => {
        const productId = product._id || product.id;
        return productId && !cartProductIds.has(String(productId));
      })
      .slice(0, 10);
  }, [cartItems, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-500" />
          <p className="text-gray-400">Loading your cart summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-4 sm:px-5 lg:px-8">
      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      <div className="mx-auto max-w-[1400px]">
        <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-400/80">
              Checkout
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Review Your Cart
            </h1>
            <p className="mt-1 text-xs text-gray-400 sm:text-sm">
              Check your selected products, apply promotion, then continue to delivery details.
            </p>
          </div>
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-xs font-semibold text-yellow-300">
            {cartItems.length} item{cartItems.length === 1 ? '' : 's'} ready to order
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.6fr_0.8fr]">
          <section className="space-y-5">
            {cartItems.length === 0 ? (
              <div className="rounded-[28px] border border-gray-800 bg-[#181818] p-8 text-center">
                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
                <p className="mt-2 text-sm text-gray-400">Add products before proceeding to order.</p>
                <button
                  onClick={() => navigate('/products')}
                  className="mt-5 rounded-2xl bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <article
                  key={item._id || `${item.product_id}-${item.size}`}
                  className="rounded-[28px] border border-gray-800 bg-[#181818] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.24)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#111111]">
                      <img
                        src={resolveImage(item.image)}
                        alt={item.name}
                        className="h-24 w-24 object-cover sm:h-28 sm:w-28"
                        onError={(e) => {
                          e.currentTarget.src = '/no-image.svg';
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-base font-bold text-white sm:text-lg">{item.name}</h2>
                      <p className="mt-2 text-xs text-gray-400">Size: {item.size || 'M'}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center overflow-hidden rounded-2xl border border-gray-700 bg-[#111111]">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item._id, Math.max(1, (item.quantity || 1) - 1))}
                            disabled={pendingItems.has(item._id) || (item.quantity || 1) <= 1}
                            className="px-3 py-2 text-gray-300 transition hover:bg-[#202020] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[40px] px-3 text-center text-xs font-semibold text-white">
                            {item.quantity || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item._id, (item.quantity || 1) + 1)}
                            disabled={pendingItems.has(item._id)}
                            className="px-3 py-2 text-gray-300 transition hover:bg-[#202020] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleWishlist(item.product_id?._id || item.product_id)}
                          className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                            favorites.has(item.product_id?._id || item.product_id)
                              ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                              : 'border-gray-700 bg-[#111111] text-gray-300 hover:border-yellow-500/30 hover:text-yellow-300'
                          }`}
                        >
                          <Heart className="h-4 w-4" />
                          Wishlist
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={pendingItems.has(item._id)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-gray-700 bg-[#111111] px-3 py-2 text-xs font-semibold text-gray-300 transition hover:border-red-500/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="min-w-[128px] rounded-2xl border border-yellow-500/15 bg-yellow-500/5 px-4 py-2.5 text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Item Total
                      </p>
                      <p className="mt-2 text-xl font-black text-yellow-400">
                        Tk {((Number(item.price) || 0) * (Number(item.quantity) || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>

          <aside className="h-fit rounded-[28px] border border-gray-800 bg-[#181818] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.24)] xl:sticky xl:top-24">
            <div className="mb-6">
              <h2 className="text-xl font-black text-white">Promotion</h2>
              <div className="mt-3 flex overflow-hidden rounded-2xl border border-gray-700 bg-[#111111]">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 bg-transparent px-4 py-3 text-xs text-white placeholder:text-gray-500 focus:outline-none"
                />
                <button
                  type="button"
                  className="flex items-center gap-2 border-l border-gray-700 bg-yellow-500 px-4 py-3 text-xs font-semibold text-black"
                >
                  <Percent className="h-4 w-4" />
                  Apply
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-800 bg-[#111111] p-4">
              <h3 className="text-lg font-bold text-white">Order Summary</h3>
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>Tk {summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>Delivery & service charge</span>
                  <span>Tk {summary.serviceCharge.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-800 pt-3">
                  <div className="flex items-center justify-between text-base font-black text-white">
                    <span>Total</span>
                    <span className="text-yellow-400">Tk {summary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout-details')}
              disabled={!cartItems.length}
              className={`mt-5 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                cartItems.length
                  ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                  : 'cursor-not-allowed bg-gray-700 text-gray-400'
              }`}
            >
              Proceed to Order
              <ArrowRight className="h-5 w-5" />
            </button>
          </aside>
        </div>

        {suggestedProducts.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white sm:text-2xl">More Product</h2>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  More items you may like, excluding products already in your cart.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-xs font-semibold text-yellow-300 transition hover:bg-yellow-500/15"
              >
                More Product
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              {suggestedProducts.map((product) => {
                const productId = product._id || product.id;
                const productImage =
                  (Array.isArray(product.images) && product.images[0]) ||
                  product.image ||
                  '/no-image.svg';
                const price = Number(product.price) || 0;

                return (
                  <article
                    key={productId}
                    onClick={() => navigate(`/product/${productId}`)}
                    className="group cursor-pointer overflow-hidden rounded-[24px] border border-gray-800 bg-[#181818] transition hover:-translate-y-1 hover:border-yellow-500/30"
                  >
                    <div className="relative">
                      <img
                        src={resolveImage(productImage)}
                        alt={product.name}
                        className="h-44 w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/no-image.svg';
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 opacity-0 transition duration-200 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={async (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            event.nativeEvent?.stopImmediatePropagation?.();
                            if (!token) {
                              navigate('/auth');
                              return;
                            }
                            if (addToCart) {
                              setAddingProductId(productId);
                              const result = await addToCart({
                                ...product,
                                selectedSize: 'M',
                                size: 'M',
                                qty: 1,
                                quantity: 1,
                              });
                              if (result?.success) {
                                await loadCheckoutSummary();
                              } else if (result?.message) {
                                setError(result.message);
                              }
                              setTimeout(() => {
                                setAddingProductId((current) =>
                                  current === productId ? null : current
                                );
                              }, 500);
                            }
                          }}
                          disabled={addingProductId === productId}
                          className={`w-full rounded-xl px-3 py-2 text-xs font-bold transition ${
                            addingProductId === productId
                              ? 'cursor-wait bg-yellow-300 text-black'
                              : 'bg-yellow-500 text-black hover:bg-yellow-400'
                          }`}
                        >
                          {addingProductId === productId ? 'Adding...' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="line-clamp-2 text-sm font-bold text-white">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm font-black text-yellow-400">Tk {price}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CartSummaryPage;
