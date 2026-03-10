import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DeliveryCostSettings = () => {
  const [deliveryCosts, setDeliveryCosts] = useState({
    dhakaInside: 60,
    dhakaOutside: 120
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDeliveryCosts();
  }, []);

  const fetchDeliveryCosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://apii.ravorin.com/api/v1/admin/delivery-costs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDeliveryCosts(data.deliveryCosts);
        }
      }
    } catch (error) {
      console.error('Error fetching delivery costs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');

      const token = localStorage.getItem('token');
      const response = await fetch('https://apii.ravorin.com/api/v1/admin/delivery-costs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deliveryCosts)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessage('Delivery costs updated successfully!');
          setTimeout(() => setMessage(''), 3000);
        }
      } else {
        setMessage('Failed to update delivery costs');
      }
    } catch (error) {
      console.error('Error saving delivery costs:', error);
      setMessage('Error saving delivery costs');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setDeliveryCosts(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delivery costs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Delivery Cost Settings</h1>
          <p className="text-gray-600">Manage delivery costs for different locations</p>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-6">
            {/* Dhaka Inside */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dhaka Inside Delivery Cost (৳)
              </label>
              <input
                type="number"
                value={deliveryCosts.dhakaInside}
                onChange={(e) => handleInputChange('dhakaInside', e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="60"
                min="0"
                step="0.01"
              />
              <p className="text-sm text-gray-500 mt-1">
                Delivery cost for orders within Dhaka city
              </p>
            </div>

            {/* Dhaka Outside */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dhaka Outside Delivery Cost (৳)
              </label>
              <input
                type="number"
                value={deliveryCosts.dhakaOutside}
                onChange={(e) => handleInputChange('dhakaOutside', e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="120"
                min="0"
                step="0.01"
              />
              <p className="text-sm text-gray-500 mt-1">
                Delivery cost for orders outside Dhaka city
              </p>
            </div>

            {/* Current Settings Display */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-600">Dhaka Inside</p>
                  <p className="text-xl font-bold text-green-600">৳{deliveryCosts.dhakaInside}</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-600">Dhaka Outside</p>
                  <p className="text-xl font-bold text-blue-600">৳{deliveryCosts.dhakaOutside}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={fetchDeliveryCosts}
                disabled={loading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Refresh
              </button>
            </div>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg ${
                  message.includes('success')
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {message}
              </motion.div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">How It Works</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Delivery costs are automatically calculated based on the shipping address</li>
            <li>• If the city contains "Dhaka", it uses "Dhaka Inside" cost</li>
            <li>• Otherwise, it uses "Dhaka Outside" cost</li>
            <li>• Total order amount = Subtotal + Delivery Cost</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DeliveryCostSettings;
