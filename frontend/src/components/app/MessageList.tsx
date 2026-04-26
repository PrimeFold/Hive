import { useEffect, useRef } from "react";
import { Message } from "@/types/message";
import { MessageItem } from "./MessageItem";

type Props = {
  messages: Message[];
  isDM?: boolean;
};

export function MessageList({ messages, isDM = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Auto-scroll to the bottom whenever messages change
  useEffect(() => {
    if (!containerRef.current) return;

    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;

    // Auto-scroll if it's the first render, or if the user is already near the bottom
    // (A threshold of ~250px accounts for the height of incoming messages)
    if (isFirstRender.current || distanceToBottom < 250) {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: isFirstRender.current ? "auto" : "smooth" 
      });
    }

    isFirstRender.current = false;
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
      {messages.map((msg, i) => {
        const prev = i > 0 ? messages[i - 1] : null;

        // Grouping Logic: Same sender AND sent within 5 minutes
        const isSameSender = prev?.senderId === msg.senderId;
        const isCloseInTime = prev && new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000;
        
        const isGrouped = Boolean(isSameSender && isCloseInTime);

        return (
          <MessageItem key={msg.id} msg={msg} isGrouped={isGrouped} isFirst={i === 0} isDM={isDM} />
        );
      })}
      
      {/* Invisible div to act as a scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
}