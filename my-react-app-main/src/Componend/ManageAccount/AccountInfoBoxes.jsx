import React, { useState } from 'react';
import EditAddressForm from './EditAddressForm';
import ProfileEditForm from './ProfileEditForm';
import { useAuth } from '../../Context/GoogleAuth';
import { useNavigate } from 'react-router-dom';

const AccountInfoBoxes = ({ addressList, setAddressList, profile, setProfile }) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddressTable, setEditingAddressTable] = useState(false);
  const [editingAddressForm, setEditingAddressForm] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, index: null });
  const [deletingIndex, setDeletingIndex] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Parse the birthday string into a Date object if it's a valid string
  const birthday = profile?.birthday ? new Date(profile.birthday) : null;
  const birthdayMonth = birthday ? birthday.toLocaleString('default', { month: 'long' }) : '';
  const birthdayDay = birthday ? birthday.getDate() : '';
  const birthdayYear = birthday ? birthday.getFullYear() : '';

  // Ensure addressList is an array
  const validAddressList = Array.isArray(addressList) ? addressList : [];

  // Fetch address at index 1 if it exists, otherwise use index 0
  const defaultAddress = validAddressList[1] || validAddressList[0];

  const getAddressName = (address) => String(address?.fullName || address?.name || '');
  const getAddressLabel = (address) =>
    String(address?.label || address?.tag || address?.type || 'HOME').toUpperCase();

  const handleEditAddress = (index) => {
    setSelectedAddressIndex(index);
    setEditingAddressTable(false); // Close the table view
    setEditingAddressForm(true);
  };

  const handleAddNewAddress = () => {
    setSelectedAddressIndex(null);
    setEditingAddressTable(false); // Close the table view
    setEditingAddressForm(true);
  };

  const handleSaveAddress = (savedAddress) => {
    if (selectedAddressIndex !== null) {
      // Update existing address
      setAddressList((prev) => {
        const updated = [...prev];
        updated[selectedAddressIndex] = savedAddress;
        return updated;
      });
    } else {
      // Add new address
      setAddressList((prev) => [savedAddress, ...prev]);
    }
    
    // Reset states
    setSelectedAddressIndex(null);
    setEditingAddressForm(false);
    setEditingAddressTable(false);
  };

  const handleBackFromForm = () => {
    setSelectedAddressIndex(null);
    setEditingAddressForm(false);
    // Don't automatically go back to table, let user choose
  };

  const handleDeleteAddress = async (index) => {
    if (!token) {
      navigate('/auth');
      return;
    }

    const addressToDelete = validAddressList[index];
    setDeletingIndex(index);

    try {
      // Assuming the address has an ID field for API deletion
      const addressId = addressToDelete._id;

      if (!addressId) {
        // If no ID, just remove from local state
        setAddressList(prev => prev.filter((_, i) => i !== index));
        setDeleteConfirmation({ show: false, index: null });
        return;
      }

      const response = await fetch(`https://apii.ravorin.com/api/v1/user/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete address from server');
      }

      // Remove from local state after successful API call
      setAddressList(prev => prev.filter((_, i) => i !== index));

      // Close confirmation modal
      setDeleteConfirmation({ show: false, index: null });

    } catch (error) {
      console.error('❌ Delete address error:', error.message);
      if (error.message.includes('Not authorized')) {
        navigate('/auth');
      } else {
        alert(`Failed to delete address: ${error.message}`);
      }
    } finally {
      setDeletingIndex(null);
    }
  };

  const showDeleteConfirmation = (index) => {
    setDeleteConfirmation({ show: true, index });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, index: null });
  };

  // If editing address form, show only the form
  if (editingAddressForm) {
    return (
      <div className="flex-1 text-[11px] text-white px-4 pt-4">
        <EditAddressForm
          initialData={selectedAddressIndex !== null ? validAddressList[selectedAddressIndex] : null}
          onBack={handleBackFromForm}
          onSave={handleSaveAddress}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 text-[10px] sm:text-[11px] text-white px-2 sm:px-4 pt-4 space-y-3 sm:space-y-4">
      <h2 className="text-[14px] sm:text-[16px] font-semibold mb-2">Manage My Account</h2>

      {/* PERSONAL PROFILE SECTION */}
      <div className="bg-[#0d0f1c] p-3 sm:p-4 rounded shadow-sm">
        <h3 className="font-semibold mb-2 text-[11px] sm:text-[12px]">
          Personal Profile{' '}
          {!editingProfile && (
            <span
              className="text-blue-400 cursor-pointer text-[9px] sm:text-[10px] hover:text-blue-300"
              onClick={() => setEditingProfile(true)}
            >
              | EDIT
            </span>
          )}
        </h3>

        {editingProfile ? (
          <ProfileEditForm
            profile={profile}
            setProfile={setProfile}
            onSave={() => setEditingProfile(false)}
          />
        ) : (
          <>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-[10px] sm:text-[11px]">{profile?.name || 'Name not set'}</p>
              <p className="text-[10px] sm:text-[11px] break-all">{profile?.email || 'Email not set'}</p>
              <p className="text-[10px] sm:text-[11px]">{profile?.phone || 'Phone not set'}</p>
              {/* Display the parsed birthday */}
              <p className="text-[10px] sm:text-[11px]">
                {birthdayMonth && birthdayDay && birthdayYear
                  ? `${birthdayMonth} ${birthdayDay}, ${birthdayYear}`
                  : 'Birthday not set'
                }
              </p>
              <p className="text-[10px] sm:text-[11px]">{profile?.gender || 'Gender not set'}</p>
              <label className="flex items-center gap-1 text-[9px] sm:text-[10px]">
                <input type="checkbox" className="accent-yellow-500" />
                <span>Receive marketing SMS</span>
              </label>
            </div>
          </>
        )}
      </div>

      {/* ADDRESS SECTION */}
      {!editingAddressTable ? (
        <div className="bg-[#0d0f1c] p-3 sm:p-4 rounded shadow-sm">
          <h3 className="font-semibold mb-2 text-[11px] sm:text-[12px]">
            Address Book{' '}
            <span
              className="text-blue-400 cursor-pointer text-[9px] sm:text-[10px] hover:text-blue-300"
              onClick={() => setEditingAddressTable(true)}
            >
              | EDIT
            </span>
          </h3>
          <p className="text-[9px] sm:text-[10px] text-gray-400">DEFAULT SHIPPING ADDRESS</p>

          {/* Display default address */}
          {defaultAddress ? (
            <div className="mt-2">
              <p className="font-semibold text-[10px] sm:text-[11px]">{getAddressName(defaultAddress)}</p>
              <p className="leading-tight text-[9px] sm:text-[10px] text-gray-300 mt-1">
                {String(defaultAddress.address || '')}<br />
                {String(defaultAddress.postcode || defaultAddress.city || '')}<br />
                <span className="text-gray-400">(+880) </span>{String(defaultAddress.phone || '')}
              </p>
            </div>
          ) : (
            <div className="text-gray-400 mt-2">
              <p className="text-[10px] sm:text-[11px]">No addresses found</p>
              <button
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] sm:text-[11px] font-semibold px-3 sm:px-4 py-2 rounded mt-2 transition-colors"
                onClick={handleAddNewAddress}
              >
                + ADD FIRST ADDRESS
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#0d0f1c] rounded p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
            <h3 className="font-semibold text-[11px] sm:text-[12px]">Manage Addresses</h3>
            <button
              className="text-blue-400 text-[9px] sm:text-[10px] hover:text-blue-300 self-end sm:self-auto"
              onClick={() => setEditingAddressTable(false)}
            >
              Back to Summary
            </button>
          </div>

          {/* Mobile: Horizontal scroll for table */}
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 min-w-[600px] px-2 py-2 border-b border-gray-800 font-semibold text-gray-300 text-[9px] sm:text-[10px]">
              <span>Full Name</span>
              <span>Address</span>
              <span>Postcode</span>
              <span>Phone Number</span>
              <span className="text-center">Edit</span>
              <span className="text-center">Delete</span>
            </div>
          </div>

          {/* Render the address list correctly */}
          <div className="overflow-x-auto">
            {validAddressList.length > 0 ? (
              validAddressList.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 min-w-[600px] px-2 py-3 border-b border-gray-800 items-center text-[9px] sm:text-[10px]"
                >
                  <span className="font-medium">{getAddressName(item)}</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-600 text-white text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      {getAddressLabel(item)}
                    </span>
                    <span className="truncate max-w-[150px] sm:max-w-none">{String(item.address || '')}</span>
                  </div>
                  <span className="whitespace-nowrap">{String(item.postcode || item.city || '')}</span>
                  <span>{String(item.phone || '')}</span>
                  <div className="flex flex-col items-center text-center space-y-1">
                    {(index === 0 || index === 1) && (
                      <>
                        <span className="text-gray-400 text-[8px] sm:text-[9px] leading-tight">Default Shipping</span>
                        <span className="text-gray-400 text-[8px] sm:text-[9px] leading-tight">Default Billing</span>
                      </>
                    )}
                    <button
                      onClick={() => handleEditAddress(index)}
                      className="text-blue-400 hover:text-blue-300 text-[9px] sm:text-[10px] cursor-pointer transition-colors"
                    >
                      EDIT
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => showDeleteConfirmation(index)}
                      disabled={deletingIndex === index}
                      className="text-red-400 hover:text-red-300 disabled:text-red-200 disabled:cursor-not-allowed text-[9px] sm:text-[10px] cursor-pointer transition-colors px-2 py-1 rounded"
                      title="Delete this address"
                    >
                      {deletingIndex === index ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 py-4 text-center text-[10px] sm:text-[11px]">No addresses available</div>
            )}
          </div>

          <div className="text-center sm:text-right mt-4">
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] sm:text-[11px] font-semibold px-3 sm:px-4 py-2 rounded transition-colors w-full sm:w-auto"
              onClick={handleAddNewAddress}
            >
              + ADD NEW ADDRESS
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0f1c] border border-gray-600 rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-red-400">Confirm Delete</h3>
            <p className="text-gray-300 mb-4 text-[10px] sm:text-[11px]">
              Are you sure you want to delete this address?
            </p>
            {validAddressList[deleteConfirmation.index] && (
              <div className="bg-gray-800 p-3 rounded mb-4 text-[10px] sm:text-[11px]">
                <p className="font-semibold">{getAddressName(validAddressList[deleteConfirmation.index])}</p>
                <p className="text-gray-400 mt-1">{String(validAddressList[deleteConfirmation.index].address || '')}</p>
                <p className="text-gray-400">{String(validAddressList[deleteConfirmation.index].postcode || validAddressList[deleteConfirmation.index].city || '')}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="bg-gray-600 hover:bg-gray-700 px-3 sm:px-4 py-2 rounded text-white text-[10px] sm:text-[11px] transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAddress(deleteConfirmation.index)}
                disabled={deletingIndex !== null}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed px-3 sm:px-4 py-2 rounded text-white text-[10px] sm:text-[11px] transition-colors order-1 sm:order-2"
              >
                {deletingIndex !== null ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountInfoBoxes;


