import { type Channel } from "@/data/dummy";
import { Search, Paperclip, ArrowUp, MessageSquare, Hash } from "lucide-react";
import { useState } from "react";
import { MessageList } from "./MessageList";
import { TypingIndicator } from "./TypingIndicator";
import { EmptyState } from "./EmptyState";

interface Props {
  channel: Channel | null;
}

export function ChatArea({ channel }: Props) {
  const [message, setMessage] = useState("");

  if (!channel) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        <EmptyState
          icon={Hash}
          title="No channel selected"
          description="Pick a channel from the sidebar to start chatting"
        />
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log("Send message:", { channel: channel.name, content: message });
    setMessage("");
  };

  return (
    <div className="flex-1 flex flex-col bg-background min-w-0">
      {/* Top bar */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{channel.name}</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-48 transition-colors"
          />
        </div>
      </div>

      {/* Messages */}
      {channel.messages.length > 0 ? (
        <MessageList messages={channel.messages} />
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description={`Be the first to say something in #${channel.name}`}
        />
      )}

      {/* Typing indicator */}
      {channel.messages.length > 0 && <TypingIndicator username="Marcus" />}

      {/* Input */}
      <div className="px-4 pb-4">
        <form onSubmit={handleSend} className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-2.5 border border-border focus-within:ring-2 focus-within:ring-primary/50 transition-all">
          <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message #${channel.name}`}
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
