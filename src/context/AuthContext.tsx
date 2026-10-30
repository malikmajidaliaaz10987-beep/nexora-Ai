/**
 * NEXORA AI — Authentication Context & Session Management
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, CreditBalance, Subscription, SubscriptionPlan, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  credits: CreditBalance | null;
  subscription: Subscription | null;
  plan: SubscriptionPlan | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  initMainAccount: () => Promise<void>;
  updateUserProfile: (updates: { fullName?: string; company?: string; bio?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<CreditBalance | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nexora_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setCredits(data.credits);
          setSubscription(data.subscription);
          setPlan(data.plan);
          return;
        }
      }
      // If token invalid, clear
      localStorage.removeItem('nexora_token');
      setToken(null);
      setUser(null);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const initMainAccount = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/main-account', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('nexora_token', data.token);
        setToken(data.token);
        await fetchProfile(data.token);
      }
    } catch (e) {
      console.error('Failed to initialize main account', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      initMainAccount();
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      localStorage.setItem('nexora_token', data.token);
      setToken(data.token);
      await fetchProfile(data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      localStorage.setItem('nexora_token', data.token);
      setToken(data.token);
      await fetchProfile(data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const updateUserProfile = async (updates: { fullName?: string; company?: string; bio?: string; avatarUrl?: string }) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchProfile(token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to update profile' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('nexora_token');
    setToken(null);
    setUser(null);
    setCredits(null);
    setSubscription(null);
    setPlan(null);
  };

  const refreshProfile = async () => {
    if (token) await fetchProfile(token);
  };

  const refreshCredits = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/credits/balance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCredits(data.creditBalance);
      }
    } catch (err) {
      console.error('Failed to refresh credits:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        credits,
        subscription,
        plan,
        token,
        isLoading,
        login,
        register,
        logout,
        initMainAccount,
        updateUserProfile,
        refreshProfile,
        refreshCredits
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
