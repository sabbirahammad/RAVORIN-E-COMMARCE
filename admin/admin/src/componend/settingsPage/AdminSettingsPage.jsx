import { useState, useEffect } from 'react';

const AdminSettingsPage = () => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('admin-settings');
    return saved
      ? JSON.parse(saved)
      : {
          siteTitle: 'My E-Commerce Admin',
          supportEmail: 'support@example.com',
          currency: '৳',
          theme: 'light',
          notifications: true,
          language: 'en',
        };
  });

  useEffect(() => {
    localStorage.setItem('admin-settings', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <h2 className="text-3xl font-bold text-gray-800">Admin Settings</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-xl border shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Site Title
          </label>
          <input
            type="text"
            name="siteTitle"
            value={formData.siteTitle}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Support Email
          </label>
          <input
            type="email"
            name="supportEmail"
            value={formData.supportEmail}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Currency Symbol
          </label>
          <input
            type="text"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Theme</label>
          <select
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="notifications"
            checked={formData.notifications}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Enable Email Notifications
          </label>
        </div>

        <button
          type="submit"
          className="px-6 py-2 flex items-center gap-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
