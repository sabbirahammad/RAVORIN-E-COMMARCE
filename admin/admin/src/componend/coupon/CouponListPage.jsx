import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ConfirmationModal from '../shared/ConfirmationModal'; // Optional modal

const CouponListPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingCoupon, setDeletingCoupon] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('https://apii.ravorin.com/coupons');
      setCoupons(res.data);
    } catch (err) {
      console.error('Failed to fetch coupons', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://apii.ravorin.com/coupons/${deletingCoupon.id}`);
      setCoupons((prev) => prev.filter((c) => c.id !== deletingCoupon.id));
      setDeletingCoupon(null);
    } catch (err) {
      console.error('Failed to delete coupon', err);
    }
  };

  const toggleActive = async (coupon) => {
    try {
      const updated = { ...coupon, active: !coupon.active };
      await axios.put(`https://apii.ravorin.com/coupons/${coupon.id}`, updated);
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? updated : c))
      );
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(search.toLowerCase()) ||
      coupon.expiry.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Coupons</h2>
        <Link
          to="/admin/coupons/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} /> Add Coupon
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by code or expiry..."
          className="border px-4 py-2 rounded-md w-full max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading coupons...</p>
      ) : filteredCoupons.length === 0 ? (
        <p className="text-gray-500">No coupons found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border bg-white rounded-xl">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Code</th>
                <th className="p-3">Discount (%)</th>
                <th className="p-3">Expiry</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon, index) => (
                <tr key={coupon.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-semibold">{coupon.code}</td>
                  <td className="p-3">{coupon.discount}%</td>
                  <td className="p-3">{coupon.expiry}</td>
                  <td className="p-3">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={coupon.active}
                        onChange={() => toggleActive(coupon)}
                        className="sr-only"
                      />
                      <div className={`w-10 h-5 rounded-full transition ${coupon.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transform transition ${coupon.active ? 'translate-x-5' : 'translate-x-1'}`}></div>
                      </div>
                    </label>
                  </td>
                  <td className="p-3 flex items-center justify-center gap-2">
                    <Link
                      to={`/admin/coupons/edit/${coupon.id}`}
                      className="p-1.5 rounded hover:bg-gray-100 text-blue-600"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => setDeletingCoupon(coupon)}
                      className="p-1.5 rounded hover:bg-red-100 text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deletingCoupon && (
        <ConfirmationModal
          message={`Delete coupon "${deletingCoupon.code}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingCoupon(null)}
        />
      )}
    </div>
  );
};

export default CouponListPage;





