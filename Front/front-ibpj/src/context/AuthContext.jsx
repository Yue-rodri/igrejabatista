import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/entities/User';
import { checkApiHealth, getApiBaseUrl, setApiBaseUrl } from '@/api/core';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthSheetOpen, setIsAuthSheetOpen] = useState(false);
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    online: true,
    checking: true,
    baseUrl: getApiBaseUrl(),
  });

  const verifyApiAndSession = useCallback(async () => {
    setIsLoadingAuth(true);
    setApiStatus((prev) => ({ ...prev, checking: true, baseUrl: getApiBaseUrl() }));

    const health = await checkApiHealth();
    setApiStatus({
      online: health.online,
      checking: false,
      baseUrl: health.baseUrl,
      error: health.error || null,
    });

    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    verifyApiAndSession();
  }, [verifyApiAndSession]);

  const handleLoginSuccess = useCallback(async (loggedUser) => {
    if (loggedUser) {
      setUser(loggedUser);
    } else {
      const currentUser = await User.me();
      setUser(currentUser);
    }
    setIsAuthSheetOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await User.logout();
    setUser(null);
    setIsDebugModalOpen(false);
  }, []);

  const updateApiEndpoint = useCallback(async (newUrl) => {
    setApiBaseUrl(newUrl);
    await verifyApiAndSession();
  }, [verifyApiAndSession]);

  // No backend (authMiddleware.js), tanto 'admin' quanto 'DESENVOLVEDOR' possuem privilégios administrativos
  const isAdmin = Boolean(user && (user.role === 'admin' || user.role === 'DESENVOLVEDOR'));
  const isDev = Boolean(user && user.role === 'DESENVOLVEDOR');

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isDev,
        isLoadingAuth,
        apiStatus,
        isAuthSheetOpen,
        setIsAuthSheetOpen,
        isDebugModalOpen,
        setIsDebugModalOpen,
        isApiConfigOpen,
        setIsApiConfigOpen,
        onLoginSuccess: handleLoginSuccess,
        logout: handleLogout,
        refreshSession: verifyApiAndSession,
        updateApiEndpoint,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return ctx;
}
