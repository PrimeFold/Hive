import { useEffect, useState, useCallback } from 'react';
import { useSocketContext } from '@/context/socket-context';
import api from '@/lib/axios';

import type { Message } from '@/types/message';

export const useDM = (conversationId: string) => {
  const socket = useSocketContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // 1) Load initial history (HTTP)
  useEffect(() => {
    if (!conversationId) return;

    (async () => {
      const res = await api.get(`/conversations/${conversationId}/messages`);
      setMessages(res.data);
    })();
  }, [conversationId]);

  // -----------------------JOIN ROOM-----------------------------
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit('join_conversation', conversationId);
  }, [socket, conversationId]);

  // ------------------------LISTEN FOR NEW MESAGES------------------------
  useEffect(() => {
    if (!socket) return;

    const handleNewDM = (msg: Message) => {
      setMessages(prev => {
        const tempExists = prev.find(m=> m.clientId === msg.clientId);
        // guard against duplicates
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on('new_dm', handleNewDM);
    

    return () => {
      socket.off('new_dm', handleNewDM);
    };
  }, [socket]);

  //  Typing indicators
  useEffect(() => {
    if (!socket) return;

    const onTyping = ({ userId }: { userId: string }) => {
      setTypingUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    };

    const onStop = ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => prev.filter(id => id !== userId));
    };

    socket.on('user_typing', onTyping);
    socket.on('user_stop_typing', onStop);

    return () => {
      socket.off('user_typing', onTyping);
      socket.off('user_stop_typing', onStop);
    };
  }, [socket]);

  //  Send message
  const sendMessage = useCallback((content: string) => {
      if (!socket || !conversationId || !content.trim()) return;
      
      const clientId = crypto.randomUUID();
      const tempMessage = {
        id: clientId ,
        content,
        senderId: 'me',
        createdAt: new Date().toISOString(),
        pending: true, 
      };

      setMessages(prev=>[...prev,tempMessage])
      
      socket.emit('send_dm', {conversationId, content,clientId});

      setTimeout(() => {
        setMessages(prev =>
          prev.map(m =>
            m.clientId === clientId && m.pending
              ? { ...m, pending: false, failed: true }
              : m
          )
        );
      }, 5000);

      

    },



    [socket, conversationId]
  );

  //  Emit typing
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
  };
};