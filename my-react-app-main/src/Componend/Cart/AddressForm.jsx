import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/GoogleAuth';
import { useNavigate } from 'react-router-dom';

const AddressForm = ({ onBack, onSave, initialData, onClose }) => {
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
      const cleanData = {
        name: String(initialData.name || ''),
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
    setForm((prev) => ({ ...prev, [name]: String(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate('/auth');
      return;
    }

    setLoading(true);

    // Basic validation
    if (!form.name || !form.phone || !form.province || !form.city || !form.zone || !form.address) {
      alert('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const addressPayload = {
      type: form.label === 'OFFICE' ? 'work' : form.label.toLowerCase(),
      fullName: String(form.name),
      phone: String(form.phone),
      address: String(form.address),
      city: String(form.city),
      postalCode: `${String(form.province)} - ${String(form.city)} - ${String(form.zone)}`,
      country: 'Bangladesh',
      isDefault: false,
    };

    try {
      // Determine if it's an update or create
      const isUpdate = initialData && initialData._id;
      const url = isUpdate
        ? `https://apii.ravorin.com/api/v1/user/addresses/${initialData._id}`
        : 'https://apii.ravorin.com/api/v1/user/addresses';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(addressPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to save address: ${res.status}`);
      }

      const result = await res.json();
      setSuccess(true);

      // Call onSave with the result if provided
      if (onSave && typeof onSave === 'function') {
        onSave(result.address);
      }

      // Close the form/modal after a short delay
      setTimeout(() => {
        setSuccess(false);
        // Prioritize onClose for closing, fallback to onBack
        if (onClose && typeof onClose === 'function') {
          onClose();
        } else if (onBack && typeof onBack === 'function') {
          onBack();
        }
      }, 1500);

    } catch (err) {
      console.error('❌ Address submit error:', err);
      if (err.message.includes('Not authorized')) {
        navigate('/auth');
      } else {
        alert(`Something went wrong: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Unified close handler
  const handleClose = () => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    } else if (onBack && typeof onBack === 'function') {
      onBack();
    }
  };

  return (
    <div className="text-white text-[11px] p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {initialData ? 'Edit Address' : 'Add New Address'}
        </h2>
        <button
          type="button"
          className="text-blue-400 text-xs hover:text-blue-300"
          onClick={handleClose} // Use unified close handler
        >
          Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#0d0f1c] p-6 rounded grid md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block mb-1">Full Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="bg-black border border-gray-600 w-full px-2 py-1 rounded focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">Province / Region *</label>
          <input
            name="province"
            value={form.province}
            onChange={handleChange}
            required
            placeholder="e.g., Dhaka"
            className="bg-black border border-gray-600 w-full px-2 py-1 rounded focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">Phone Number *</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            type="tel"
            placeholder="01XXXXXXXXX"
            className="bg-black border border-gray-600 w-full px-2 py-1 rounded focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">City *</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            placeholder="e.g., Dhaka - Farmgate"
            className="bg-black border border-gray-600 w-full px-2 py-1 rounded focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">Landmark (Optional)</label>
          <input
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            placeholder="e.g., Near mosque, school"
            className="bg-black border border-gray-600 w-full px-2 py-1 rounded focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">Zone *</label>
          <input
            name="zone"
            value={form.zone}
            onChange={handleChange}
            required
            placeholder="e.g., Farmgate"
            className="bg-black border border-gray-600 w-full px-2 py-1 rounded focus:border-blue-500 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1">Address *</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="House/Flat no, Road no, Area"
            className="bg-black border border-gray-600 w-full px-2 py-1 rounded focus:border-blue-500 outline-none"
          />
        </div>

        <div className="md:col-span-2 mt-2">
          <label className="block mb-1">
            Select a label for effective delivery:
          </label>
          <div className="flex gap-4 mt-1">
            <button
              type="button"
              className={`px-4 py-2 rounded border flex items-center gap-1 transition-colors ${
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
              className={`px-4 py-2 rounded border flex items-center gap-1 transition-colors ${
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

        <div className="md:col-span-2 flex gap-3 justify-end mt-4">
          <button
            type="button"
            onClick={handleClose} // Use unified close handler
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded text-white font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed px-6 py-2 rounded text-white font-semibold transition-colors"
          >
            {loading ? 'Saving...' : 'SAVE ADDRESS'}
          </button>
        </div>

        {success && (
          <div className="md:col-span-2 text-green-400 text-center mt-2 bg-green-500/10 border border-green-500/20 rounded p-2">
            ✅ Address saved successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default AddressForm;







