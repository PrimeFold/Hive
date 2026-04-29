import { useMemo, useState } from "react";
import { Hash, Plus, Settings, Search, Mail } from "lucide-react";
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
  const [newFriend, setNewFriend] = useState("");

  // 1. HOOK PLACEMENT: Must be inside the component
  const { onlineUserIds } = usePresence(workspace.id);

  const filteredFriends = useMemo(
    () =>
      friends.filter((friend) =>
        [friend.displayName, friend.username].some((value) =>
          value.toLowerCase().includes(friendQuery.toLowerCase()),
        ),
      ),
    [friends, friendQuery],
  );

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

  const handleAddFriend = () => {
    const cleaned = newFriend.trim().replace(/^@/, "");
    if (!cleaned) return;
    onAddFriend(cleaned);
    setNewFriend("");
  };

  return (
    <div className="w-80 bg-surface/50 border-r border-border/50 flex flex-col h-screen">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-foreground truncate">{workspace.name}</h2>
          <p className="text-xs text-muted-foreground/70 mt-0.5">{workspace.channels.length} channels</p>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary/50 rounded-lg">
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-border/20">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <input
            type="search"
            value={friendQuery}
            onChange={(e) => setFriendQuery(e.target.value)}
            placeholder="Search channels, friends..."
            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-secondary/40 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-5">
        {/* --- CHANNELS SECTION --- */}
        <div>
          <div className="flex items-center justify-between mb-3 px-4">
            <div className="flex items-center gap-2">
              <Hash className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">Channels</span>
            </div>
            <motion.button
              onClick={onCreateChannel}
              className="text-muted-foreground/50 hover:text-foreground transition-colors p-1 hover:bg-secondary/50 rounded-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>
          <div className="space-y-1.5 px-2">
            {workspace.channels.map((ch) => {
              const isActive = ch.id === activeChannelId && activeView === "channels";
              return (
                <motion.button
                  key={ch.id}
                  onClick={() => onSelectChannel(ch.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/15 text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <Hash className="h-4 w-4 shrink-0" />
                  <span className="truncate">{ch.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* --- DIRECT MESSAGES SECTION --- */}
        <div>
          <div className="flex items-center justify-between mb-3 px-4">
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">Messages</span>
            </div>
            <motion.button
              onClick={() => onSelectDM(directMessages[0]?.id ?? "")}
              className="text-muted-foreground/50 hover:text-foreground transition-colors p-1 hover:bg-secondary/50 rounded-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>
          <div className="space-y-1.5 px-2">
            {filteredDirectMessages.map((dm) => {
              const friend = getMember(dm.userId);
              const lastMessage = dm.messages[dm.messages.length - 1];
              const isActive = dm.id === activeDMId && activeView === "dms";
              const isOnline = onlineUserIds.includes(friend.id);

              return (
                <motion.button
                  key={dm.id}
                  onClick={() => onSelectDM(dm.id)}
                  className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? "bg-primary/15 shadow-sm"
                      : "hover:bg-secondary/30"
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <div className="relative shrink-0 mt-0.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isOnline
                        ? "bg-green-500/20 text-green-600"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {friend.avatar}
                    </div>
                    {/* Status Indicator */}
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
                        <span className="text-[11px] text-muted-foreground/50 flex-shrink-0">
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

        {/* --- FRIENDS SECTION --- */}
        {filteredFriends.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-4">
              <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">Friends</span>
            </div>
            <div className="space-y-2 px-2">
              {filteredFriends.map((friend) => {
                const isOnline = onlineUserIds.includes(friend.id);

                return (
                  <motion.div
                    key={friend.id}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors"
                    whileHover={{ x: 2 }}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        isOnline
                          ? "bg-green-500/20 text-green-600"
                          : "bg-muted-foreground/10 text-muted-foreground"
                      }`}>
                        {friend.avatar}
                      </div>
                      <motion.span
                        className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-surface ${
                          isOnline ? "bg-green-500 shadow-md shadow-green-500/50" : "bg-muted-foreground/20"
                        }`}
                        animate={{ scale: isOnline ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 2, repeat: isOnline ? Infinity : 0 }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{friend.displayName}</p>
                      <p className="text-[11px] text-muted-foreground/50 truncate">@{friend.username}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
