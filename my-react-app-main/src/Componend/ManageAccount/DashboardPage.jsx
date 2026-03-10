import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarMenu from './SidebarMenu';
import AccountInfoBoxes from './AccountInfoBoxes';
import RecentOrdersTable from './RecentOrdersTable';
import ProfileEditForm from './ProfileEditForm';
import EditAddressForm from './EditAddressForm';
import PaymentOption from './PaymentOption';
import MyReturns from './MyReturns';
import MyCancellations from './MyCancellations';
import OrderDetailsPage from './OrderDetailsPage';
import MyReviews from './MyReviews';
import MyWishlist from './MyWishlist';
import AllOrders from './AllOrders';
import Navbar from '../Products/Navbar';
import SearchBar from './Searchbar';
import { useAuth } from '../../Context/GoogleAuth';

const DashboardPage = () => {
  const navigate = useNavigate();

  const [addressList, setAddressList] = useState([]);  // Ensure it's an array
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',  // Store birthday as a string (e.g., "2025-07-23")
    gender: '',
  });
  const {token} = useAuth();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const storedProfile = localStorage.getItem('profile');
    const storedAddressList = localStorage.getItem('addressList');

    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile((prev) => ({ ...prev, ...parsedProfile }));
      } catch (error) {
        console.error('Error parsing stored profile:', error);
      }
    }

    if (storedAddressList) {
      try {
        const parsedAddressList = JSON.parse(storedAddressList);
        if (Array.isArray(parsedAddressList)) {
          setAddressList(parsedAddressList);
        }
      } catch (error) {
        console.error('Error parsing stored addresses:', error);
      }
    }
  }, []);

  // Load data from backend
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        // Fetching the profile data from the backend
        const profileResponse = await axios.get('https://apii.ravorin.com/api/v1/user/profile',{
           headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (profileResponse.data.success) {
          const user = profileResponse.data.user || {};
          setProfile((prev) => ({
            ...prev,
            name: user.name || prev.name || '',
            email: user.email || prev.email || '',
            phone: user.phone || prev.phone || '',
            birthday: user.birthday || prev.birthday || '',
            gender: user.gender || prev.gender || '',
          }));
        }

        // Fetching address list from the backend
        const addressResponse = await axios.get('https://apii.ravorin.com/api/v1/user/addresses',{
           headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (addressResponse.data.success) {
          setAddressList(addressResponse.data.addresses);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          navigate('/auth');
        } else {
          alert('Error loading data');
        }
      }
    };

    fetchData();
  }, [token, navigate]);

  // Persist changes (Optional if you want to save locally)
  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('addressList', JSON.stringify(addressList));
  }, [addressList]);

  // Handle body scroll lock for mobile sidebar
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileSidebarOpen]);

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileSidebarOpen]);

  const handleAddNewAddress = (newAddress) => {
    setAddressList((prev) => {
      // Ensure prev is an array before using it
      return Array.isArray(prev) ? [...prev, newAddress] : [newAddress];
    });
  };

  return (
    <div>
      <Navbar />
      <SearchBar />
      <div className="flex bg-[#0a0a13] min-h-screen text-white">
        {/* Desktop Sidebar - Hidden on mobile/tablet */}
        <div className="hidden lg:block">
          <SidebarMenu />
        </div>

        {/* Mobile Sidebar Overlay */}
        <div
          className={`lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
            isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div
            className={`bg-[#0d0f1c] w-80 h-full p-4 overflow-y-auto transform transition-transform duration-300 ${
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sidebar
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-lg font-semibold">Menu</h2>
              <button
                className="text-white text-xl hover:text-gray-300 transition-colors"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                ×
              </button>
            </div>
            <SidebarMenu />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-10 p-2 sm:p-4 lg:p-6">
          {/* Mobile Header with Menu Button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <button
              className="bg-[#0d0f1c] text-white p-2 rounded-md hover:bg-[#1a1f24] transition-colors"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              ☰ Menu
            </button>
            <h1 className="text-white text-lg font-semibold">My Account</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>

          <Routes>
            <Route
              path="/dashboard"
              element={
                <>
                  <AccountInfoBoxes
                    addressList={addressList}
                    setAddressList={setAddressList}
                    profile={profile}
                    setProfile={setProfile}
                  />
                  <div className="mt-4 sm:mt-6">
                    <RecentOrdersTable />
                  </div>
                </>
              }
            />

            <Route
              path="/profilecart"
              element={
                <ProfileEditForm
                  profile={profile}
                  setProfile={setProfile}
                  onSave={() => navigate('/dashboard')}
                />
              }
            />

            <Route
              path="/addresses"
              element={
                <EditAddressForm
                  initialData={null}
                  onBack={() => navigate('/dashboard')}
                  onSave={handleAddNewAddress}
                />
              }
            />

            <Route
              path="/payments"
              element={
                <PaymentOption
                  selectedMethod={selectedPaymentMethod}
                  onSelect={setSelectedPaymentMethod}
                />
              }
            />
             <Route
              path="/payments/:id"
              element={
                <PaymentOption
                  selectedMethod={selectedPaymentMethod}
                  onSelect={setSelectedPaymentMethod}
                />
              }
            />

            <Route
              path="*"
              element={
                <>
                  <AccountInfoBoxes
                    addressList={addressList}
                    setAddressList={setAddressList}
                    profile={profile}
                    setProfile={setProfile}
                  />
                  <div className="mt-4 sm:mt-6">
                    <RecentOrdersTable />
                  </div>
                </>
              }
            />
            <Route path='/returns' element={<MyReturns />} />
            <Route path='/cancellations' element={<MyCancellations />} />
            <Route path="/order/:id" element={<OrderDetailsPage />} />
            <Route path="/reviews" element={<MyReviews />} />
            <Route path="/wishlist" element={<MyWishlist />} />
            <Route path="/orders" element={<AllOrders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;









