import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken, clearAccessToken as clearAxiosToken } from '@/lib/axios';

// 1. Define what a 'User' looks like in Hive
interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Computed value: if we have a user, they are authenticated
  const isAuthenticated = !!user;

  // This runs when the login API call succeeds
  const login = (token: string, userData: User) => {
    setAccessToken(token); // Update the Axios interceptor
    setUser(userData);      // Update the UI state
  };

  const logout = () => {
    clearAxiosToken();
    setUser(null);
  };

  useEffect(()=>{
    const handleLogoutEvent = ()=>{
      logout();
    }

    window.addEventListener('auth:logout',handleLogoutEvent);
    return ()=> window.removeEventListener('auth:logout',handleLogoutEvent);
  },[])

  useEffect(()=>{

    const checkExistingSession = async()=>{
      try {
        const {data} = await api.post('/auth/refresh')
        
        login(data.accessToken,data.user)

      } catch (error) {
        console.log("No active sessions found..")
      }
    }
    checkExistingSession();

  },[])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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