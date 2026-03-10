import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/GoogleAuth';

const AuthPage = () => {
  const googleButtonRef = useRef(null);
  const [activeTab, setActiveTab] = useState('login'); // Start on login tab
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const API_BASE_URL =
    window.location.hostname === 'ravorin.com' || window.location.hostname === 'www.ravorin.com'
      ? 'https://apii.ravorin.com/api/v1'
      : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1');

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) {
      return;
    }

    const existingScript = document.querySelector('script[data-google-identity="true"]');

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            setGoogleLoading(true);
            setError('');
            setSuccess('');

            const result = await axios.post(`${API_BASE_URL}/auth/google`, {
              credential: response.credential,
            });

            if (result.data?.success && result.data?.token) {
              await loginContext(result.data.token, result.data.user);
              setSuccess('Google login successful!');
              setTimeout(() => navigate('/'), 800);
            } else {
              throw new Error(result.data?.message || 'Google login failed');
            }
          } catch (err) {
            console.error('Google login failed:', err);
            setError(err.response?.data?.message || err.message || 'Google login failed');
          } finally {
            setGoogleLoading(false);
          }
        },
      });

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'pill',
        text: activeTab === 'login' ? 'signin_with' : 'signup_with',
        width: 320,
      });
    };

    if (existingScript) {
      initializeGoogle();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.onload = initializeGoogle;
    document.body.appendChild(script);
  }, [API_BASE_URL, activeTab, googleClientId, loginContext, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ... inside AuthPage component ...

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess(''); // Clear previous success messages
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: formData.email,
      password: formData.password,
    });

    // Check for successful response (e.g., 2xx status)
    if (response.status >= 200 && response.status < 300) {
      setSuccess('Login successful!');

      console.log('🔑 Login response token:', response.data.token ? 'Present' : 'Missing');
      console.log('👤 Login response user:', response.data.user);

      // Store token using context
      if (response.data.token) {
        loginContext(response.data.token, response.data.user);
        console.log('✅ Token stored in context');
      }

      // --- Key Change: Navigate to /checkout on successful login ---
      // Add a short delay so the user sees the success message
      setTimeout(() => {
        navigate('/'); // Navigate to the home page
      }, 1500); // 1.5 seconds delay

    } else {
      // Handle unexpected success status codes if necessary
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (err) {
    console.error("Login Error:", err);
    if (err.response) {
      if (err.response.status === 401) {
        setError('Invalid email or password.');
      } else if (err.response.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(`Login failed: ${err.response.data?.message || 'Unknown error'}`);
      }
    } else if (err.request) {
      setError('Network error. Please check your connection.');
    } else {
      setError('Login failed. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

// ... rest of the component ...

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(''); // Clear previous success messages
    try {
      // Make sure the URL matches your backend endpoint
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Check for successful response (2xx status)
      if (response.status >= 200 && response.status < 300) {
        setSuccess('Sign-up successful!');

        // --- Key Change: Switch to Login Tab and Pre-fill Email ---
        // Clear form data except email
        setFormData(prev => ({
          name: '',
          email: prev.email, // Keep the email from signup
          password: '',
        }));
        // Switch to the login tab
        setActiveTab('login');
        // --- End Key Change ---

         // Optional: Redirect after a delay, or let the user manually login
         // setTimeout(() => {
         //    // navigate('/dashboard'); // Or another route
         //    console.log("Would navigate after signup"); // Placeholder
         // }, 2000); // Show success for 2 seconds

      } else {
         // Handle unexpected success status codes if necessary
         throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error("Sign-up Error:", err); // Log the full error
       // Provide more specific error messages based on the error response if available
       if (err.response) {
         // Server responded with error status (4xx, 5xx)
         if (err.response.status === 409) { // Common for duplicate email
             setError('Email already exists. Please use a different email.');
         } else if (err.response.status >= 500) {
             setError('Server error during sign-up. Please try again later.');
         } else {
             setError(`Sign-up failed: ${err.response.data?.message || 'Unknown error'}`);
         }
       } else if (err.request) {
         // Request was made but no response received
         setError('Network error during sign-up. Please check your connection.');
       } else {
         // Something else happened
         setError('Sign-up failed. Please try again.');
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#1A1A1A] text-white">
      {/* Left side: forms */}
      <div className="w-full md:w-1/2 p-4 sm:p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg">
          {/* Company Name */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-yellow-400 mb-2">
            Ravorin
          </h2>
          {/* Unique Tagline */}
          <p className="text-sm text-gray-400 text-center mb-6">
            Unlock your exclusive access – safe, secure, and simple.
          </p>

          {/* Tab Buttons */}
          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 text-sm sm:text-base font-semibold ${
                activeTab === 'login'
                  ? 'border-b-2 border-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 ml-4 text-sm sm:text-base font-semibold ${
                activeTab === 'signup'
                  ? 'border-b-2 border-green-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Form Section */}
          {activeTab === 'login' ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required // Add required attribute
                  className="mb-4 p-2 w-full bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required // Add required attribute
                  className="mb-4 p-2 w-full bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
                />
                {/* Optional: Forgot Password Link */}
                {/* <a href="#" className="text-sm text-blue-400 hover:underline mb-4 block">Forgot Password?</a> */}
                <button
                  type="submit"
                  className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700 transition text-white font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-700" />
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-500">or</span>
                  <div className="h-px flex-1 bg-gray-700" />
                </div>
                {googleClientId ? (
                  <div className="flex justify-center">
                    <div ref={googleButtonRef} className={googleLoading ? 'pointer-events-none opacity-70' : ''} />
                  </div>
                ) : (
                  <p className="text-center text-xs text-amber-400">
                    Google sign-in needs `VITE_GOOGLE_CLIENT_ID`.
                  </p>
                )}
                {googleLoading && <p className="text-center text-sm text-blue-400 mt-3">Signing in with Google...</p>}
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                {success && <p className="text-green-500 text-center mt-2">{success}</p>}
              </form>
            </motion.div>
          ) : (
            <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSignUp}>
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required // Add required attribute
                  className="mb-4 p-2 w-full bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required // Add required attribute
                  className="mb-4 p-2 w-full bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required // Add required attribute
                  className="mb-4 p-2 w-full bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="w-full p-2 bg-green-600 rounded hover:bg-green-700 transition text-white font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-700" />
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-500">or</span>
                  <div className="h-px flex-1 bg-gray-700" />
                </div>
                {googleClientId ? (
                  <div className="flex justify-center">
                    <div ref={googleButtonRef} className={googleLoading ? 'pointer-events-none opacity-70' : ''} />
                  </div>
                ) : (
                  <p className="text-center text-xs text-amber-400">
                    Google sign-in needs `VITE_GOOGLE_CLIENT_ID`.
                  </p>
                )}
                {googleLoading && <p className="text-center text-sm text-blue-400 mt-3">Signing in with Google...</p>}
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                {success && <p className="text-green-500 text-center mt-2">{success}</p>}
              </form>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right side: animation */}
      <div
        className="w-full md:w-1/2 p-4 sm:p-8 flex justify-center items-center"
        style={{ perspective: 1000 }}
      >
        <motion.div
          style={{
            width: 150,
            height: 150,
            position: 'relative',
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateY: [0, 180] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#374151',
              borderRadius: '10px',
              boxShadow:
                '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
            }}
          >
            <span className="text-4xl">🔒</span>
          </div>
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#374151',
              borderRadius: '10px',
              boxShadow:
                '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
            }}
          >
            <span className="text-4xl">👤</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
