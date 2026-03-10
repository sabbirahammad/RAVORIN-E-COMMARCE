// src/Components/googlesign/GoogleCallbackPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/GoogleAuth';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Processing your Google login...');

  useEffect(() => {
    const processGoogleCallback = async () => {
      // Skip if user already logged in
      if (user) {
        console.log('✅ User already logged in, redirecting...');
        const redirectPath = localStorage.getItem('redirect_after_login') || '/';
        localStorage.removeItem('redirect_after_login');
        navigate(redirectPath, { replace: true });
        return;
      }

      try {
        setStatus('processing');
        setMessage('Processing your Google login...');
        
        // Parse URL parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userStr = params.get('user');
        const error = params.get('error');

        console.log('📝 Processing callback with params:', { 
          hasToken: !!token, 
          hasUser: !!userStr, 
          error,
          fullURL: window.location.href
        });

        // Handle error from backend
        if (error) {
          console.error('❌ Google auth error from backend:', error);
          setStatus('error');
          setMessage(`Authentication failed: ${decodeURIComponent(error)}`);
          setTimeout(() => {
            navigate('/', { 
              replace: true, 
              state: { error: `Login failed: ${decodeURIComponent(error)}` }
            });
          }, 4000);
          return;
        }

        // Validate required token
        if (!token) {
          console.error('❌ No token received from Google auth');
          setStatus('error');
          setMessage('No authentication token received from Google');
          setTimeout(() => {
            navigate('/auth', { 
              replace: true, 
              state: { error: 'Authentication failed. Please try again.' }
            });
          }, 4000);
          return;
        }

        console.log('🔍 Token received:', token.substring(0, 50) + '...');

        // Parse user data if provided
        let userData = null;
        if (userStr) {
          try {
            userData = JSON.parse(decodeURIComponent(userStr));
            console.log('👤 User data from URL:', userData);
          } catch (parseError) {
            console.warn('⚠️ Failed to parse user data, will extract from token:', parseError);
          }
        }

        // If no user data in URL, extract from token
        if (!userData) {
          try {
            const payload = token.split('.')[1];
            let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            base64 += '='.repeat((4 - base64.length % 4) % 4);
            const decoded = JSON.parse(atob(base64));

            userData = {
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
            console.log('👤 User data extracted from token:', userData);
          } catch (tokenError) {
            console.warn('⚠️ Could not extract user data from token:', tokenError);
          }
        }

        // Attempt login with token
        setMessage('Signing you in...');
        await login(token, userData);
        
        console.log('✅ Google login successful via callback');
        setStatus('success');
        setMessage('Login successful! Welcome back!');

        // Clean URL parameters
        window.history.replaceState({}, document.title, '/auth/google/callback');

        // Get redirect path and navigate
        const redirectPath = localStorage.getItem('redirect_after_login') || '/';
        localStorage.removeItem('redirect_after_login');

        console.log('🚀 Redirecting to:', redirectPath);

        // Short delay for better UX
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 2000);

      } catch (error) {
        console.error('❌ Google callback processing error:', error);
        setStatus('error');
        setMessage(`Login failed: ${error.message}`);
        
        setTimeout(() => {
          navigate('/auth', { 
            replace: true, 
            state: { error: `Login failed: ${error.message}` }
          });
        }, 4000);
      }
    };

    // Small delay to ensure component is mounted
    const timer = setTimeout(() => {
      processGoogleCallback();
    }, 100);

    return () => clearTimeout(timer);
  }, [location, login, navigate, user]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4.24 3.99 2.18 7.84l3.66 2.84C6.71 7.69 9.14 5.38 12 5.38z"/>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Signing you in...</h2>
            <p className="text-gray-600 text-lg mb-6">{message}</p>
            <div className="flex justify-center mb-4">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
            <p className="text-sm text-gray-500">This may take a few seconds...</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <div className="rounded-full h-20 w-20 bg-green-100 mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome back!</h2>
            <p className="text-gray-600 text-lg mb-6">{message}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-green-800">
                  Successfully signed in with Google
                </p>
              </div>
              <p className="text-xs text-green-600">
                🎉 Redirecting to your dashboard...
              </p>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <div className="rounded-full h-20 w-20 bg-red-100 mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Authentication Failed</h2>
            <p className="text-gray-600 text-lg mb-6">{message}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm font-medium text-red-800">
                  Something went wrong during sign-in
                </p>
              </div>
              <p className="text-xs text-red-600">
                ❌ Please try again or contact support if the issue persists
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate('/auth')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Go Home
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">Automatically redirecting in a few seconds...</p>
          </div>
        );
      
      default:
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Preparing...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4.24 3.99 2.18 7.84l3.66 2.84C6.71 7.69 9.14 5.38 12 5.38z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Authentication</h1>
          <p className="text-gray-600">Secure sign-in with your Google account</p>
        </div>
        
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Protected by Google's security • 
            <a href="/privacy" className="hover:text-blue-600 ml-1">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;

