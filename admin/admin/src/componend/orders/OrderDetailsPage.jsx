import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  // Form states
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');

  // UI states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id && token) {
      fetchOrderDetails();
      fetchPaymentProof();
    }
  }, [id, token]);

  const fetchOrderDetails = async () => {
    if (!id) {
      setError('Order ID is missing');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`https://apii.ravorin.com/api/v1/orders/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        throw new Error('Failed to fetch order details');
      }

      const data = await res.json();
      console.log('Admin order details API response:', data);
      setOrder(data.order);
      setNewStatus(data.order.status);
    } catch (err) {
      setError(err.message || 'Error loading order details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentProof = async () => {
    if (!id) return;

    try {
      const res = await fetch(`https://apii.ravorin.com/api/v1/orders/${id}/payment-proof`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Admin payment proof API response:', data);
        setPaymentProof(data.paymentProof);
      }
    } catch (err) {
      console.error('Error fetching payment proof:', err);
    }
  };

  const updateOrderStatus = async () => {
    if (!newStatus || !id) return;

    try {
      setUpdating(true);
      const res = await fetch(`https://apii.ravorin.com/api/v1/orders/admin/${id}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNumber || undefined
        })
      });

      if (!res.ok) throw new Error('Failed to update order status');

      await fetchOrderDetails();
      setShowStatusModal(false);
      setTrackingNumber('');
    } catch (err) {
      alert('Error updating order status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const cancelOrder = async () => {
    if (!cancelReason.trim() || !id) return;

    try {
      setUpdating(true);
      const res = await fetch(`https://apii.ravorin.com/api/v1/orders/admin/${id}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: cancelReason
        })
      });

      if (!res.ok) throw new Error('Failed to cancel order');

      await fetchOrderDetails();
      setShowCancelModal(false);
      setCancelReason('');
    } catch (err) {
      alert('Error cancelling order: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const addAdminNote = async () => {
    if (!adminNote.trim() || !id) return;

    try {
      setUpdating(true);
      const res = await fetch(`https://apii.ravorin.com/api/v1/orders/admin/${id}/note`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          note: adminNote
        })
      });

      if (!res.ok) throw new Error('Failed to add admin note');

      await fetchOrderDetails();
      setShowNoteModal(false);
      setAdminNote('');
    } catch (err) {
      alert('Error adding admin note: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const verifyPaymentProof = async () => {
    if (!verificationStatus || !id) return;

    try {
      setUpdating(true);
      const res = await fetch(`https://apii.ravorin.com/api/v1/orders/admin/${id}/verify-payment`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: verificationStatus,
          adminNotes: verificationNotes
        })
      });

      if (!res.ok) throw new Error('Failed to verify payment proof');

      await fetchOrderDetails();
      await fetchPaymentProof();
      setShowVerificationModal(false);
      setVerificationNotes('');
    } catch (err) {
      alert('Error verifying payment proof: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-orange-500 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order ID Missing</h2>
          <p className="text-gray-600 mb-4">No order ID provided in the URL</p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Order</h2>
          <p className="text-gray-600 mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }
console.log(paymentProof)
  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/orders')}
              className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2 text-sm sm:text-base self-start sm:self-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back to Orders</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status.toUpperCase()}
            </span>
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
              Payment: {order.paymentStatus.toUpperCase()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setShowStatusModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Update Status
            </button>

            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Cancel Order
              </button>
            )}

            <button
              onClick={() => setShowNoteModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Add Note
            </button>

            {paymentProof && paymentProof.status === 'pending' && (
              <button
                onClick={() => setShowVerificationModal(true)}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                Verify Payment
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {['details', 'payment', 'notes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-3 sm:p-6">
            {/* Order Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Customer Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">Customer Information</h3>
                    <div className="space-y-2 text-sm sm:text-base">
                      <p><span className="font-medium">Name:</span> {order.user?.name}</p>
                      <p><span className="font-medium">Email:</span> {order.user?.email}</p>
                      <p><span className="font-medium">Order Date:</span> {formatDate(order.createdAt)}</p>
                      {order.deliveredDate && (
                        <p><span className="font-medium">Delivered:</span> {formatDate(order.deliveredDate)}</p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">Shipping Address</h3>
                    <div className="space-y-1 text-sm sm:text-base">
                      <p className="font-medium">{order.shippingAddress?.fullName}</p>
                      <p>{order.shippingAddress?.phone}</p>
                      <p>{order.shippingAddress?.address}</p>
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                      <p>{order.shippingAddress?.country}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-3 sm:p-4 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Order Items</h3>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-3">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 text-sm sm:text-base">{item.name}</p>
                              <p className="text-xs sm:text-sm text-gray-600">Quantity: {item.quantity} | Size: {item.size || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="font-medium text-gray-800 text-sm sm:text-base">৳{item.price * item.quantity}</p>
                            <p className="text-xs sm:text-sm text-gray-600">৳{item.price} each</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="space-y-2 max-w-xs ml-auto text-sm sm:text-base">
                        <div className="flex justify-between">
                           <span>Subtotal:</span>
                           <span>৳{order.subtotal}</span>
                         </div>
                         <div className="flex justify-between">
                           <span>Delivery Cost:</span>
                           <span>৳{order.deliveryCost || 0}</span>
                         </div>
                        <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>৳{order.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">Payment Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2 text-sm sm:text-base">
                      <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
                      <p><span className="font-medium">Payment Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-2 text-sm sm:text-base">
                      <p><span className="font-medium">Amount:</span> ৳{order.total}</p>
                      {order.notes && (
                        <p><span className="font-medium">Notes:</span> {order.notes}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Proof */}
                {paymentProof && (
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-3 sm:p-4 border-b border-gray-200">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">Payment Proof</h3>
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-2 text-sm sm:text-base">
                          <p><span className="font-medium">Transaction ID:</span> {paymentProof.transaction_id}</p>
                          <p><span className="font-medium">Payment Method:</span> {paymentProof.payment_method}</p>
                          <p><span className="font-medium">Amount:</span> ৳{paymentProof.amount}</p>
                          <p><span className="font-medium">Sender Number:</span> {paymentProof.sender_number}</p>
                          <p><span className="font-medium">Sender Name:</span> {paymentProof.sender_name}</p>
                          <p><span className="font-medium">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              paymentProof.status === 'verified' ? 'bg-green-100 text-green-800' :
                              paymentProof.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {paymentProof.status}
                            </span>
                          </p>
                        </div>
                        <div className="space-y-2 text-sm sm:text-base">
                          <p><span className="font-medium">Submitted:</span> {formatDate(paymentProof.submitted_at)}</p>
                          {paymentProof.verified_at && (
                            <p><span className="font-medium">Verified:</span> {formatDate(paymentProof.verified_at)}</p>
                          )}
                          {paymentProof.admin_notes && (
                            <div>
                              <span className="font-medium">Admin Notes:</span>
                              <p className="mt-1 p-2 bg-gray-50 rounded text-xs sm:text-sm">{paymentProof.admin_notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Admin Notes Tab */}
            {activeTab === 'notes' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Add New Note */}
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">Add Admin Note</h3>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Enter your note..."
                    className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 mb-3 h-20 sm:h-24 resize-none text-sm sm:text-base"
                  />
                  <button
                    onClick={() => setShowNoteModal(true)}
                    disabled={!adminNote.trim()}
                    className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 text-sm sm:text-base w-full sm:w-auto"
                  >
                    Add Note
                  </button>
                </div>

                {/* Existing Notes */}
                {order.adminNotes && order.adminNotes.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-3 sm:p-4 border-b border-gray-200">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">Admin Notes History</h3>
                    </div>
                    <div className="p-3 sm:p-4 space-y-3">
                      {order.adminNotes.map((note, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                            <span className="text-xs sm:text-sm text-gray-600">
                              By Admin • {formatDate(note.added_at)}
                            </span>
                          </div>
                          <p className="text-gray-800 text-sm sm:text-base">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>

              <div className="mb-3 sm:mb-4">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {(newStatus === 'shipped' || newStatus === 'delivered') && (
                <div className="mb-3 sm:mb-4">
                  <label className="block text-sm font-medium mb-2">Tracking Number (Optional)</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={updateOrderStatus}
                  disabled={updating || !newStatus}
                  className="flex-1 bg-blue-500 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 text-sm sm:text-base font-medium transition-colors"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg hover:bg-gray-400 text-sm sm:text-base font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-red-600">Cancel Order</h3>

              <div className="mb-3 sm:mb-4">
                <label className="block text-sm font-medium mb-2">Reason for Cancellation</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason for cancellation"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 sm:h-24 resize-none text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={cancelOrder}
                  disabled={updating || !cancelReason.trim()}
                  className="flex-1 bg-red-500 text-white py-2 sm:py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-300 text-sm sm:text-base font-medium transition-colors"
                >
                  {updating ? 'Cancelling...' : 'Cancel Order'}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg hover:bg-gray-400 text-sm sm:text-base font-medium transition-colors"
                >
                  Keep Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Note Modal */}
      <AnimatePresence>
        {showNoteModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Add Admin Note</h3>

              <div className="mb-3 sm:mb-4">
                <label className="block text-sm font-medium mb-2">Note</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Enter your note..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 sm:h-32 resize-none text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={addAdminNote}
                  disabled={updating || !adminNote.trim()}
                  className="flex-1 bg-green-500 text-white py-2 sm:py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-300 text-sm sm:text-base font-medium transition-colors"
                >
                  {updating ? 'Adding...' : 'Add Note'}
                </button>
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg hover:bg-gray-400 text-sm sm:text-base font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Verification Modal */}
      <AnimatePresence>
        {showVerificationModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Verify Payment Proof</h3>

              <div className="mb-3 sm:mb-4">
                <label className="block text-sm font-medium mb-2">Verification Status</label>
                <select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Status</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="mb-3 sm:mb-4">
                <label className="block text-sm font-medium mb-2">Admin Notes (Optional)</label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Add verification notes..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 sm:h-24 resize-none text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={verifyPaymentProof}
                  disabled={updating || !verificationStatus}
                  className="flex-1 bg-purple-500 text-white py-2 sm:py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-300 text-sm sm:text-base font-medium transition-colors"
                >
                  {updating ? 'Verifying...' : 'Verify Payment'}
                </button>
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg hover:bg-gray-400 text-sm sm:text-base font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderDetailsPage;
