import { useEffect, useState } from 'react';
import { authApi } from '../utils/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authError, setAuthError] = useState('');

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

  const login = async (credentials) => {
    setAuthError('');
    const payload = await authApi.login(credentials);
    setSession(payload);
    return payload;
  };

  const googleLogin = async (credential) => {
    setAuthError('');
    const payload = await authApi.google({ credential, idToken: credential });
    setSession(payload);
    return payload;
  };

  const register = async (details) => {
    setAuthError('');
    const payload = await authApi.register(details);
    setSession(payload);
    return payload;
  };

  const logout = async () => {
    await authApi.logout();
    setSession(null);
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
