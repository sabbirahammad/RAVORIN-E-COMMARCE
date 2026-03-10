import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/GoogleAuth';
import { useNavigate } from 'react-router-dom';

const EditAddressForm = ({ onBack, onSave, initialData }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    zone: '',
    address: '',
    landmark: '',
    label: 'HOME',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const {token}=useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      // Ensure all values are strings and handle nested objects properly
      const cleanData = {
        name: String(initialData.fullName || initialData.name || ''),
        phone: String(initialData.phone || ''),
        province: String(initialData.province || ''),
        city: String(initialData.city || ''),
        zone: String(initialData.zone || ''),
        address: String(initialData.address || ''),
        landmark: String(initialData.landmark || ''),
        label: String(initialData.label || initialData.tag || 'HOME'),
      };
      setForm((prev) => ({ ...prev, ...cleanData }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure the value is always a string
    setForm((prev) => ({ ...prev, [name]: String(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate('/auth');
      return;
    }

    setLoading(true);

    const addressPayload = {
      type: form.label === 'OFFICE' ? 'work' : form.label.toLowerCase(),
      fullName: String(form.name),
      phone: String(form.phone),
      address: String(form.address),
      city: String(form.city),
      postalCode: `${String(form.province)} - ${String(form.city)} - ${String(form.zone)}`,
      country: 'Bangladesh',
      isDefault: false, // You can add logic to set default address
    };

    try {
      let res;
      if (initialData && initialData._id) {
        // Update existing address
        res = await fetch(`https://apii.ravorin.com/api/v1/user/addresses/${initialData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(addressPayload),
        });
      } else {
        // Create new address
        res = await fetch('https://apii.ravorin.com/api/v1/user/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(addressPayload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save address');
      }

      const result = await res.json();
      setSuccess(true);

      if (onSave) {
        onSave(result.address);
      }

      setTimeout(() => {
        setSuccess(false);
        if (onBack) {
          onBack(); // Automatically go back after successful save
        }
      }, 2000);
    } catch (err) {
      console.error('❌ Address submit error:', err.message);
      if (err.message.includes('Not authorized')) {
        navigate('/auth');
      } else {
        alert(`Something went wrong: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white text-[10px] sm:text-[11px] p-3 sm:p-4 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-base sm:text-lg font-semibold">
          {initialData ? 'Edit Address' : 'Add New Address'}
        </h2>
        <button
          type="button"
          className="text-blue-400 text-[10px] sm:text-xs hover:text-blue-300 self-end sm:self-auto"
          onClick={onBack}
        >
          ← Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#0d0f1c] p-4 sm:p-6 rounded grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
      >
        <div className="sm:col-span-2">
          <label className="block mb-1 text-[10px] sm:text-[11px]">Full Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="bg-gray-900 border border-gray-600 w-full px-3 py-2 rounded text-[10px] sm:text-[11px] focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block mb-1 text-[10px] sm:text-[11px]">Province / Region *</label>
          <input
            name="province"
            value={form.province}
            onChange={handleChange}
            required
            placeholder="e.g., Dhaka"
            className="bg-gray-900 border border-gray-600 w-full px-3 py-2 rounded text-[10px] sm:text-[11px] focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block mb-1 text-[10px] sm:text-[11px]">Phone Number *</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            type="tel"
            placeholder="01XXXXXXXXX"
            className="bg-gray-900 border border-gray-600 w-full px-3 py-2 rounded text-[10px] sm:text-[11px] focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block mb-1 text-[10px] sm:text-[11px]">City *</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            placeholder="e.g., Dhaka - Farmgate"
            className="bg-gray-900 border border-gray-600 w-full px-3 py-2 rounded text-[10px] sm:text-[11px] focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block mb-1 text-[10px] sm:text-[11px]">Landmark (Optional)</label>
          <input
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            placeholder="e.g., Near mosque, school"
            className="bg-gray-900 border border-gray-600 w-full px-3 py-2 rounded text-[10px] sm:text-[11px] focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block mb-1 text-[10px] sm:text-[11px]">Zone *</label>
          <input
            name="zone"
            value={form.zone}
            onChange={handleChange}
            required
            placeholder="e.g., Farmgate"
            className="bg-gray-900 border border-gray-600 w-full px-3 py-2 rounded text-[10px] sm:text-[11px] focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1 text-[10px] sm:text-[11px]">Address *</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="House/Flat no, Road no, Area"
            className="bg-gray-900 border border-gray-600 w-full px-3 py-2 rounded text-[10px] sm:text-[11px] focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="sm:col-span-2 mt-2">
          <label className="block mb-1 text-[10px] sm:text-[11px]">
            Select a label for effective delivery:
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-1">
            <button
              type="button"
              className={`px-3 sm:px-4 py-2 rounded border flex items-center justify-center gap-1 transition-colors text-[10px] sm:text-[11px] ${
                form.label === 'OFFICE'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => setForm({ ...form, label: 'OFFICE' })}
            >
              👜 OFFICE
            </button>
            <button
              type="button"
              className={`px-3 sm:px-4 py-2 rounded border flex items-center justify-center gap-1 transition-colors text-[10px] sm:text-[11px] ${
                form.label === 'HOME'
                  ? 'border-red-500 text-red-400 bg-red-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => setForm({ ...form, label: 'HOME' })}
            >
              🏠 HOME
            </button>
          </div>
        </div>

        <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end mt-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 px-4 sm:px-6 py-2 rounded text-white font-semibold transition-colors text-[10px] sm:text-[11px] order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed px-4 sm:px-6 py-2 rounded text-white font-semibold transition-colors text-[10px] sm:text-[11px] order-1 sm:order-2"
          >
            {loading ? 'Saving...' : 'SAVE ADDRESS'}
          </button>
        </div>

        {success && (
          <div className="sm:col-span-2 text-green-400 text-center mt-2 bg-green-500/10 border border-green-500/20 rounded p-2 text-[10px] sm:text-[11px]">
            ✅ Address saved successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default EditAddressForm;







