// src/Components/googlesign/GoogleSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/GoogleAuth';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [error, setError] = useState(null);

  useEffect(() => {
    const processGoogleSuccess = async () => {
      // If user already logged in, redirect immediately
      if (user) {
        console.log('✅ User already authenticated, redirecting...');
        const redirectPath = localStorage.getItem('redirect_after_login') || '/';
        localStorage.removeItem('redirect_after_login');
        navigate(redirectPath, { replace: true });
        return;
      }

      try {
        setStatus('processing');
        
        // Debug: Log current URL
        console.log('🔍 Current URL:', window.location.href);

        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const error = params.get('error');

        // Handle error from backend
        if (error) {
          console.error('❌ Google auth error:', error);
          setError(`Authentication failed: ${error}`);
          setStatus('error');
          
          setTimeout(() => {
            navigate('/auth', { 
              replace: true, 
              state: { error: `Login failed: ${error}` }
            });
          }, 3000);
          return;
        }

        // Validate token presence
        if (!token) {
          throw new Error('No authentication token received');
        }

        console.log('✅ Token found, processing login...');

        // Extract user info from token
        try {
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

          console.log('👤 Decoded user info:', userInfo);

          // Perform login
          await login(token, userInfo);
          console.log('🎉 Google login successful!');
          
          setStatus('success');

          // Clean URL
          window.history.replaceState({}, document.title, '/auth/google/success');

          // Get redirect path
          const redirectPath = localStorage.getItem('redirect_after_login') || '/';
          localStorage.removeItem('redirect_after_login');

          // Navigate after delay for UX
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 2000);

        } catch (tokenError) {
          console.error('❌ Token processing error:', tokenError);
          throw new Error('Invalid authentication token');
        }

      } catch (err) {
        console.error('❌ Google login failed:', err);
        setError(err.message);
        setStatus('error');

        // Redirect to auth page after delay
        setTimeout(() => {
          navigate('/auth', { 
            replace: true,
            state: { error: err.message }
          });
        }, 3000);
      }
    };

    processGoogleSuccess();
  }, [navigate, login, user]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-green-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing your sign-in...</h2>
            <p className="text-gray-600 mb-4">Please wait while we set up your account</p>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="rounded-full h-16 w-16 bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome!</h2>
            <p className="text-gray-600 mb-4">You have been successfully signed in with Google</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium">
                🎉 Authentication successful! Redirecting to your dashboard...
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="rounded-full h-16 w-16 bg-red-100 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Sign-in Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700">
                ❌ We encountered an issue during authentication. You will be redirected to try again.
              </p>
            </div>
            <p className="text-xs text-gray-500">Redirecting to login page...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Google Sign-In</h1>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default GoogleSuccess;
