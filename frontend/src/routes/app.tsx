import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { workspaces, members } from "@/data/dummy";
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
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const activeChannel = activeWorkspace?.channels.find((c) => c.id === activeChannelId) ?? null;

  const handleSelectWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
    const ws = workspaces.find((w) => w.id === id);
    if (ws && ws.channels.length > 0) {
      setActiveChannelId(ws.channels[0].id);
    } else {
      setActiveChannelId("");
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
            activeChannelId={activeChannelId}
            onSelectChannel={setActiveChannelId}
            onCreateChannel={() => setShowCreateChannel(true)}
            onInviteMember={() => setShowInviteMember(true)}
          />
          <ChatArea channel={activeChannel} />
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
