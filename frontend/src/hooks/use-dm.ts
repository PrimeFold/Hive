import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocketContext } from '@/context/socket-context';
import api from '@/lib/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Message } from '@/types/message';

export const useDM = (conversationId: string) => {
  const queryClient = useQueryClient();
  const socket = useSocketContext();
  
  // 1. Defining the Key and typing the Query
  const queryKey = ['messages', conversationId];

  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // 2. Fetching with Generics 
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey,
    queryFn: async () => {
      const res = await api.get<Message[]>(`/conversations/${conversationId}/messages`);
      return res.data;
    },
    enabled: !!conversationId,
  });

  // ----------------------- JOIN ROOM -----------------------------
  useEffect(() => {
    if (!socket || !conversationId) return;
    socket.emit('join_conversation', conversationId);
  }, [socket, conversationId]);

  // ------------------ LISTEN FOR NEW MESSAGES --------------------
  useEffect(() => {
    if (!socket) return;

    const handleNewDM = (msg: Message) => {
      // Use setQueryData (Single) not setQueriesData (Bulk)
      queryClient.setQueryData<Message[]>(queryKey, (old) => {
        const prevMessages = old || [];

        // Guard against duplicates from database
        if (prevMessages.some((m) => m.id === msg.id)) {
          return prevMessages;
        }

        // Swap optimistic message if it exists
        const optimisticIndex = prevMessages.findIndex(
          (m) => m.clientId === msg.clientId
        );

        if (optimisticIndex !== -1) {
          const updatedMessages = [...prevMessages];
          updatedMessages[optimisticIndex] = {
            ...msg,
            pending: false, // Confirmed by server
          };
          return updatedMessages;
        }

        return [...prevMessages, msg];
      });
    };

    socket.on('new_dm', handleNewDM);
    return () => {
      socket.off('new_dm', handleNewDM);
    };
  }, [socket, queryClient, queryKey]);

  // --- Typing indicators ---
  useEffect(() => {
    if (!socket) return;
    const onTyping = ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    };
    const onStop = ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== userId));
    };

    socket.on('user_typing', onTyping);
    socket.on('user_stop_typing', onStop);

    return () => {
      socket.off('user_typing', onTyping);
      socket.off('user_stop_typing', onStop);
    };
  }, [socket]);

  // 3. Send Message with Corrected setQueryData
  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !conversationId || !content.trim()) return;

      const clientId = crypto.randomUUID();
      const tempMessage: Message = {
        id: clientId, // Temporary ID
        content,
        senderId: 'me',
        createdAt: new Date().toISOString(),
        pending: true,
        clientId, 
      };

      // Push to TanStack Cache optimistically
      queryClient.setQueryData<Message[]>(queryKey, (old) => {
        return [...(old || []), tempMessage];
      });

      socket.emit('send_dm', { conversationId, content, clientId });
    },
    [socket, conversationId, queryClient, queryKey]
  );

  // --- Emit typing ---
  const typing = useCallback(() => {
    if (!socket || !conversationId) return;
    socket.emit('typing_start', conversationId);

    const t = setTimeout(() => {
      socket.emit('typing_stop', conversationId);
    }, 800);

    return () => clearTimeout(t);
  }, [socket, conversationId]);

  return {
    messages, 
    sendMessage,
    typing,
    typingUsers,
    isLoading,
  };
};