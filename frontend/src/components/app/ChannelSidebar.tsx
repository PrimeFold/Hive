import { useMemo, useState } from "react";
import { Hash, Settings, Mail } from "lucide-react";
import { getMember } from "@/lib/get-member";
import { formatTime } from "@/lib/utils";
import { usePresence } from "@/hooks/use-presence";
import type { ChannelSidebarProps } from "@/types/channel-sidebar";
import { motion } from "framer-motion";

export function ChannelSidebar({
  workspace,
  members,
  friends,
  directMessages,
  activeChannelId,
  activeDMId,
  activeView,
  onSelectChannel,
  onSelectDM,
  onCreateChannel,
  onInviteMember,
  onAddFriend,
}: ChannelSidebarProps) {
  const [friendQuery, setFriendQuery] = useState("");

  const { onlineUserIds } = usePresence(workspace.id);

  const filteredDirectMessages = useMemo(
    () =>
      directMessages.filter((dm) => {
        const friend = getMember(dm.userId);
        return [friend.displayName, friend.username]
          .join(" ")
          .toLowerCase()
          .includes(friendQuery.toLowerCase());
      }),
    [directMessages, friendQuery],
  );

  return (
    <div className="bg-surface flex flex-col h-full overflow-hidden">
      {/* Header - Hidden on mobile since it's in the top bar */}
      <div className="hidden sm:flex px-5 py-4 border-b border-border/30 items-center justify-between shrink-0">
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary/50 rounded-lg shrink-0">
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-4 space-y-6 px-2">
          {/* --- CHANNELS SECTION --- */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-4">
              <Hash className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
              <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wide">Channels</span>
              <span className="text-xs text-muted-foreground/40 ml-auto">{workspace.channels?.length || 0}</span>
            </div>
            <div className="space-y-1">
              {workspace.channels?.map((ch: any) => {
                const isActive = ch.id === activeChannelId && activeView === "channels";
                return (
                  <motion.button
                    key={ch.id}
                    onClick={() => onSelectChannel(ch.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                    }`}
                    whileHover={{ x: 2 }}
                  >
                    <Hash className="h-4 w-4 shrink-0" />
                    <span className="truncate">{ch.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* --- DIRECT MESSAGES SECTION --- */}
          {directMessages.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 px-4">
                <Mail className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wide">Messages</span>
                <span className="text-xs text-muted-foreground/40 ml-auto">{directMessages.length}</span>
              </div>
              <div className="space-y-1">
                {filteredDirectMessages.map((dm: any) => {
                  const friend = getMember(dm.userId);
                  const lastMessage = dm.messages?.[dm.messages.length - 1];
                  const isActive = dm.id === activeDMId && activeView === "dms";
                  const isOnline = onlineUserIds.includes(friend.id);

                  return (
                    <motion.button
                      key={dm.id}
                      onClick={() => onSelectDM(dm.id)}
                      className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all ${
                        isActive
                          ? "bg-primary/15 shadow-sm"
                          : "hover:bg-secondary/20"
                      }`}
                      whileHover={{ x: 2 }}
                    >
                      <div className="relative shrink-0 mt-0.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                          isOnline
                            ? "bg-green-500/20 text-green-600"
                            : "bg-secondary text-muted-foreground"
                        }`}>
                          {friend.avatar}
                        </div>
                        <motion.span
                          className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-surface transition-all ${
                            isOnline ? "bg-green-500 shadow-md shadow-green-500/50" : "bg-muted-foreground/30"
                          }`}
                          animate={{ scale: isOnline ? [1, 1.2, 1] : 1 }}
                          transition={{ duration: 2, repeat: isOnline ? Infinity : 0 }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                            {friend.displayName}
                          </span>
                          {lastMessage && (
                            <span className="text-[11px] text-muted-foreground/40 flex-shrink-0">
                              {formatTime(lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-muted-foreground/60 truncate mt-0.5">
                          {lastMessage?.content ?? "No messages yet"}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
