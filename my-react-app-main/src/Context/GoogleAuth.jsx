import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // 🔥 FIX: Removed trailing spaces
  const API_BASE_URL =
    window.location.hostname === 'ravorin.com' || window.location.hostname === 'www.ravorin.com'
      ? 'https://apii.ravorin.com/api/v1'
      : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1');

  const decodeToken = (token) => {
    try {
      if (!token) return null;
      const payload = token.split('.')[1];
      let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      base64 += '='.repeat((4 - base64.length % 4) % 4);
      const decodedPayload = atob(base64);
      return JSON.parse(decodedPayload);
    } catch (err) {
      console.error('Failed to decode token:', err);
      return null;
    }
  };

  const isTokenExpired = (decoded) => {
    if (!decoded?.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < (now + 300);
  };

  const isTokenValid = (token) => {
    if (!token) return false;
    // For our backend tokens, we'll just check if it exists and is a string
    // The actual validation happens on the backend
    return typeof token === 'string' && token.length > 0;
  };

  const fetchUserProfile = async (jwtToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch profile`);
      }

      const userData = await response.json();
      console.log('✅ User profile fetched:', userData);
      return userData.user; // Return the user object from the response
    } catch (err) {
      console.warn('⚠️ Could not fetch full profile:', err.message);
      return null;
    }
  };

  const login = async (jwtToken, userInfo = null) => {
    try {
      setLoading(true);

      if (!jwtToken) {
        throw new Error('No token provided');
      }

      // Store token immediately
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      console.log('💾 Token stored in localStorage:', jwtToken.substring(0, 20) + '...');

      let finalUser = {
        id: userInfo?.id || 'unknown',
        email: userInfo?.email || '',
        name: userInfo?.name || 'User',
        role: userInfo?.role || 'user',
      };

      if (userInfo) {
        finalUser = { ...finalUser, ...userInfo };
      }

      // Fetch full profile data from backend to ensure token is valid
      try {
        const profileData = await fetchUserProfile(jwtToken);
        if (profileData) {
          finalUser = {
            ...finalUser,
            ...profileData,
            name: profileData.name || finalUser.name,
            email: profileData.email || finalUser.email,
          };
        }
      } catch (profileError) {
        console.warn('Could not fetch profile, using provided user data:', profileError);
      }

      if (!finalUser.id || finalUser.id === 'unknown') {
        throw new Error('User ID not found');
      }

      localStorage.setItem('user', JSON.stringify(finalUser));
      setUser(finalUser);

      console.log('✅ User logged in successfully:', finalUser);
      return Promise.resolve(finalUser);

    } catch (err) {
      console.error('❌ Login error:', err);
      logout();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('redirect_after_login');
    setToken(null);
    setUser(null);
    setInitialized(true);
    console.log('🔓 User logged out');
  };

  const getCurrentToken = () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return null;
    return isTokenValid(storedToken) ? storedToken : null;
  };

  // 🔥 Critical Fix: finally block ensures initialized=true always
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        console.log('🔐 [AUTH] Starting initialization...');
        console.log('💾 [AUTH] Token in localStorage:', !!storedToken);
        console.log('👤 [AUTH] User in localStorage:', !!storedUser);

        if (!storedToken) {
          console.log('🟡 [AUTH] No token found. Marking as initialized.');
          setInitialized(true);
          return;
        }

        console.log('✅ [AUTH] Token found. Setting token state...');
        setToken(storedToken);

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            console.log('✅ [AUTH] User restored from localStorage:', parsedUser.name || 'Unknown');
          } catch (parseError) {
            console.error('❌ [AUTH] Failed to parse user. Logging out...', parseError);
            logout();
            return;
          }
        } else {
          console.log('🟡 [AUTH] No stored user. Token may be from our backend...');
          // For our backend tokens, we'll fetch the profile to get user data
          try {
            const profileData = await fetchUserProfile(storedToken);
            if (profileData) {
              localStorage.setItem('user', JSON.stringify(profileData));
              setUser(profileData);
              console.log('✅ [AUTH] User data fetched from backend:', profileData.name);
            } else {
              console.warn('⚠️ [AUTH] Could not fetch user profile. Token may be invalid.');
              logout();
              return;
            }
          } catch (profileError) {
            console.error('❌ [AUTH] Failed to fetch profile. Logging out...', profileError);
            logout();
            return;
          }
        }

      } catch (err) {
        console.error('❌ [AUTH] CRITICAL INIT ERROR:', err);
        logout();
      } finally {
        // 🔥🔥🔥 THIS IS THE FIX — MUST RUN
        console.log('🏁 [AUTH] Initialization COMPLETE. Setting initialized = true');
        setInitialized(true); // ← এই লাইনটি ছিল মিসিং বা না রান হচ্ছিল
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const contextValue = {
    user,
    token,
    login,
    logout,
    loading,
    initialized, // ✅ Now properly set
    isAuthenticated: !!user && !!token && !loading,
    getCurrentToken,
    isTokenValid: () => isTokenValid(token),
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const withAuth = (WrappedComponent) => {
  return (props) => {
    const { loading, initialized, isAuthenticated } = useAuth();
    
    if (!initialized || loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50" style={{ color: '#374151' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Initializing authentication...</p>
          </div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50" style={{ color: '#374151' }}>
          <div className="text-center">
            <p className="text-xl mb-4">Please login to continue</p>
            <button 
              onClick={() => window.location.href='/login'}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
};
