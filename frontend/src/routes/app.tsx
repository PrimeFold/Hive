import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { WorkspaceSidebar } from "@/components/app/WorkspaceSidebar";
import { ChannelSidebar } from "@/components/app/ChannelSidebar";
import { ChatArea } from "@/components/app/ChatArea";
import { CreateWorkspaceModal, CreateChannelModal, InviteMemberModal } from "@/components/app/Modals";
import { Hexagon } from "lucide-react";
import { EmptyState } from "@/components/app/EmptyState";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/axios";
import { useQuery ,useQueryClient} from "@tanstack/react-query";

export const Route = createFileRoute("/app")({
  component: AppPage,
});

function AppPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("");
  const [activeChannelId, setActiveChannelId] = useState("");
  const [activeView, setActiveView] = useState<"channels" | "dms">("channels");
  const [activeDMId, setActiveDMId] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  const [directMessages, setDirectMessages] = useState<any[]>([]);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const { data: workspaces = [] } = useQuery({
  queryKey: ["workspaces"],
    queryFn: async () => {
      const { data } = await api.get("/workspaces");
      return data.data;
    },
  });

  
  const activeDM = directMessages.find((dm) => dm.id === activeDMId) ?? null;


  const { data : activeWorkspace } = useQuery({
    queryKey:['workspace',activeWorkspaceId],
    queryFn:async()=>{
      const {data} = await api.get(`/workspaces/${activeWorkspaceId}`);
      return data.data;
    },
    enabled:!!activeWorkspaceId,
  })
  const activeChannel = activeWorkspace?.channels?.find((c: any) => c.id === activeChannelId) ?? null;


  const handleSelectWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
    const ws = workspaces.find((w:any) => w.id === id);
    console.log("selected workspace:", ws); 
    if (ws && ws.channels?.length > 0) {
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
    if (!existing || (currentUser && existing.id === currentUser.id)) return;

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
            type={activeView === "channels" ? "channel" : "dm"}
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

      <CreateWorkspaceModal open={showCreateWorkspace} onClose={() => setShowCreateWorkspace(false)} onSuccess={()=>{
        queryClient.invalidateQueries({queryKey:['workspaces']});
      }}/>
      <CreateChannelModal open={showCreateChannel} onClose={() => setShowCreateChannel(false)} />
      <InviteMemberModal open={showInviteMember} onClose={() => setShowInviteMember(false)} />
    </div>
  );
}
