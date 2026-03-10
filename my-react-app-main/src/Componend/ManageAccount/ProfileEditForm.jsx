import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../Context/GoogleAuth';
import { useNavigate } from 'react-router-dom';

const ProfileEditForm = ({ profile = {}, setProfile = () => {}, onSave = () => {} }) => {
  const defaultBirthday = '';
  const [localProfile, setLocalProfile] = useState({
    ...profile,
    birthday: profile.birthday || defaultBirthday,
    gender: profile.gender || '',
    phone: profile.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLocalProfile({
      ...profile,
      birthday: profile.birthday || defaultBirthday,
      gender: profile.gender || '',
      phone: profile.phone || '',
    });
  }, [profile]);

  const months = useMemo(
    () => [...Array(12)].map((_, i) => new Date(0, i).toLocaleString('default', { month: 'long' })),
    []
  );

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - i);
  }, []);

  const getDateComponent = (component) => {
    if (!localProfile.birthday) return '';

    const date = new Date(localProfile.birthday);
    if (Number.isNaN(date.getTime())) return '';

    switch (component) {
      case 'month':
        return date.toLocaleString('default', { month: 'long' });
      case 'day':
        return date.getDate();
      case 'year':
        return date.getFullYear();
      default:
        return '';
    }
  };

  const handleBirthdayChange = (type, value) => {
    const currentBirthday = localProfile.birthday ? new Date(localProfile.birthday) : new Date();
    const fallbackDate = Number.isNaN(currentBirthday.getTime()) ? new Date() : currentBirthday;
    const nextBirthday = new Date(fallbackDate);

    if (type === 'month') nextBirthday.setMonth(months.indexOf(value));
    if (type === 'day') nextBirthday.setDate(Number(value));
    if (type === 'year') nextBirthday.setFullYear(Number(value));

    if (!Number.isNaN(nextBirthday.getTime())) {
      const formattedDate = `${nextBirthday.getFullYear()}-${String(nextBirthday.getMonth() + 1).padStart(2, '0')}-${String(nextBirthday.getDate()).padStart(2, '0')}`;
      setLocalProfile((prev) => ({ ...prev, birthday: formattedDate }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate('/auth');
      return;
    }

    const validationErrors = {};
    if (!localProfile.name) validationErrors.name = 'Full Name is required';
    if (!localProfile.email) validationErrors.email = 'Email is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const payload = {
      name: localProfile.name,
      email: localProfile.email,
      phone: localProfile.phone || '',
      birthday: localProfile.birthday || '',
      gender: localProfile.gender || '',
    };

    try {
      const response = await fetch('https://apii.ravorin.com/api/v1/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }

      const data = await response.json();
      const updatedProfile = {
        ...localProfile,
        name: data.user?.name || payload.name,
        email: data.user?.email || payload.email,
        phone: data.user?.phone || payload.phone,
        birthday: data.user?.birthday || payload.birthday,
        gender: data.user?.gender || payload.gender,
      };

      setProfile(updatedProfile);
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      setSuccess(true);
      onSave();
    } catch (error) {
      console.error('Profile update failed:', error);
      if (error.message.includes('Not authorized')) {
        navigate('/auth');
      } else {
        alert(`Profile update failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="rounded-lg bg-[#0d0f1c] p-4 shadow-lg sm:p-6">
      <h2 className="mb-4 text-[14px] font-semibold text-white sm:text-[16px]">Edit Profile</h2>

      <form className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4" onSubmit={handleSubmit}>
        <div className="sm:col-span-2">
          <label htmlFor="name" className="mb-1 block text-[10px] text-white sm:text-[11px]">Full Name *</label>
          <input
            id="name"
            type="text"
            value={localProfile.name || ''}
            onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
            className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 text-[10px] text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-[11px]"
            placeholder="Enter your full name"
          />
          {errors.name && <span className="mt-1 block text-[9px] text-red-500 sm:text-[10px]">{errors.name}</span>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className="mb-1 block text-[10px] text-white sm:text-[11px]">Email Address *</label>
          <input
            id="email"
            type="email"
            value={localProfile.email || ''}
            onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
            className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 text-[10px] text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-[11px]"
            placeholder="Enter your email address"
          />
          {errors.email && <span className="mt-1 block text-[9px] text-red-500 sm:text-[10px]">{errors.email}</span>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-[10px] text-white sm:text-[11px]">Mobile</label>
          <input
            id="phone"
            type="tel"
            value={localProfile.phone || ''}
            onChange={(e) => setLocalProfile({ ...localProfile, phone: e.target.value })}
            className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 text-[10px] text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-[11px]"
            placeholder="Enter your mobile number"
          />
        </div>

        <div>
          <label htmlFor="gender" className="mb-1 block text-[10px] text-white sm:text-[11px]">Gender</label>
          <select
            id="gender"
            value={localProfile.gender || ''}
            onChange={(e) => setLocalProfile({ ...localProfile, gender: e.target.value })}
            className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 text-[10px] text-white focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-[11px]"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-[10px] text-white sm:text-[11px]">Birthday</label>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={getDateComponent('month')}
              onChange={(e) => handleBirthdayChange('month', e.target.value)}
              className="rounded border border-gray-700 bg-gray-900 px-2 py-2 text-[10px] text-white focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-[11px]"
            >
              <option value="">Month</option>
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>

            <select
              value={getDateComponent('day')}
              onChange={(e) => handleBirthdayChange('day', e.target.value)}
              className="rounded border border-gray-700 bg-gray-900 px-2 py-2 text-[10px] text-white focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-[11px]"
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            <select
              value={getDateComponent('year')}
              onChange={(e) => handleBirthdayChange('year', e.target.value)}
              className="rounded border border-gray-700 bg-gray-900 px-2 py-2 text-[10px] text-white focus:outline-none focus:ring-2 focus:ring-orange-500 sm:text-[11px]"
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-center sm:col-span-2 sm:justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded px-4 py-2 text-[10px] font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed sm:w-auto sm:px-6 sm:text-[11px] ${
              loading ? 'bg-gray-500' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {loading ? 'Saving...' : success ? 'Saved!' : 'SAVE CHANGES'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
