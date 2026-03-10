import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddCouponPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    code: '',
    discount: '',
    expiry: '',
    active: true,
  });

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
      await axios.post('https://apii.ravorin.com/coupons', {
        ...form,
        discount: Number(form.discount),
      });
      alert('Coupon added!');
      navigate('/admin/coupons');
    } catch (err) {
      console.error('Add failed', err);
      alert('Failed to add coupon');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white border p-6 mt-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Add Coupon</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="code" value={form.code} onChange={handleChange} placeholder="Code" className="w-full border px-3 py-2 rounded" required />
        <input type="number" name="discount" value={form.discount} onChange={handleChange} placeholder="Discount %" className="w-full border px-3 py-2 rounded" required />
        <input type="date" name="expiry" value={form.expiry} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
          <span>Active</span>
        </label>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
      </form>
    </div>
  );
};

export default AddCouponPage;

