import { getMember } from "@/lib/get-member";
import { formatTime } from "@/lib/utils";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { MoreHorizontal, Loader2, Trash2 } from "lucide-react";
import { memo } from "react";
import { Message } from "@/types/message";
import api from "@/lib/axios";

interface MessageItemProps {
  msg: Message;
  isGrouped: boolean;
  isFirst: boolean;
  isDM?: boolean;
}

export const MessageItem = memo(function MessageItem({
  msg,
  isGrouped,
  isFirst,
  isDM = false,
}: MessageItemProps) {
  const sender = getMember(msg.senderId);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const endpoint = isDM ? `/direct-messages/${msg.id}` : `/messages/${msg.id}`;
      const { data } = await api.delete(endpoint);
      return data;
    },
    onSuccess: () => {
      // Modify this baseKey if your useDM hook uses a different query key (e.g. "directMessages")
      const baseKey = isDM ? ["direct-messages"] : ["messages"];
      queryClient.setQueriesData({ queryKey: baseKey }, (old: any) => {
        if (!old) return old;
        // Filter out the deleted message from the list
        return old.filter((m: Message) => m.id !== msg.id);
      });
    },
  });

  return (
    <div className="group relative hover:bg-secondary/30 rounded-md px-2 py-0.5 transition-colors">
      {/* Logic Check: 
         If not grouped, show the full header. 
         If grouped, show only the timestamp on hover (left side).
      */}
      {!isGrouped ? (
        <div className={`flex gap-3 ${!isFirst ? "mt-4" : ""}`}>
          <div className="w-9 h-9 rounded-full bg-secondary shrink-0 flex items-center justify-center text-xs font-medium text-muted-foreground mt-0.5 overflow-hidden">
            {sender.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-sm font-semibold text-foreground hover:underline cursor-pointer">
                {sender.displayName}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {formatTime(msg.createdAt)}
              </span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed break-words">
              {msg.content}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex group/item">
          {/* Timestamp appears where the avatar would be on hover */}
          <div className="w-9 shrink-0 flex items-center justify-center mr-3">
            <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity select-none">
              {formatTime(msg.createdAt).split(" ")[0]} {/* Shows just the time, no AM/PM if too tight */}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground/90 leading-relaxed break-words">
              {msg.content}
            </p>
          </div>
        </div>
      )}

      {/* Hover Menu - Repositioned for better UX */}
      <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 p-1 rounded-md bg-background border border-border shadow-sm z-10">
        <button className="p-1 hover:bg-secondary rounded text-muted-foreground transition-colors">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
        <button 
          onClick={() => {
            if(window.confirm("Delete message?")) deleteMutation.mutate();
          }} 
          disabled={deleteMutation.isPending}
          className="p-1 hover:bg-destructive/10 hover:text-destructive rounded text-muted-foreground transition-colors"
        >
          {deleteMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
});