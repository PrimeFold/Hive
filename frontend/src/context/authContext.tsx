import React, { createContext, useContext, useState, useEffect } from 'react';
import {getAccessToken, setAccessToken, clearAccessToken } from '@/lib/axios';
import { refreshToken } from '@/lib/authService';
import { socket } from '@/hooks/use-socket';

interface User {
  displayName?:string;
  id: string;
  email: string;
  username: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading:boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

 const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading , setIsLoading] = useState(true);
  const isAuthenticated = !!user && !!getAccessToken();


  const login = (token: string, userData: User) => {
    setAccessToken(token); // Update the Axios interceptor
    setUser(userData);      // Update the UI state
    socket.connect();
  };

  const logout = () => {
    clearAccessToken();
    setUser(null);
    socket.disconnect();
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  useEffect(()=>{
    const handleLogoutEvent = ()=>{
      logout();
    }

    window.addEventListener('auth:logout',handleLogoutEvent);
    return ()=> window.removeEventListener('auth:logout',handleLogoutEvent);
  },[])

  // Session restoration on mount
  useEffect(()=>{
    let isMounted = true;

    const checkExistingSession = async()=>{
      try {
        // Attempt to refresh token from cookie
        const data = await refreshToken();
        if (isMounted) {
          login(data.accessToken, data.user);
        }
      } catch (error:any) {
        
        if (isMounted) {
          clearAccessToken();
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkExistingSession();

    return () => {
      isMounted = false;
    };
  },[])

  return (
    <AuthContext.Provider value={{ user, isLoading ,isAuthenticated, login, logout, updateUser  }}>
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
