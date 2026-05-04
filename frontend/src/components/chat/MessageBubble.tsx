import { useAuth } from "#/context/authContext";
import type { Message } from "@/types/message";
import { cn } from "@/lib/utils";

export function MessageBubble({ message, grouped = false }: { message: Message; grouped?: boolean }) {

  const {user} = useAuth()

  const self = message.userId === user?.id;
  const username = message.user.username.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={cn("flex w-full gap-3 group", self ? "justify-end" : "justify-start")}>
      {!self && (
        <div className="w-9 shrink-0">
          {!grouped && (
            <div
              className={cn(
                "h-9 w-9 rounded-full bg-gradient-to-br flex items-center justify-center text-[11px] font-semibold text-white shadow-md",
                message.avatarColor ?? "from-slate-400 to-slate-600"
              )}
            >
              {username}
            </div>
          )}
        </div>
      )}

      <div className={cn("max-w-[68%] flex flex-col gap-1", self ? "items-end" : "items-start")}>
        {!grouped && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-[12.5px] font-semibold text-foreground/90">{username}</span>
            <span className="text-[10px] text-muted-foreground/70">{timestamp}</span>
          </div>
        )}
        <div
          className={cn(
            "px-4 py-2.5 text-[14px] leading-relaxed transition-all",
            "shadow-[0_2px_10px_-2px_rgba(0,0,0,0.25)]",
            self
              ? "bg-gradient-to-br from-primary to-[oklch(0.62_0.20_270)] text-primary-foreground rounded-2xl rounded-br-md shadow-[0_8px_24px_-8px_oklch(0.72_0.16_255/0.55)]"
              : "bg-white/5 backdrop-blur border border-white/[0.06] text-foreground rounded-2xl rounded-bl-md hover:bg-white/[0.07]"
          )}
        >
          {message.content}
        </div>
      </div>

      {self && grouped && <div className="w-9 shrink-0" />}
    </div>
  );
}
