import { useEffect } from 'react';
import { useSocketContext } from '@/context/socket-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const usePresence = (workspaceId: string) => {
  const socket = useSocketContext();
  const queryClient = useQueryClient();
  const queryKey = ['presence', workspaceId];

  // Initial Fetch via Socket
  const { data: onlineUserIds = [] } = useQuery<string[]>({
    queryKey,
    queryFn: () => {
      return new Promise((resolve) => {
        if (!socket) return resolve([]);
        
        // Request the list
        socket.emit('online_members', workspaceId);
        
        // Listen once for the response
        socket.once('online_members', (members: string[]) => {
          resolve(members);
        });
      });
    },
    enabled: !!socket && !!workspaceId,
    staleTime: Infinity, // We rely on socket events to update this manually
  });

  // 2. Real-time Sync
  useEffect(() => {
    if (!socket || !workspaceId) return;

    // Join the workspace room (triggering your backend sadd logic)
    socket.emit('join_workspace', workspaceId);

    const handleUserOnline = ({ userId }: { userId: string }) => {
      queryClient.setQueryData<string[]>(queryKey, (old) => {
        const current = old || [];
        return current.includes(userId) ? current : [...current, userId];
      });
    };

    const handleUserOffline = ({ userId }: { userId: string }) => {
      queryClient.setQueryData<string[]>(queryKey, (old) => {
        return (old || []).filter((id) => id !== userId);
      });
    };

    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);

    return () => {
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
    };
  }, [socket, workspaceId, queryClient, queryKey]);

  return { onlineUserIds };
};