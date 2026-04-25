import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { workspaces, members, friends as initialFriends, directMessages as initialDirectMessages, currentUser } from "@/data/dummy";
import { WorkspaceSidebar } from "@/components/app/WorkspaceSidebar";
import { ChannelSidebar } from "@/components/app/ChannelSidebar";
import { ChatArea } from "@/components/app/ChatArea";
import { CreateWorkspaceModal, CreateChannelModal, InviteMemberModal } from "@/components/app/Modals";
import { Hexagon } from "lucide-react";
import { EmptyState } from "@/components/app/EmptyState";

export const Route = createFileRoute("/app")({
  component: AppPage,
});

function AppPage() {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(workspaces[0].id);
  const [activeChannelId, setActiveChannelId] = useState(workspaces[0].channels[0].id);
  const [activeView, setActiveView] = useState<"channels" | "dms">("channels");
  const [activeDMId, setActiveDMId] = useState(initialDirectMessages[0]?.id ?? "");
  const [friends, setFriends] = useState(initialFriends);
  const [directMessages, setDirectMessages] = useState(initialDirectMessages);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const activeChannel = activeWorkspace?.channels.find((c) => c.id === activeChannelId) ?? null;
  const activeDM = directMessages.find((dm) => dm.id === activeDMId) ?? null;

  const handleSelectWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
    const ws = workspaces.find((w) => w.id === id);
    if (ws && ws.channels.length > 0) {
      setActiveChannelId(ws.channels[0].id);
    } else {
      setActiveChannelId("");
    }
    setActiveView("channels");
  };

  const handleSelectChannel = (id: string) => {
    setActiveView("channels");
    setActiveChannelId(id);
  };

  const handleSelectDM = (id: string) => {
    setActiveView("dms");
    setActiveDMId(id);
  };

  const handleAddFriend = (username: string) => {
    const normalized = username.trim().replace(/^@/, "").toLowerCase();
    if (!normalized) return;

    const existing = members.find(
      (member) =>
        member.username.toLowerCase() === normalized || member.displayName.toLowerCase() === normalized,
    );
    if (!existing || existing.id === currentUser.id) return;

    if (friends.some((friend) => friend.id === existing.id)) {
      return;
    }

    setFriends((prev) => [existing, ...prev]);

    if (!directMessages.some((dm) => dm.userId === existing.id)) {
      setDirectMessages((prev) => [
        {
          id: `d${prev.length + 1}`,
          userId: existing.id,
          messages: [],
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <WorkspaceSidebar
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={handleSelectWorkspace}
        onCreateWorkspace={() => setShowCreateWorkspace(true)}
      />

      {activeWorkspace ? (
        <>
          <ChannelSidebar
            workspace={activeWorkspace}
            members={members}
            friends={friends}
            directMessages={directMessages}
            activeChannelId={activeChannelId}
            activeDMId={activeDMId}
            activeView={activeView}
            onSelectChannel={handleSelectChannel}
            onSelectDM={handleSelectDM}
            onCreateChannel={() => setShowCreateChannel(true)}
            onInviteMember={() => setShowInviteMember(true)}
            onAddFriend={handleAddFriend}
          />
          <ChatArea
            conversation={activeView === "channels" ? activeChannel : activeDM}
            type={activeView}
          />
        </>
      ) : (
        <div className="flex-1 flex flex-col">
          <EmptyState
            icon={Hexagon}
            title="No workspace selected"
            description="Select a workspace from the sidebar to get started"
          />
        </div>
      )}

      <CreateWorkspaceModal open={showCreateWorkspace} onClose={() => setShowCreateWorkspace(false)} />
      <CreateChannelModal open={showCreateChannel} onClose={() => setShowCreateChannel(false)} />
      <InviteMemberModal open={showInviteMember} onClose={() => setShowInviteMember(false)} />
    </div>
  );
}
