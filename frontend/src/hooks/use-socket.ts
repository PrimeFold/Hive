import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/auth-context';
import { getAccessToken } from '@/lib/axios';

const SOCKET_URL = import.meta.env.VITE_API_URL 

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            console.log('No user found, skipping socket connection');
            return;
        }

        // Get token - ensure it's a string
        const token = getAccessToken();
        
        if (!token) {
            console.error('❌ No access token available for socket connection');
            return;
        }

        console.log('🔌 Attempting to connect socket with token:', token.substring(0, 20) + '...');
        
        const newSocket = io(SOCKET_URL, {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        // Connection event handlers
        newSocket.on('connect', () => {
            console.log('✅ Connected to Hive Socket:', newSocket.id);
        });

        newSocket.on('connect_error', (err) => {
            console.error('❌ Socket Connection Error:', err.message);
            console.error('Error details:', err);
            
            // Check if it's an auth error
            if (err.message.includes('Unauthorized')) {
                console.error('⚠️ Authentication failed - token may be invalid or expired');
                
                // Try to refresh token
                const refreshEvent = new CustomEvent('auth:need_refresh');
                window.dispatchEvent(refreshEvent);
            }
        });

        newSocket.on('disconnect', (reason) => {
            console.log('🔌 Socket disconnected:', reason);
            if (reason === 'io server disconnect') {
                // Server disconnected, try to reconnect
                newSocket.connect();
            }
        });

        newSocket.on('pong', (data) => {
            console.log('🏓 Socket heartbeat received:', data);
        });

        setSocket(newSocket);

        return () => {
            console.log('🔌 Cleaning up socket...');
            if (newSocket.connected) {
                newSocket.disconnect();
            }
        };
    }, [user]); // Only reconnect when user changes

    // Handle token refresh
    useEffect(() => {
        if (!socket) return;

        const handleTokenRefresh = () => {
            const newToken = getAccessToken();
            console.log('🔄 Token refreshed, updating socket auth...');
            
            if (newToken && socket) {
                // Update the auth token
                socket.auth = { token: newToken };
                
                // Reconnect with new token
                if (!socket.connected) {
                    socket.connect();
                } else {
                    // If already connected, we need to reconnect to use new token
                    socket.disconnect();
                    socket.connect();
                }
            }
        };

        window.addEventListener('auth:token_refreshed', handleTokenRefresh);

        return () => {
            window.removeEventListener('auth:token_refreshed', handleTokenRefresh);
        };
    }, [socket]);

    // Handle logout
    useEffect(() => {
        const handleLogout = () => {
            console.log('🔌 Logging out, disconnecting socket...');
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        };

        window.addEventListener('auth:logout', handleLogout);

        return () => {
            window.removeEventListener('auth:logout', handleLogout);
        };
    }, [socket]);

    return socket;
};