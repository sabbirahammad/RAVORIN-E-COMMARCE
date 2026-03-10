import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditCouponPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: '',
    discount: '',
    expiry: '',
    active: true,
  });

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const numericId = Number(id);
        const res = await axios.get(`https://apii.ravorin.com/coupons/${numericId}`);
        setForm(res.data);
      } catch (err) {
        console.error('Failed to fetch coupon', err);
        alert('Coupon not found. Please check the ID.');
      }
    };
    fetchCoupon();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const numericId = Number(id);
      await axios.put(`https://apii.ravorin.com/coupons/${numericId}`, {
        id: numericId,
        ...form,
        discount: Number(form.discount),
      });
      alert('Coupon updated successfully!');
      navigate('/admin/coupons');
    } catch (err) {
      console.error('Failed to update coupon', err);
      alert('Failed to update coupon');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white border p-6 mt-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Coupon</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Code</label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input
            type="date"
            name="expiry"
            value={form.expiry}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />
          <label className="text-sm text-gray-700">Active</label>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Coupon
        </button>
      </form>
    </div>
  );
};

export default EditCouponPage;


