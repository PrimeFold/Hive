import { Search, Paperclip, ArrowUp, MessageSquare, Hash } from "lucide-react";
import { useState } from "react";
import { MessageList } from "./MessageList";
import { TypingIndicator } from "./TypingIndicator";
import { EmptyState } from "./EmptyState";
import { useDM } from "@/hooks/use-dm";
import { getMember } from "@/lib/get-member";
import { useChannel } from "@/hooks/use-channel";

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
    <div className="flex-1 flex flex-col bg-background min-w-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 min-w-0">
          {isDM ? (
            <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {isDM
                ? `Direct message with ${recipient?.displayName}`
                : `Channel #${title}`}
            </p>
          </div>
        </div>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages..."
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48 transition-all"
          />
        </div>
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

      {/* Typing Indicator: Show if the recipient is in the typingUsers array */}
      <div className="px-4 h-6">
         {isDM && recipientId && typingUsers.includes(recipientId) && (
           <TypingIndicator username={recipient?.displayName ?? "Someone"} />
         )}
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-2.5 border border-border focus-within:border-primary/50 transition-all"
        >
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder={
              isDM
                ? `Message ${recipient?.displayName}`
                : `Message #${title}`
            }
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="w-8 h-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 transition-colors flex items-center justify-center"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}