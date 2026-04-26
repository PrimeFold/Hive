import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocketContext } from '@/context/socket-context';
import api from '@/lib/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Message } from '@/types/message';


export const useChannel = (channelId:string)=>{
    const queryClient = useQueryClient();
    const socket = useSocketContext();

    const queryKey = ['channel_messages',channelId];

    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    const{data:messages = [],isLoading} = useQuery<Message[]>({
        queryKey,
        queryFn:async()=>{
            const res = await api.get<Message[]>(`/channels/${channelId}/messages`);
            return res.data;
        },
        enabled:!!channelId,
    })


    //-----------JOIN CHANNEL ROOM-----------------
    useEffect(()=>{
        if(!socket || !channelId) return ;
        socket.emit('join_channel',channelId)

        return ()=>{
            socket.emit('leave_channel',channelId);
        }

    },[socket,channelId])
    
    //--------------LISTEN FOR NEW CHANNEL MESSAGES---------
    useEffect(()=>{
        if(!socket) return

        const handleNewMessage = (msg:Message)=>{
            queryClient.setQueryData<Message[]>(queryKey,(old)=>{
                const prev = old || [];

                if(prev.some((m)=> m.id === msg.id)) return prev;

                const optimisticIndex = prev.findIndex((m)=>m.clientId === msg.clientId);

                if(optimisticIndex!==-1){
                    const updated = [...prev];
                    updated[optimisticIndex] = {...msg,pending:false};
                    return updated;
                }
                return [...prev,msg];

            })
        }

        socket.on('new_channel_message',handleNewMessage);

        return()=>{
            socket.off('new_channel_message',handleNewMessage)
        }
    },[socket,queryClient,queryKey])

    useEffect(() => {
        if (!socket) return;
            const onTyping = ({ userId }: { userId: string }) => {
            setTypingUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
        };
        const onStop = ({ userId }: { userId: string }) => {
          setTypingUsers((prev) => prev.filter((id) => id !== userId));
        };

        socket.on('channel_typing_start', onTyping);
        socket.on('channel_typing_stop', onStop);

        return () => {
          socket.off('channel_typing_start', onTyping);
          socket.off('channel_typing_stop', onStop);
        };
    }, [socket]);

    const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !channelId || !content.trim()) return;

      const clientId = crypto.randomUUID();
      const tempMessage: Message = {
        id: clientId,
        content,
        senderId: 'me',
        createdAt: new Date().toISOString(),
        pending: true,
        clientId, 
      };

      queryClient.setQueryData<Message[]>(queryKey, (old) => [...(old || []), tempMessage]);

      socket.emit('send_channel_message', { channelId, content, clientId });
    },
        [socket, channelId, queryClient, queryKey]
    );

    const typing = useCallback(() => {
    if (!socket || !channelId) return;
    socket.emit('channel_typing_start', channelId);
    const t = setTimeout(() => {
      socket.emit('channel_typing_stop', channelId);
    }, 800);
        return () => clearTimeout(t);
    }, [socket, channelId]);

    return {
      messages,
      sendMessage,
      typing,
      typingUsers,
      isLoading,
    };

}










