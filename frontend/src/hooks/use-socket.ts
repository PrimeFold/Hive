import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/auth-context';
import { accessToken } from '@/lib/axios';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // 2. Initialize the connection , we pass the token in 'auth' so your backend 'socket.handshake.auth' can see it.
    const newSocket = io(SOCKET_URL as string, {
      auth: {
        token: accessToken, // Using the in-memory token from axios setup
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

  return socket;
};