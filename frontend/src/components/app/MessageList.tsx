import { useDM } from "@/hooks/use-dm";
import { Message } from "@/types/message";
import { MoreHorizontal } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { getMember } from "@/lib/get-member";

type Props={
  messages:Message[];
}


export function MessageList({ messages }: Props) {


  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
      {messages.map((msg, i) => {
        const sender = getMember(msg.senderId);
        const prev = i > 0 ? messages[i - 1] : null;
        const isGrouped = prev?.senderId === msg.senderId;

        return (
          <div
            key={msg.id}
            className="group relative hover:bg-secondary/30 rounded-md px-2 py-0.5 transition-colors"
          >
            {!isGrouped ? (
              <div className={`flex gap-2.5 ${i > 0 ? "mt-3" : ""}`}>
                <div className="w-9 h-9 rounded-full bg-secondary shrink-0 flex items-center justify-center text-xs font-medium text-muted-foreground mt-0.5">
                  {sender.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-foreground">{sender.displayName}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(msg.createdAt)}</span>
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ) : (
              <div className="pl-11.5">
                <p className="text-sm text-foreground/85 leading-relaxed">{msg.content}</p>
              </div>
            )}
            {/* Hover options */}
            <button className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-surface border border-border hover:bg-secondary">
              <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
