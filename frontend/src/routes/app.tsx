import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChannelSidebar } from "@/components/app/ChannelSidebar";
import { ChatArea } from "@/components/app/ChatArea";
import { CreateWorkspaceModal, CreateChannelModal, InviteMemberModal } from "@/components/app/Modals";
import { Hexagon, Loader2, Plus } from "lucide-react";
import { EmptyState } from "@/components/app/EmptyState";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/axios";
import { useQuery ,useQueryClient} from "@tanstack/react-query";
import { ProfileMenu } from "@/components/app/ProfileMenu";

export const Route = createFileRoute("/app")({
  component: AppPage,
});

function AppPage() {
  const queryClient = useQueryClient();
  const { user: currentUser ,isLoading} = useAuth();
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
  
  if(isLoading){{
    return <div className="h-screen flex items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>;
  }}

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
      const {data} = await api.get(`/workspace/${activeWorkspaceId}`);
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
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Navigation Bar */}
      {activeWorkspace && (
        <div className="h-16 bg-surface/80 border-b border-border/30 flex items-center justify-between px-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Hexagon className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">{activeWorkspace.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateChannel(true)}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              + Channel
            </button>
            <button
              onClick={() => setShowInviteMember(true)}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
            >
              + Member
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Switcher - Vertical Rail */}
        <div className="w-20 bg-background border-r border-border/50 flex flex-col items-center py-4">
          <div className="mb-6 pb-4 border-b border-border/50 w-full flex justify-center">
            <Hexagon className="h-6 w-6 text-primary fill-primary/20" />
          </div>
          <div className="flex-1 flex flex-col items-center gap-3 w-full px-2">
            {workspaces.map((ws: any) => {
              const isActive = ws.id === activeWorkspaceId;
              const displayChar = ws.name.charAt(0).toUpperCase();

              return (
                <button
                  key={ws.id}
                  onClick={() => handleSelectWorkspace(ws.id)}
                  className={`w-14 h-14 flex items-center justify-center text-sm font-semibold transition-all duration-300 rounded-lg ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-secondary/50 text-foreground hover:bg-secondary"
                  }`}
                  title={ws.name}
                >
                  {ws.avatar ? <span className="text-lg">{ws.avatar}</span> : displayChar}
                </button>
              );
            })}
          </div>
          <div className="w-10 h-px bg-border/30 my-4" />
          <button
            onClick={() => setShowCreateWorkspace(true)}
            className="w-14 h-14 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
            title="Create workspace"
          >
            <Plus className="h-5 w-5" />
          </button>
          <div className="mt-4 pt-4 border-t border-border/50 w-full flex justify-center">
            <ProfileMenu />
          </div>
        </div>

        {activeWorkspace ? (
          <>
            {/* Channel Sidebar */}
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
            {/* Main Chat Area */}
            <ChatArea
              conversation={activeView === "channels" ? activeChannel : activeDM}
              type={activeView === "channels" ? "channel" : "dm"}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <EmptyState
              icon={Hexagon}
              title="No workspace selected"
              description="Select a workspace from the left to get started"
            />
          </div>
        )}
      </div>

      <CreateWorkspaceModal open={showCreateWorkspace} onClose={() => setShowCreateWorkspace(false)} onSuccess={()=>{
        queryClient.invalidateQueries({queryKey:['workspaces']});
      }}/>
      <CreateChannelModal open={showCreateChannel} onClose={() => setShowCreateChannel(false)} workspaceId={activeWorkspaceId} />
      <InviteMemberModal open={showInviteMember} onClose={() => setShowInviteMember(false)} workspaceId={activeWorkspaceId} />
    </div>
  );
}
