import { Search, Paperclip, Send, MessageSquare, Hash } from "lucide-react";
import { useState } from "react";
import { MessageList } from "./MessageList";
import { TypingIndicator } from "./TypingIndicator";
import { EmptyState } from "./EmptyState";
import { useDM } from "@/hooks/use-dm";
import { getMember } from "@/lib/get-member";
import { useChannel } from "@/hooks/use-channel";
import { motion } from "framer-motion";

type Channel = {
  id: string;
  name: string;
};

type Conversation = {
  id: string;
  participant: {
    id: string;
    displayName: string;
  };
};

interface Props {
  conversation: Channel | Conversation | null;
  type: "channel" | "dm";
}

export function ChatArea({ conversation, type }: Props) {
  const [message, setMessage] = useState("");
  const isDM = type === "dm";
  const conversationId = conversation?.id as string;
  const dm = useDM(isDM? conversationId : "");
  const channel = useChannel(!isDM? conversationId : "");

  const { messages, sendMessage, typing, typingUsers, isLoading } = isDM ? dm : channel;

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        <EmptyState
          icon={isDM ? MessageSquare : Hash}
          title={isDM ? "No direct message selected" : "No channel selected"}
          description={
            isDM
              ? "Choose a friend from the sidebar to start a DM"
              : "Pick a channel from the sidebar to start chatting"
          }
        />
      </div>
    );
  }

  // Type-safe recipient check
  const recipientId = isDM ? (conversation as Conversation).participant.id : null;
  const recipient = recipientId ? getMember(recipientId) : null;

  const title = isDM
    ? recipient?.displayName ?? "Direct message"
    : (conversation as Channel).name;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessage(message);
    setMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    // Trigger the socket emit for 'typing_start'
    typing();
  };

  return (
    <div className="flex-1 flex flex-col bg-background/50 min-w-0">
      {/* Modern Header */}
      <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between gap-4 bg-gradient-to-r from-background to-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2 rounded-lg ${isDM ? "bg-blue-500/10 text-blue-600" : "bg-purple-500/10 text-purple-600"}`}>
            {isDM ? (
              <MessageSquare className="h-4 w-4" />
            ) : (
              <Hash className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate">
              {title}
            </p>
            <p className="text-xs text-muted-foreground/70 truncate">
              {isDM
                ? `Direct conversation`
                : `Channel conversation`}
            </p>
          </div>
        </div>

        <motion.div
          className="relative hidden sm:flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-xs rounded-lg bg-secondary/40 border border-border/30 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-secondary transition-all"
          />
        </motion.div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col min-h-0">
        {messages.length > 0 ? (
          <MessageList messages={messages} isDM={isDM} />
        ) : (
          <EmptyState
            icon={isDM ? MessageSquare : Hash}
            title="No messages yet"
            description={
              isDM
                ? `Start the conversation with ${recipient?.displayName}`
                : `Be the first to say something in #${title}`
            }
          />
        )}
      </div>

      {/* Typing Indicator */}
      <motion.div
        className="px-6 h-7"
        animate={{ opacity: typingUsers.includes(recipientId ?? "") ? 1 : 0 }}
      >
        {isDM && recipientId && typingUsers.includes(recipientId) && (
          <TypingIndicator username={recipient?.displayName ?? "Someone"} />
        )}
      </motion.div>

      {/* Message Input Area */}
      <div className="px-6 pb-6 pt-2">
        <form
          onSubmit={handleSend}
          className="flex items-end gap-3 bg-secondary/30 rounded-xl px-4 py-3 border border-border/40 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/40 transition-all backdrop-blur-sm"
        >
          <motion.button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded-lg flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Paperclip className="h-5 w-5" />
          </motion.button>

          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder={
              isDM
                ? `Message ${recipient?.displayName}`
                : `Say something in #${title}`
            }
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none max-h-24 py-1"
          />

          <motion.button
            type="submit"
            disabled={!message.trim()}
            className="w-9 h-9 rounded-lg bg-primary/90 hover:bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </form>
        <p className="text-xs text-muted-foreground/50 mt-2">Press Enter to send</p>
      </div>
    </div>
  );
}
