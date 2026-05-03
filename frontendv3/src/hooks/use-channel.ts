import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '@/lib/socket';
import type { Message } from '@/types/message';

export function useChannel(channelId: string) {
  const queryClient = useQueryClient();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.emit('join_channel', channelId);

    socket.on('new_channel_message', (message: Message) => {
      queryClient.setQueryData(['messages', channelId], (old: Message[] = []) => {
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
      socket.off('new_channel_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [channelId, queryClient]);

  return { typingUsers };
}