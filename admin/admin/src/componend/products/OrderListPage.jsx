import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, Pencil, Trash2, Download } from 'lucide-react';

// Simple spinner component
const Spinner = () => (
  <div className="text-center py-10 text-gray-500">Loading...</div>
);

// Modal Wrapper
const Modal = ({ children, onClose }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  >
    <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-[90%] max-w-md">
      {children}
    </div>
  </div>
);

const AdminOrderPage = () => {
  // Simulated admin login state
  const [isAdmin, setIsAdmin] = useState(true); // Replace with your real auth logic
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected for bulk delete
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [deletingOrder, setDeletingOrder] = useState(null);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://apii.ravorin.com/api/v1/orders'); // adjust API
        setOrders(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    if (isAdmin) fetchOrders();
  }, [isAdmin]);

  // Filter + Search
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle select/deselect order for bulk actions
  const toggleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Handle select all on current page
  const toggleSelectAll = () => {
    const currentPageOrderIds = paginatedOrders.map((o) => o.id);
    const allSelected = currentPageOrderIds.every((id) => selectedOrders.includes(id));
    if (allSelected) {
      setSelectedOrders((prev) => prev.filter((id) => !currentPageOrderIds.includes(id)));
    } else {
      setSelectedOrders((prev) => [...new Set([...prev, ...currentPageOrderIds])]);
    }
  };

  // Update order status API call
  const handleStatusUpdate = async () => {
    try {
      const response = await axios.patch(
        `https://apii.ravorin.com/orders/${editingOrder.id}`,
        { status: updatedStatus }
      );
      setOrders((prev) =>
        prev.map((order) => (order.id === editingOrder.id ? response.data : order))
      );
      setEditingOrder(null);
      setUpdatedStatus('');
    } catch (error) {
      alert('Error updating order status');
    }
  };

  // Delete single order
  const handleDeleteOrder = async () => {
    try {
      await axios.delete(`https://apii.ravorin.com/orders/${deletingOrder.id}`);
      setOrders((prev) => prev.filter((o) => o.id !== deletingOrder.id));
      setDeletingOrder(null);
      setSelectedOrders((prev) => prev.filter(id => id !== deletingOrder.id));
    } catch (error) {
      alert('Error deleting order');
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedOrders.length} selected orders?`)) return;

    try {
      await Promise.all(
        selectedOrders.map((id) => axios.delete(`https://apii.ravorin.com/orders/${id}`))
      );
      setOrders((prev) => prev.filter((o) => !selectedOrders.includes(o.id)));
      setSelectedOrders([]);
    } catch (error) {
      alert('Failed to delete some orders');
    }
  };

  // Handle page change
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (!isAdmin) {
    return (
      <div className="p-10 text-center text-red-600">
        Access denied. Please login as admin.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Admin Orders</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <input
            type="text"
            placeholder="Search by customer or order ID"
            className="border rounded px-3 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={handleBulkDelete}
            disabled={selectedOrders.length === 0}
            className={`px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50`}
          >
            Delete Selected ({selectedOrders.length})
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={
                        paginatedOrders.length > 0 &&
                        paginatedOrders.every((order) => selectedOrders.includes(order.id))
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-100">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelectOrder(order.id)}
                      />
                    </td>
                    <td className="p-3">{order.id}</td>
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3">৳{order.total}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'returned'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">{order.date}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded hover:bg-gray-100"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingOrder(order);
                          setUpdatedStatus(order.status);
                        }}
                        className="p-1.5 rounded hover:bg-gray-100"
                        title="Edit Status"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setDeletingOrder(order)}
                        className="p-1.5 rounded hover:bg-red-100 text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* View Modal */}
      {selectedOrder && (
        <Modal onClose={() => setSelectedOrder(null)}>
          <h3 className="text-lg font-semibold mb-4">Order Details</h3>
          <p><strong>Order ID:</strong> {selectedOrder.id}</p>
          <p><strong>Customer:</strong> {selectedOrder.customer}</p>
          <p><strong>Total:</strong> ৳{selectedOrder.total}</p>
          <p><strong>Status:</strong> {selectedOrder.status}</p>
          <p><strong>Date:</strong> {selectedOrder.date}</p>
          <button
            onClick={() => setSelectedOrder(null)}
            className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Close
          </button>
        </Modal>
      )}

      {/* Edit Modal */}
      {editingOrder && (
        <Modal onClose={() => setEditingOrder(null)}>
          <h3 className="text-lg font-semibold mb-4">Edit Order Status</h3>
          <p className="mb-2 text-sm">Order ID: {editingOrder.id}</p>

          <select
            value={updatedStatus}
            onChange={(e) => setUpdatedStatus(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditingOrder(null)}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingOrder && (
        <Modal onClose={() => setDeletingOrder(null)}>
          <h3 className="text-lg font-semibold mb-4 text-red-600">Confirm Delete</h3>
          <p className="text-sm text-gray-700 mb-4">
            Are you sure you want to delete order <strong>{deletingOrder.id}</strong> from{' '}
            <strong>{deletingOrder.customer}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeletingOrder(null)}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteOrder}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminOrderPage;


