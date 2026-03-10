import { useState } from 'react';

const AddCouponForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    code: '',
    discount: '',
    expiry: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCoupon = {
      id: Date.now(),
      ...form,
      discount: Number(form.discount),
      active: true,
    };

    onAdd(newCoupon);

    setForm({
      code: '',
      discount: '',
      expiry: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border shadow">
      <h2 className="text-lg font-semibold text-gray-800">Add New Coupon</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Code</label>
        <input
          type="text"
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
        <input
          type="number"
          name="discount"
          value={form.discount}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
        <input
          type="date"
          name="expiry"
          value={form.expiry}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded mt-1"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Coupon
      </button>
    </form>
  );
};

export default AddCouponForm;


