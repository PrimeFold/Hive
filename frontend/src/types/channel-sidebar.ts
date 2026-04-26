import type { DirectMessage } from "@/types/direct-message";
import type { Member } from "@/types/member";
import type { Workspace } from "@/types/workspace";

export type ChannelSidebarView = "channels" | "dms";

export interface ChannelSidebarProps {
  workspace: Workspace;
  members: Member[];
  friends: Member[];
  directMessages: DirectMessage[];
  activeChannelId: string;
  activeDMId: string;
  activeView: ChannelSidebarView;
  onSelectChannel: (id: string) => void;
  onSelectDM: (id: string) => void;
  onCreateChannel: () => void;
  onInviteMember: () => void;
  onAddFriend: (username: string) => void;
}
