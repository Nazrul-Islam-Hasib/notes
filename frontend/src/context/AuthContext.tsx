import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthContextType } from '../types/Auth';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'notes_auth_token';
const USER_KEY = 'notes_auth_user';

/**
 * AuthProvider is responsible for managing and providing
 * authentication state across the entire application.
 *
 * It:
 * - Stores the current authenticated user and token
 * - Persists auth state in localStorage
 * - Restores session on page refresh
 * - Exposes login, register, and logout functions
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Currently authenticated user (null if not logged in)
  const [user, setUser] = useState<User | null>(null);

  // JWT token used for authenticated requests
  const [token, setToken] = useState<string | null>(null);

  // Indicates whether auth state is being initialized (e.g., validating stored token)
  const [isLoading, setIsLoading] = useState(true);

  /**
   * On mount:
   * - Restore token and user from localStorage (if available)
   * - Validate the token by calling the backend
   * - Clear state if token is invalid
   */
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      // Validate token with backend
      authService.getMe(storedToken)
          .then((userData) => {
            // Update user with fresh data from server
            setUser(userData);
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
          })
          .catch(() => {
            // Token is invalid or expired → clear persisted state
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setToken(null);
            setUser(null);
          })
          .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logs in a user and persists auth state.
   */
  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    setToken(response.token);

    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  }, []);

  /**
   * Registers a new user and persists auth state.
   */
  const register = useCallback(async (email: string, password: string) => {
    const response = await authService.register(email, password);
    setUser(response.user);
    setToken(response.token);

    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  }, []);

  /**
   * Clears authentication state and removes persisted data.
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  /**
   * The value object exposed to all components consuming AuthContext.
   */
  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token, // true if user and token exist
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook for accessing authentication context.
 *
 * Provides:
 * - Current user
 * - Auth token
 * - Auth state flags
 * - login, register, logout functions
 *
 * Must be used inside <AuthProvider>.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  // Prevent usage outside of AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
