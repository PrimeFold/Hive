import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/auth-context';
import { getAccessToken } from '@/lib/axios';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { user } = useAuth();
    const token = getAccessToken();

    useEffect(() => {
    if (!user || !token) return;


    const newSocket = io(SOCKET_URL as string, {
      auth: {
        token: token, // Using the in-memory token from axios setup
      },
      transports: ['websocket'], // Forces WebSocket for better performance
    });

    // 3. Debugging: Know when user is actually connected
    newSocket.on('connect', () => {
      console.log('✅ Connected to Hive Socket:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket Connection Error:', err.message);
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Disconnecting socket...');
      newSocket.disconnect();
    };
  }, [user]); // Re-run if the user changes (login/logout)


  useEffect(()=>{
    const handleRefresh = ()=>{
        if(!socket) return;

        const newToken = getAccessToken;
        socket.auth = {token:newToken};
        console.log('🔄 Reconnecting socket with new token...');
        socket.disconnect().connect();
    }

    window.addEventListener('auth:token_refreshed',handleRefresh);

    return ()=>{
        window.removeEventListener('auth:token_refreshed',handleRefresh)
    }

  },[socket])

  useEffect(() => {
    const handleLogout = () => {
      if (!socket) return;

      console.log('🔌 Logging out, disconnecting socket...');
      socket.disconnect();
      setSocket(null);
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [socket]);

  return socket;

};