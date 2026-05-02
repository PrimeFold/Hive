import { Link } from "@tanstack/react-router";
import { conversationGroups } from "./mockData";
import { cn } from "@/lib/utils";
import { Search, Hash, MessageCircle, GitBranch, ChevronDown } from "lucide-react";

function iconFor(label: string) {
  if (label === "Channels") return Hash;
  if (label === "Direct Messages") return MessageCircle;
  return GitBranch;
}

export function ConversationsPanel({ activeRoomId = "general" }: { activeRoomId?: string }) {
  return (
    <aside className="w-[300px] shrink-0 h-full flex flex-col px-3 py-5 gap-4 bg-gradient-to-b from-[oklch(0.17_0.005_270)] to-[oklch(0.15_0.005_270)] border-r border-white/[0.06]">
      {/* Workspace header */}
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight">Halo Studio</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_oklch(0.75_0.18_150)]" />
              12 online
            </p>
          </div>
          <button className="h-7 w-7 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-muted-foreground transition-colors">
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative px-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          placeholder="Quick find…"
          className="w-full h-10 pl-10 pr-3 rounded-xl bg-white/4 border border-white/[0.06] text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:bg-white/[0.07] focus:border-white/10 transition-all"
        />
      </div>

      {/* Groups */}
      <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-5">
        {conversationGroups.map((group) => {
          const Icon = iconFor(group.label);
          return (
            <div key={group.label}>
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-muted-foreground/80">
                  {group.label}
                </span>
                <span className="text-[10px] text-muted-foreground/60">{group.rooms.length}</span>
              </div>
              <ul className="space-y-0.5">
                {group.rooms.map((r) => {
                  const active = r.id === activeRoomId;
                  return (
                    <li key={r.id}>
                      <button
                        className={cn(
                          "w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
                          active
                            ? "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                            : "hover:bg-white/[0.04] text-foreground/75"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-primary shadow-[0_0_12px_var(--primary)]" />
                        )}
                        <span
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            active
                              ? "bg-primary/20 text-primary"
                              : "bg-white/[0.04] text-foreground/60 group-hover:text-foreground/90"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1 text-left">
                          <div className="flex items-center justify-between gap-2">
                            <span className={cn("text-[13px] truncate", active ? "font-semibold" : "font-medium")}>
                              {r.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground/70 shrink-0">{r.timestamp}</span>
                          </div>
                          {r.lastMessage && (
                            <p className="text-[11.5px] text-muted-foreground/80 truncate mt-0.5">
                              {r.lastMessage}
                            </p>
                          )}
                        </div>
                        {r.unread ? (
                          <span className="ml-1 shrink-0 min-w-[18px] h-[18px] px-1.5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center shadow-[0_0_12px_oklch(0.72_0.16_255/0.5)]">
                            {r.unread}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Footer auth links */}
      <div className="flex gap-2 pt-3 border-t border-white/[0.06]">
        <Link
          to="/signin"
          className="flex-1 text-center text-xs py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
        >
          Sign in
        </Link>
        <Link
          to="/signup"
          className="flex-1 text-center text-xs py-2 rounded-lg bg-gradient-to-r from-primary to-[oklch(0.65_0.20_295)] text-primary-foreground hover:opacity-90 transition-opacity font-medium shadow-[0_4px_16px_-4px_oklch(0.72_0.16_255/0.6)]"
        >
          Sign up
        </Link>
      </div>
    </aside>
  );
}
