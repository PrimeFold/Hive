import { useMemo, useState } from "react";
import { Hash, Plus, Settings, Search } from "lucide-react";
import { getMember } from "@/lib/get-member";
import { formatTime } from "@/lib/utils";
import { usePresence } from "@/hooks/use-presence";
import type { ChannelSidebarProps } from "@/types/channel-sidebar";

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
    <div className="w-72 bg-surface border-r border-border flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground truncate">{workspace.name}</h2>
          <p className="text-xs text-muted-foreground">{workspace.channels.length} channels</p>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 py-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={friendQuery}
            onChange={(e) => setFriendQuery(e.target.value)}
            placeholder="Search friends or DMs"
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-4">
        {/* --- CHANNELS SECTION --- */}
        <div className="px-3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Channels</span>
            <button onClick={onCreateChannel} className="text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          {workspace.channels.map((ch) => {
            const isActive = ch.id === activeChannelId && activeView === "channels";
            return (
              <button
                key={ch.id}
                onClick={() => onSelectChannel(ch.id)}
                className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm transition-colors ${
                  isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Hash className="h-3.5 w-3.5 shrink-0" />
                {ch.name}
              </button>
            );
          })}
        </div>

        {/* --- DMs SECTION --- */}
        <div className="px-3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Direct messages</span>
            <button onClick={() => onSelectDM(directMessages[0]?.id ?? "")} className="text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          {filteredDirectMessages.map((dm) => {
            const friend = getMember(dm.userId);
            const lastMessage = dm.messages[dm.messages.length - 1];
            const isActive = dm.id === activeDMId && activeView === "dms";
            
            // DYNAMIC PRESENCE CHECK
            const isOnline = onlineUserIds.includes(friend.id);

            return (
              <button
                key={dm.id}
                onClick={() => onSelectDM(dm.id)}
                className={`w-full flex items-start gap-2 px-2 py-2 rounded-md text-left transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {friend.avatar}
                  </div>
                  {/* Status Indicator */}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface transition-colors ${isOnline ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground truncate">{friend.displayName}</span>
                    {lastMessage && <span className="text-[11px] text-muted-foreground">{formatTime(lastMessage.timestamp)}</span>}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{lastMessage?.content ?? "No messages yet"}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* --- FRIENDS SECTION --- */}
        <div className="px-3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Friends</span>
          </div>
          <div className="space-y-2">
            {filteredFriends.map((friend) => {
              // DYNAMIC PRESENCE CHECK
              const isOnline = onlineUserIds.includes(friend.id);
              
              return (
                <div key={friend.id} className="flex items-center gap-2 px-2 py-2 rounded-xl bg-secondary">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-muted-foreground/10 flex items-center justify-center text-xs font-medium text-muted-foreground">
                      {friend.avatar}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface transition-colors ${isOnline ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{friend.displayName}</p>
                    <p className="text-[11px] text-muted-foreground truncate">@{friend.username}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
