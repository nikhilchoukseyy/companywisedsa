import { useEffect, useRef, useState } from 'react';
import { authApi } from '../utils/api';
import {
  identifyAnalyticsUser,
  resetAnalytics,
  trackLogin,
  trackLogout,
} from '../utils/analytics';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authError, setAuthError] = useState('');
  const previousUserIdRef = useRef('');

  const setSession = (payload) => {
    setUser(payload?.user || null);
    setDashboard(payload?.dashboard || null);
  };

  useEffect(() => {
    let active = true;

    authApi
      .me()
      .then((payload) => {
        if (active) {
          setSession(payload);
        }
      })
      .catch(() => {
        if (active) {
          setSession(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoadingUser(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const previousUserId = previousUserIdRef.current;
    const currentUserId = user?.id || '';

    if (!currentUserId) {
      previousUserIdRef.current = '';
      return;
    }

    if (previousUserId !== currentUserId) {
      identifyAnalyticsUser(user);
      previousUserIdRef.current = currentUserId;
    }
  }, [user]);

  const login = async (credentials) => {
    setAuthError('');
    const payload = await authApi.login(credentials);
    setSession(payload);
    trackLogin('password', payload?.user);
    return payload;
  };

  const googleLogin = async (credential) => {
    setAuthError('');
    const payload = await authApi.google({ credential, idToken: credential });
    setSession(payload);
    trackLogin('google', payload?.user);
    return payload;
  };

  const register = async (details) => {
    setAuthError('');
    const payload = await authApi.register(details);
    setSession(payload);
    trackLogin('register', payload?.user);
    return payload;
  };

  const logout = async () => {
    if (user) {
      trackLogout(user);
      resetAnalytics();
    }

    try {
      await authApi.logout();
    } finally {
      setSession(null);
    }
  };

  return {
    authError,
    dashboard,
    loadingUser,
    googleLogin,
    login,
    logout,
    register,
    setAuthError,
    setDashboard,
    setSession,
    setUser,
    user,
  };
}
