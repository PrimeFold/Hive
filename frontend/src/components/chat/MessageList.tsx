import { motion } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { useQuery } from "@tanstack/react-query";
import { getMessagesByChannelId } from "#/lib/message";
import { getDirectMessages } from "#/lib/direct-messages";

interface MessageListProps {
  id: string;
  typingUsers: string[];
  mode: "channel" | "dm";
}

export function MessageList({ id, typingUsers, mode }: MessageListProps) {
  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [mode === "channel" ? "messages" : "dm", id],
    queryFn: () =>
      mode === "channel"
        ? getMessagesByChannelId(id)
        : getDirectMessages(id),
  });

  // ✅ Normalize messages (CRUCIAL)
  const normalizeMessage = (msg: any) => ({
    id: msg?.id,
    content: msg?.content ?? "",
    createdAt: msg?.createdAt ?? new Date().toISOString(),
    userId: msg?.userId ?? msg?.senderId ?? null,
    user: msg?.user ?? msg?.sender ?? null,
  });

  const safeMessages = messages
    .map(normalizeMessage)
    .filter((m: any) => m.id && m.userId); // 🚫 remove garbage

  console.log("SAFE MESSAGES:", safeMessages);

  // ✅ Grouping logic (sender + time)
  const getSenderId = (msg: any) => msg?.userId ?? null;

  const isGrouped = (prev: any, curr: any) => {
    if (!prev || !curr) return false;

    const sameSender = getSenderId(prev) === getSenderId(curr);

    const prevTime = new Date(prev.createdAt).getTime();
    const currTime = new Date(curr.createdAt).getTime();

    const withinTimeWindow = Math.abs(currTime - prevTime) < 5 * 60 * 1000;

    return sameSender && withinTimeWindow;
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <span className="text-sm text-muted-foreground">
          Loading messages...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <span className="text-sm text-red-400">
          Failed to load messages
        </span>
      </div>
    );
  }

  if (safeMessages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <span className="text-sm text-muted-foreground">
          No messages yet
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-10 space-y-1">
        {safeMessages.map((m: any, i: number) => {
          const grouped = isGrouped(safeMessages[i - 1], m);

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.25 }}
              className={grouped ? "-mt-2" : "mt-4"}
            >
              <MessageBubble message={m} grouped={grouped} />
            </motion.div>
          );
        })}

        {/* typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-3 pl-12 text-xs text-muted-foreground">
            <span>
              {typingUsers.join(", ")}{" "}
              {typingUsers.length === 1 ? "is" : "are"} typing...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}