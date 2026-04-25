import { type Workspace, type Member } from "@/data/dummy";
import { Hash, Plus, Settings } from "lucide-react";

interface Props {
  workspace: Workspace;
  members: Member[];
  activeChannelId: string;
  onSelectChannel: (id: string) => void;
  onCreateChannel: () => void;
  onInviteMember: () => void;
}

export function ChannelSidebar({ workspace, members, activeChannelId, onSelectChannel, onCreateChannel, onInviteMember }: Props) {
  return (
    <div className="w-60 bg-surface border-r border-border flex flex-col">
      {/* Workspace header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground truncate">{workspace.name}</h2>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        {/* Channels */}
        <div className="px-3 mb-4">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Channels</span>
            <button
              onClick={onCreateChannel}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          {workspace.channels.map((ch) => {
            const isActive = ch.id === activeChannelId;
            return (
              <button
                key={ch.id}
                onClick={() => onSelectChannel(ch.id)}
                className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                {ch.name}
              </button>
            );
          })}
        </div>

        {/* Members */}
        <div className="px-3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Members</span>
            <button
              onClick={onInviteMember}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                  {m.avatar}
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface ${
                    m.online ? "bg-online" : "bg-muted-foreground/40"
                  }`}
                />
              </div>
              <span className="text-sm text-foreground/80 truncate">{m.displayName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
