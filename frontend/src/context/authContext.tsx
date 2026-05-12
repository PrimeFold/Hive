import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAccessToken, setAccessToken, clearAccessToken, setAuthFailureHandler } from '@/lib/axios';
import { getCurrentUser, refreshToken } from '@/lib/authService';
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


  const login = useCallback((token: string, userData: User) => {
    setAccessToken(token); // Update the Axios interceptor
    setUser(userData);      // Update the UI state
    socket.connect();
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
    socket.disconnect();
  }, []);

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  useEffect(() => {
    setAuthFailureHandler(logout);
    return () => setAuthFailureHandler(null);
  }, [logout]);

  // Session restoration on mount
  useEffect(()=>{
    let isMounted = true;

    const checkExistingSession = async()=>{
      try {
        const existingToken = getAccessToken();

        if (existingToken) {
          try {
            const me = await getCurrentUser();
            if (isMounted && me?.user) {
              setUser(me.user);
              socket.connect();
              return;
            }
          } catch {
            // If access token is invalid/expired, continue to refresh flow.
          }
        }

        const refreshed = await refreshToken();
        if (isMounted && refreshed?.accessToken && refreshed?.user) {
          login(refreshed.accessToken, refreshed.user);
        } else if (isMounted) {
          logout();
        }
      } catch (error:any) {
        if (isMounted) {
          logout();
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
