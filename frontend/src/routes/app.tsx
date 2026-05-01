import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChannelSidebar } from "@/components/app/ChannelSidebar";
import { ChatArea } from "@/components/app/ChatArea";
import { CreateWorkspaceModal, CreateChannelModal, InviteMemberModal } from "@/components/app/Modals";
import { Hexagon, Loader2, Plus, Menu, X } from "lucide-react";
import { EmptyState } from "@/components/app/EmptyState";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/axios";
import { useQuery ,useQueryClient} from "@tanstack/react-query";
import { ProfileMenu } from "@/components/app/ProfileMenu";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/app")({
  component: AppPage,
});

function AppPage() {
  const queryClient = useQueryClient();
  const { user: currentUser ,isLoading} = useAuth();
  const isMobile = useIsMobile();
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  if(isLoading){{
    return <div className="h-screen flex items-center justify-center bg-background">
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
    if (isMobile) setSidebarOpen(false);
  };

  const handleSelectChannel = (id: string) => {
    setActiveView("channels");
    setActiveChannelId(id);
    if (isMobile) setSidebarOpen(false);
  };

  const handleSelectDM = (id: string) => {
    setActiveView("dms");
    setActiveDMId(id);
    if (isMobile) setSidebarOpen(false);
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
      {/* Desktop: Horizontal layout | Mobile: Stacked */}
      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Rail */}
        <div className="hidden sm:flex w-18 bg-background border-r border-border/30 flex-col items-center py-3 gap-3">
          {/* Logo */}
          <div className="mb-2">
            <Hexagon className="h-5 w-5 text-primary" />
          </div>

          {/* Workspace List */}
          <div className="flex flex-col items-center gap-2.5 flex-1">
            {workspaces.map((ws: any) => {
              const isActive = ws.id === activeWorkspaceId;
              const displayChar = ws.name.charAt(0).toUpperCase();

              return (
                <div key={ws.id} className="relative flex items-center group">
                  {isActive && (
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r" />
                  )}
                  <button
                    onClick={() => handleSelectWorkspace(ws.id)}
                    title={ws.name}
                    className={`w-11 h-11 flex items-center justify-center text-sm font-semibold transition-all duration-200 rounded-lg ${
                      isActive
                        ? "bg-primary text-primary-foreground rounded-xl shadow-md"
                        : "bg-secondary/40 text-foreground hover:bg-secondary"
                    }`}
                  >
                    {ws.avatar ? <span className="text-base">{ws.avatar}</span> : displayChar}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-6 h-px bg-border/30" />

          {/* Create Workspace Button */}
          <button
            onClick={() => setShowCreateWorkspace(true)}
            title="Create workspace"
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-secondary/40 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Plus className="h-5 w-5" />
          </button>

          {/* User Avatar */}
          <div className="mt-auto pt-3 border-t border-border/30 w-full flex justify-center">
            <ProfileMenu />
          </div>
        </div>

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-4 left-4 z-40 p-2 rounded-lg hover:bg-secondary/40"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}

        {/* Channel Sidebar - Mobile Overlay / Desktop Fixed */}
        {(!isMobile || sidebarOpen) && (
          <div className={`${isMobile ? "absolute left-0 top-0 h-full z-30 w-64" : "w-64"} bg-surface border-r border-border/30 flex flex-col`}>
            {isMobile && <div className="h-16" />}
            {activeWorkspace ? (
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
            ) : (
              <div className="h-16 border-b border-border/30 flex items-center px-5">
                <p className="text-sm font-semibold text-muted-foreground">No workspace</p>
              </div>
            )}
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeWorkspace && (
            <div className="h-16 bg-surface border-b border-border/30 flex items-center justify-between px-4 sm:px-6 gap-4">
              {isMobile && <div className="w-8" />}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Hexagon className="h-5 w-5 text-primary shrink-0" />
                <h1 className="text-base sm:text-lg font-bold text-foreground truncate">
                  {activeWorkspace.name}
                </h1>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowCreateChannel(true)}
                  className="hidden sm:block px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  + Channel
                </button>
                <button
                  onClick={() => setShowInviteMember(true)}
                  className="hidden sm:block px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                >
                  + Member
                </button>
              </div>
            </div>
          )}

          {activeWorkspace ? (
            <ChatArea
              conversation={activeView === "channels" ? activeChannel : activeDM}
              type={activeView === "channels" ? "channel" : "dm"}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <EmptyState
                icon={Hexagon}
                title="Select a workspace"
                description={isMobile ? "Tap the menu to choose a workspace" : "Select a workspace from the left to get started"}
              />
            </div>
          )}
        </div>
      </div>

      <CreateWorkspaceModal open={showCreateWorkspace} onClose={() => setShowCreateWorkspace(false)} onSuccess={()=>{
        queryClient.invalidateQueries({queryKey:['workspaces']});
      }}/>
      <CreateChannelModal open={showCreateChannel} onClose={() => setShowCreateChannel(false)} workspaceId={activeWorkspaceId} />
      <InviteMemberModal open={showInviteMember} onClose={() => setShowInviteMember(false)} workspaceId={activeWorkspaceId} />

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
