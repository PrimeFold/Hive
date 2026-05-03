import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from './use-socket';

export function useConversation(conversationId: string) {
  const queryClient = useQueryClient();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.emit('join_conversation', conversationId);

    socket.on('new_dm', ({ message }: { message: any, clientId: string }) => {
      queryClient.setQueryData(['dm', conversationId], (old: any[] = []) => {
        return [...old, message];
      });
    });

    socket.on('user_typing', ({ userId }: { userId: string }) => {
      setTypingUsers(prev => [...new Set([...prev, userId])]);
    });

    socket.on('user_stop_typing', ({ userId }: { userId: string }) => {
      setTypingUsers(prev => prev.filter(id => id !== userId));
    });

    return () => {
      socket.off('new_dm');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [conversationId, queryClient]);

  return { typingUsers };
}