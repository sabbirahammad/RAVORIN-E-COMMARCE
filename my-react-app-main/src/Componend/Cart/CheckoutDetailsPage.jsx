import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, CreditCard, MapPin, NotebookPen, PencilLine, Plus } from 'lucide-react';
import AddressForm from './AddressForm';
import { useAuth } from '../../Context/GoogleAuth';
import { calculateDeliveryCost, fetchDeliveryCosts } from '../../services/deliveryCostService';

const CheckoutDetailsPage = () => {
  const navigate = useNavigate();
  const { token, initialized } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryCosts, setDeliveryCosts] = useState({ dhakaInside: 60, dhakaOutside: 120 });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCheckoutDetails = async () => {
      if (!initialized) return;

      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [cartResponse, addressResponse, fetchedDeliveryCosts] = await Promise.all([
          axios.get('https://apii.ravorin.com/api/v1/cart', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://apii.ravorin.com/api/v1/user/addresses', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetchDeliveryCosts(),
        ]);

        const nextCartItems = cartResponse.data?.cart?.items || [];
        const nextAddresses = addressResponse.data?.addresses || [];

        setCartItems(nextCartItems);
        setAddresses(nextAddresses);
        setDeliveryCosts(fetchedDeliveryCosts);

        if (nextAddresses.length) {
          const defaultAddress =
            nextAddresses.find((address) => address.isDefault) || nextAddresses[0];
          setSelectedAddressId(defaultAddress?._id || '');
        }
      } catch (err) {
        console.error('Failed to load checkout details:', err);
        setError('Failed to load checkout details.');
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutDetails();
  }, [initialized, navigate, token]);

  const selectedAddress = useMemo(
    () => addresses.find((address) => address._id === selectedAddressId) || null,
    [addresses, selectedAddressId]
  );

  const summary = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    );
    const deliveryFee = calculateDeliveryCost(selectedAddress, deliveryCosts);
    return {
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    };
  }, [cartItems, deliveryCosts, selectedAddress]);

  const refreshAddresses = async () => {
    if (!token) return;
    const response = await axios.get('https://apii.ravorin.com/api/v1/user/addresses', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const nextAddresses = response.data?.addresses || [];
    setAddresses(nextAddresses);
    if (nextAddresses.length) {
      setSelectedAddressId((prev) => prev || nextAddresses[0]._id);
    }
  };

  const handleAddressSaved = async () => {
    await refreshAddresses();
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleProceedToPay = async () => {
    if (!token) {
      navigate('/auth');
      return;
    }

    if (!cartItems.length) {
      setError('Your cart is empty.');
      return;
    }

    if (!selectedAddress) {
      setError('Please select or add a pickup point address.');
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const formattedPaymentMethod = paymentMethod.toLowerCase().replace(/\s+/g, '_');
      const orderData = {
        shippingAddress: {
          fullName: selectedAddress.fullName || selectedAddress.name,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country || 'Bangladesh',
        },
        paymentMethod: formattedPaymentMethod,
        notes,
      };

      const orderResponse = await axios.post(
        'https://apii.ravorin.com/api/v1/orders',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (orderResponse.data?.success) {
        if (formattedPaymentMethod === 'cash_on_delivery') {
          navigate('/orders');
        } else {
          navigate('/payments');
        }
      }
    } catch (err) {
      console.error('Proceed to pay failed:', err);
      setError(err.response?.data?.message || 'Failed to create order.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-500" />
          <p className="text-gray-400">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] px-4 py-4 text-white sm:px-5 lg:px-8">
      {error && (
        <div className="mx-auto mb-4 max-w-[1400px] rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-300">
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
              Delivery & Payment
            </h1>
            <p className="mt-1 text-xs text-gray-400 sm:text-sm">
              Select pickup point, manage address, choose payment method, then proceed to pay.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingAddress(null);
              setShowAddressForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs font-semibold text-yellow-300"
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="space-y-4">
            <div className="rounded-[28px] border border-gray-800 bg-[#181818] p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-500/10 text-yellow-400">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-white">Select Pickup Point</h2>
                  <p className="text-xs text-gray-400">
                    Choose an existing address or add a new one.
                  </p>
                </div>
              </div>

              {!addresses.length ? (
                <div className="rounded-3xl border border-dashed border-gray-700 bg-[#111111] p-6 text-center">
                  <p className="text-base font-semibold text-white">No pickup point found</p>
                  <p className="mt-2 text-xs text-gray-400">
                    Add a new address to continue checkout.
                  </p>
                  <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddressForm(true);
                      }}
                      className="rounded-2xl bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
                    >
                      Add New Address
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddressForm(true);
                      }}
                      className="rounded-2xl border border-gray-700 bg-[#181818] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-yellow-500/40 hover:text-yellow-300"
                    >
                      Edit Address
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map((address) => {
                    const isSelected = selectedAddressId === address._id;

                    return (
                      <button
                        type="button"
                        key={address._id}
                        onClick={() => setSelectedAddressId(address._id)}
                        className={`rounded-3xl border p-4 text-left transition ${
                          isSelected
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : 'border-gray-800 bg-[#111111] hover:border-yellow-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-base font-bold text-white">
                              {address.fullName || address.name || 'Address'}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">{address.phone}</p>
                          </div>
                          {isSelected && <CheckCircle2 className="h-5 w-5 text-yellow-400" />}
                        </div>
                        <p className="mt-3 text-xs text-gray-300">{address.address}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {address.city} {address.postalCode ? `, ${address.postalCode}` : ''}
                        </p>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setEditingAddress(address);
                            setShowAddressForm(true);
                          }}
                          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-yellow-300"
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit Address
                        </button>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-gray-800 bg-[#181818] p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-500/10 text-yellow-400">
                  <CreditCard className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-black text-white">Payment Method</h2>
              </div>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-2xl border border-gray-700 bg-[#111111] px-4 py-3 text-xs text-white outline-none transition focus:border-yellow-500"
              >
                <option value="">Select Payment Method</option>
                <option value="Cash On Delivery">Cash On Delivery</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bkash">Bkash</option>
                <option value="Nagad">Nagad</option>
              </select>
            </div>

            <div className="rounded-[28px] border border-gray-800 bg-[#181818] p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-500/10 text-yellow-400">
                  <NotebookPen className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-black text-white">Notes</h2>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Any delivery instruction or custom note..."
                className="w-full rounded-2xl border border-gray-700 bg-[#111111] px-4 py-3 text-xs text-white placeholder:text-gray-500 outline-none transition focus:border-yellow-500"
              />
            </div>
          </section>

          <aside className="h-fit rounded-[28px] border border-gray-800 bg-[#181818] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.24)] xl:sticky xl:top-24">
            <h2 className="text-xl font-black text-white">Order Summary</h2>
            <div className="mt-4 rounded-3xl border border-gray-800 bg-[#111111] p-4">
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-gray-300">
                  <span>Items ({cartItems.length})</span>
                  <span>Tk {summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>Delivery</span>
                  <span>Tk {summary.deliveryFee.toFixed(2)}</span>
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
              onClick={handleProceedToPay}
              disabled={submitting || !cartItems.length || !paymentMethod}
              className={`mt-5 w-full rounded-2xl px-5 py-3 text-sm font-bold transition ${
                submitting || !cartItems.length || !paymentMethod
                  ? 'cursor-not-allowed bg-gray-700 text-gray-400'
                  : 'bg-yellow-500 text-black hover:bg-yellow-400'
              }`}
            >
              {submitting ? 'Processing...' : 'Proceed to Pay'}
            </button>
          </aside>
        </div>
      </div>

      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-gray-800 bg-[#181818] p-4 shadow-2xl">
            <AddressForm
              initialData={editingAddress}
              onSave={handleAddressSaved}
              onClose={() => {
                setShowAddressForm(false);
                setEditingAddress(null);
              }}
              onBack={() => {
                setShowAddressForm(false);
                setEditingAddress(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutDetailsPage;
