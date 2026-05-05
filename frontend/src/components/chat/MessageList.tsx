import { motion } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { useQuery } from "@tanstack/react-query";
import { getMessagesByChannelId } from "#/lib/message";
import { getDirectMessages } from "#/lib/direct-messages";

interface messageListProps {
  id:string;
  typingUsers: string[];
  mode:'channel' | 'dm'

}

export function MessageList({id,typingUsers,mode}:messageListProps) {
  const {data:messages = [], isLoading, error} = useQuery({
    queryKey: [mode === 'channel' ? 'messages' : 'dm', id],
    queryFn:()=> mode === 'channel' ? getMessagesByChannelId(id) : getDirectMessages(id)
  })

  console.log('MessageList:', { id, mode, messagesCount: messages.length, isLoading, error: error?.message })

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.3s]" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.15s]" />
            <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" />
          </div>
          <span className="text-sm text-muted-foreground">Loading messages...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-400/80">Failed to load messages</p>
          <p className="text-xs text-muted-foreground mt-1">{(error as Error).message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-10 space-y-6">
        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground/70 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
            Today · May 2
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {messages.map((m:any, i:any) => {
          const prev = messages[i - 1];
          const grouped = !!prev && prev.username === m.username && prev.self === m.self;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
              className={grouped ? "-mt-3" : ""}
            >
              <MessageBubble message={m} grouped={grouped} />
            </motion.div>
          );
        })}

        {typingUsers.length > 0 && (
          <div className="flex items-center gap-3 pl-12 text-[11.5px] text-muted-foreground/80">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
            </div>
            <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing…</span>
          </div>
        )}
      </div>
    </div>
  );
}
