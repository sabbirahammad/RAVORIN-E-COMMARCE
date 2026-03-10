// src/Components/NavberSection/UserMenu.jsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/GoogleAuth';

const UserMenu = ({
  isDarkMode,
  activeDropdown,
  setActiveDropdown,
  compact = false,
  mobileFriendly = false,
}) => {
  const { user, logout, login, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const googleButtonRef = useRef(null);
  const containerRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // API Base URL
  const API_BASE_URL =
    window.location.hostname === 'ravorin.com' || window.location.hostname === 'www.ravorin.com'
      ? 'https://apii.ravorin.com/api/v1'
      : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1');

  // Handle URL token processing (for Google OAuth callback)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateMobileView = (event) => {
      setIsMobileView(event.matches);
    };

    setIsMobileView(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateMobileView);

    return () => {
      mediaQuery.removeEventListener('change', updateMobileView);
    };
  }, []);

  useEffect(() => {
    if (!isMobileView || activeDropdown !== 'signin') {
      return;
    }

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [activeDropdown, isMobileView, setActiveDropdown]);

  useEffect(() => {
    const handleTokenFromURL = async () => {
      const url = new URL(window.location.href);
      const token = url.searchParams.get('token');

      // Skip if no token or user already logged in
      if (!token || user) return;

      try {
        console.log('🔄 Processing token from URL...');
        
        // Decode token to get user info
        const payload = token.split('.')[1];
        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        base64 += '='.repeat((4 - base64.length % 4) % 4);
        const decoded = JSON.parse(atob(base64));

        const userInfo = {
          id: decoded.user_id || decoded.sub || decoded.id,
          email: decoded.email,
          name: decoded.name || 
                (decoded.given_name && decoded.family_name 
                  ? `${decoded.given_name} ${decoded.family_name}` 
                  : decoded.given_name || 'User'),
          given_name: decoded.given_name,
          family_name: decoded.family_name,
          picture: decoded.picture || null,
          verified_email: decoded.email_verified || false,
        };

        // Login with token
        await login(token, userInfo);
        console.log('🎉 Login successful!', userInfo);

        // Clean URL and redirect
        window.history.replaceState({}, document.title, window.location.pathname);
        
        const redirectPath = localStorage.getItem('redirect_after_login');
        localStorage.removeItem('redirect_after_login');
        
        if (redirectPath !== window.location.pathname) {
          navigate(redirectPath, { replace: true });
        }

      } catch (err) {
        console.error('❌ Token processing failed:', err);
        alert('Login failed: ' + err.message);
        logout();
      }
    };

    handleTokenFromURL();
  }, [login, logout, navigate, user]);

  useEffect(() => {
    if (user || !googleClientId || !googleButtonRef.current || activeDropdown !== 'signin') {
      return;
    }

    const initializeGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            setIsLoggingIn(true);
            localStorage.setItem('redirect_after_login', window.location.pathname);

            const result = await fetch(`${API_BASE_URL}/auth/google`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ credential: response.credential }),
            });

            const data = await result.json();
            if (!result.ok || !data.success || !data.token) {
              throw new Error(data.message || 'Google login failed');
            }

            await login(data.token, data.user);
            setActiveDropdown(null);
          } catch (err) {
            console.error('❌ Google login error:', err);
            alert(`Login failed: ${err.message}`);
          } finally {
            setIsLoggingIn(false);
          }
        },
      });

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: isDarkMode ? 'outline' : 'filled_white',
        size: 'large',
        type: 'standard',
        shape: 'pill',
        text: 'signup_with',
        width: 256,
      });
    };

    const existingScript = document.querySelector('script[data-google-identity="true"]');
    if (existingScript) {
      initializeGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.onload = initializeGoogleButton;
    document.body.appendChild(script);
  }, [API_BASE_URL, activeDropdown, googleClientId, isDarkMode, login, setActiveDropdown, user]);

  // User state
  const isSignedIn = !!user && !loading;

  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.name) return user.name;
    if (user?.given_name) return user.given_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserImage = () => {
    return user?.picture || user?.avatar || user?.photo || null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative">
        <button className="flex items-center opacity-50 cursor-default">
          <div className="w-5 h-5 mr-2 rounded-full bg-gray-400 animate-pulse"></div>
          <span className="animate-pulse">Loading...</span>
        </button>
      </div>
    );
  }

  const userName = getUserName();
  const userImage = getUserImage();

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        if (!isMobileView) {
          setActiveDropdown('signin');
        }
      }}
      onMouseLeave={() => {
        if (!isMobileView) {
          setActiveDropdown(null);
        }
      }}
    >
      <button
        type="button"
        onClick={() => {
          if (isMobileView && mobileFriendly) {
            setActiveDropdown(activeDropdown === 'signin' ? null : 'signin');
          }
        }}
        className={`flex items-center hover:text-yellow-400 transition-colors focus:outline-none ${
          compact ? 'max-w-[128px]' : ''
        }`}
        aria-haspopup="true"
        aria-expanded={activeDropdown === 'signin'}
      >
        {/* User Avatar */}
        {isSignedIn && userImage ? (
          <img
            src={userImage}
            alt={`${userName}'s avatar`}
            className="w-6 h-6 rounded-full mr-2 object-cover border border-gray-600"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <svg
            className={`w-5 h-5 mr-2 flex-shrink-0 ${isSignedIn && userImage ? 'hidden' : 'block'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        )}

        {/* User Name / Sign In Text */}
        <span className={`truncate font-medium ${compact ? 'max-w-[88px] text-sm' : 'max-w-[150px]'}`}>
          {isSignedIn ? `Hi, ${userName}` : 'SIGN IN'}
        </span>

        {/* Dropdown Arrow */}
        <svg
          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
            activeDropdown === 'signin' ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
     {/* Dropdown Menu */}
<AnimatePresence>
  {activeDropdown === 'signin' && (
    <motion.div
      className={`absolute mt-2 rounded-lg shadow-xl z-50 p-4 border ${
        isMobileView ? 'right-0' : 'left-1/2 -translate-x-1/2'
      } ${
        isDarkMode
          ? 'bg-gray-800 text-white border-gray-700'
          : 'bg-white text-gray-900 border-gray-200'
      }`}
      style={
        isMobileView
          ? { width: 'min(20rem, calc(100vw - 1.5rem))' }
          : { minWidth: '288px' }
      }
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {isSignedIn ? (
        // Signed In Menu
        <>
          {/* User Info Section */}
          <div className="mb-4 pb-4 border-b border-opacity-20 border-gray-500">
            <div className="flex items-center space-x-3">
              {userImage ? (
                <img
                  src={userImage}
                  alt={`${userName}'s avatar`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-12 h-12 rounded-full bg-yellow-400 items-center justify-center text-gray-900 font-bold ${
                  userImage ? 'hidden' : 'flex'
                }`}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-400">Welcome back!</p>
                <p className="text-lg font-bold truncate text-yellow-400">{userName}</p>
                {user?.email && (
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1 mb-4">
            <button
              onClick={() => {
                navigate('/profile');
                setActiveDropdown(null);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </button>
            
            <button
              onClick={() => {
                navigate('/orders');
                setActiveDropdown(null);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
              </svg>
              My Orders
            </button>

            <button
              onClick={() => {
                navigate('/wishlist');
                setActiveDropdown(null);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Wishlist
            </button>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-opacity-20 border-gray-500">
            <button
              onClick={() => {
                logout();
                setActiveDropdown(null);
                navigate('/');
              }}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-red-900/50 text-red-400 border border-red-900/50'
                  : 'hover:bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </>
      ) : (
        // Sign In Menu
        <>
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2">Welcome!</h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to access your account and enjoy personalized shopping
            </p>
          </div>

          {/* Regular Sign In Button */}
          <button
            onClick={() => {
              navigate('/auth');
              setActiveDropdown(null);
            }}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 mb-3 flex items-center justify-center font-medium shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In / Sign Up
          </button>

          {/* Divider */}
          <div className="relative mb-3">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          {googleClientId ? (
            <div className={isLoggingIn ? 'pointer-events-none opacity-70' : ''}>
              <div ref={googleButtonRef} className="flex justify-center" />
              {isLoggingIn && (
                <p className="mt-2 text-center text-xs text-blue-400">Signing in with Google...</p>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                navigate('/auth');
                setActiveDropdown(null);
              }}
              className={`flex items-center justify-center w-full py-3 px-4 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'border-gray-600 hover:bg-gray-700 text-white'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-900'
              }`}
            >
              Google Sign Up
            </button>
          )}

          {/* Terms */}
          <p className={`text-xs text-center mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-yellow-400 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-yellow-400 hover:underline">Privacy Policy</a>
          </p>
        </>
      )}
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};

export default UserMenu;
