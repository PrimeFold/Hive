import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  UserPlus,
  Users,
  Search,
  Check,
  X,
  MoreHorizontal,
  Phone,
  MessageSquare,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriends, getPendingRequests, rejectFriendRequest, searchUser, sendFriendRequest } from "@/lib/friend";
import type { Friend } from "@/types/friends";
import { createConversation, getAllConversations } from "@/lib/conversation";
import { useAuth } from "@/context/authContext";
import { useNavigate } from "@tanstack/react-router";

type Tab = "conversations" | "friends" | "add";


export function RightSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState<Tab>("conversations");
  const {user} = useAuth()

  const {data:pendingRequest=[]}= useQuery({
    queryKey:['friends','pending'],
    queryFn:getPendingRequests,
    enabled:!!user
  }) 

 
  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 320 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="shrink-0 h-full flex flex-col bg-gradient-to-b from-[oklch(0.17_0.005_270)] to-[oklch(0.14_0.005_270)] border-l border-white/[0.06] relative"
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -left-3 top-6 h-6 w-6 rounded-full bg-[oklch(0.20_0.01_270)] border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[oklch(0.24_0.01_270)] transition-colors z-20 shadow-lg"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>

      {collapsed ? (
        <CollapsedRail tab={tab} onPick={(t) => { setTab(t); setCollapsed(false); }} pendingCount={pendingRequest.length} />
      ) : (
        <ExpandedPanel tab={tab} setTab={setTab}/>
      )}
    </motion.aside>
  );
}

function CollapsedRail({ tab, onPick , pendingCount }: { tab: Tab; onPick: (t: Tab) => void ;pendingCount: number; }) {
  const items: { id: Tab; icon: typeof MessageCircle; label: string; badge?: number }[] = [
    { id: "conversations", icon: MessageCircle, label: "Conversations", badge: 2 },
    { id: "friends", icon: Users, label: "Friends" },
    { id: "add", icon: UserPlus, label: "Add Friends", badge: pendingCount },
  ];
  return (
    <div className="flex flex-col items-center gap-2 pt-6 px-2">
      {items.map((it) => {
        const active = it.id === tab;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => onPick(it.id)}
            className={cn(
              "group relative h-10 w-10 rounded-xl flex items-center justify-center transition-all",
              active
                ? "bg-primary/20 text-primary shadow-[inset_0_0_0_1px_oklch(0.72_0.16_255/0.3)]"
                : "text-foreground/60 hover:text-foreground hover:bg-white/[0.05]"
            )}
          >
            <Icon className="h-4 w-4" />
            {it.badge ? (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
                {it.badge}
              </span>
            ) : null}
            <span className="pointer-events-none absolute right-full mr-3 px-2 py-1 rounded-md bg-black/85 text-[11px] whitespace-nowrap text-white opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all border border-white/10">
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ExpandedPanel({ tab, setTab  }: { tab: Tab; setTab: (t: Tab) => void ; }) {
  const tabs: { id: Tab; label: string; icon: typeof MessageCircle }[] = [
    { id: "conversations", label: "Chats", icon: MessageCircle },
    { id: "friends", label: "Friends", icon: Users },
    { id: "add", label: "Add", icon: UserPlus },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-[15px] font-semibold tracking-tight">Social</h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">Stay in touch with your circle</p>
      </div>

      {/* Segmented tabs */}
      <div className="mx-4 mb-3 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] flex relative">
        {tabs.map((t) => {
          const active = t.id === tab;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative flex-1 h-8 rounded-lg flex items-center justify-center gap-1.5 text-[11.5px] font-medium transition-colors z-10",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
              )}
            >
              {active && (
                <motion.span
                  layoutId="right-tab-pill"
                  className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/25 to-primary/10 border border-primary/20 shadow-[0_4px_12px_-4px_oklch(0.72_0.16_255/0.4)]"
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                />
              )}
              <Icon className="h-3.5 w-3.5 relative z-10" />
              <span className="relative z-10">{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {tab === "conversations" && <ConversationsTab />}
            {tab === "friends" && <FriendsTab />}
            {tab === "add" && <AddFriendsTab/>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ConversationsTab() {
  
  const { user } = useAuth();
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: getAllConversations,
  });

  const otherParticipant = (c: any) =>
    c.participantOne.id === user?.id ? c.participantTwo : c.participantOne;

  const lastMessage = (c: any) => c.messages?.[0]?.content ?? "";

  const navigate = useNavigate();

  return (
    <ul className="space-y-1">
      {conversations.map((c: any) => {
        const other = otherParticipant(c);
        return (
          <li key={c.id}>
            <button onClick={()=> navigate({to:'/app/dm/$conversationId',params:{conversationId:c.id}})} className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors text-left">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-400/40 flex items-center justify-center text-[11px] font-semibold shrink-0">
                {other.displayName?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-medium truncate">{other.displayName}</span>
                </div>
                <p className="text-[11.5px] text-muted-foreground/80 truncate mt-0.5">{lastMessage(c)}</p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function FriendsTab() {
   const {data:friends=[]}=useQuery({
    queryKey:['friends'],
    queryFn:getFriends
  })

  //const online = friends.filter((f) => f.status !== "offline");
  //const offline = friends.filter((f) => f.status === "offline");

  return (
    <div className="space-y-5">
    <Section label={`Friends — ${friends.length}`}>
      {friends.map((f: any) => (
        <FriendRow key={f.id} friend={f} />
      ))}
    </Section>
  </div>
  );
}

function FriendRow({ friend, dim }: { friend: Friend; dim?: boolean }) {
  const navigate = useNavigate();

  const {mutate:startConversation} = useMutation({
    mutationFn:(id:string)=>createConversation(id),
    onSuccess:(data)=>{
      navigate({to:"/app/dm/$conversationId",params:{conversationId:data.id}})
    }
  })

 

  return (
    <div className={cn("group flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-white/[0.05] transition-colors", dim && "opacity-60")}>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium truncate">{friend.displayName}</div>
        <div className="text-[11px] text-muted-foreground/80 truncate">{friend.username}</div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={()=>startConversation(friend.id)}>
          <IconBtn><MessageSquare className="h-3.5 w-3.5" /></IconBtn>
        </button>
        
        <IconBtn><Phone className="h-3.5 w-3.5" /></IconBtn>
        <IconBtn><MoreHorizontal className="h-3.5 w-3.5" /></IconBtn>
      </div>
    </div>
  );
}

function AddFriendsTab() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timeout);
  }, [query]);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['users', 'search', debouncedQuery],
    queryFn: () => searchUser(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['friends', 'pending'],
    queryFn: getPendingRequests,
  });

  const { mutate: sendRequest } = useMutation({
    mutationFn: (receiverId: string) => sendFriendRequest(receiverId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['friends', 'pending'] }),
  });

  const { mutate: acceptRequest } = useMutation({
    mutationFn: (friendshipId: string) => acceptFriendRequest(friendshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friends', 'pending'] });
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: (friendshipId: string) => rejectFriendRequest(friendshipId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['friends', 'pending'] }),
  });

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-4 bg-linear-to-br from-primary/15 via-fuchsia-500/10 to-transparent border border-white/[0.08]">
        <h3 className="text-[13px] font-semibold">Add a friend</h3>
        <p className="text-[11.5px] text-muted-foreground mt-0.5">Use their display name to send a request.</p>
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by display name..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-black/30 border border-white/10 text-[12.5px] placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>
        {debouncedQuery.length > 1 && (
          <div className="mt-2 space-y-1">
            {isSearching ? (
              <p className="text-[11.5px] text-muted-foreground/70 px-1">Searching...</p>
            ) : searchResults?.length === 0 ? (
              <p className="text-[11.5px] text-muted-foreground/70 px-1">No users found</p>
            ) : (
              searchResults?.map((user: any) => (
                <div key={user.id} className="flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-white/[0.05] transition-colors">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-400/40 flex items-center justify-center text-[11px] font-semibold shrink-0">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium truncate">{user.displayName}</div>
                    <div className="text-[11px] text-muted-foreground/80 truncate">@{user.username}</div>
                  </div>
                  <button
                    onClick={() => sendRequest(user.id)}
                    className="h-7 px-2.5 rounded-lg bg-white/[0.06] hover:bg-primary/20 hover:text-primary text-[11px] font-medium text-foreground/80 flex items-center gap-1 transition-colors"
                  >
                    <UserPlus className="h-3 w-3" /> Add
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Section label={`Pending — ${pendingRequests.length}`}>
        {pendingRequests.map((r: any) => (
          <div key={r.id} className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-400/40 flex items-center justify-center text-[11px] font-semibold shrink-0">
              {r.sender.displayName?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium truncate">{r.sender.displayName}</div>
              <div className="text-[11px] text-muted-foreground/80 truncate">@{r.sender.username}</div>
            </div>
            <button
              onClick={() => acceptRequest(r.id)}
              className="h-7 w-7 rounded-lg bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400/25 flex items-center justify-center transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => rejectRequest(r.id)}
              className="h-7 w-7 rounded-lg bg-white/[0.05] text-muted-foreground hover:bg-rose-400/15 hover:text-rose-300 flex items-center justify-center transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </Section>
    </div>
  );
}
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="px-3 mb-1.5 text-[10px] uppercase tracking-[0.12em] font-semibold text-muted-foreground/80">
        {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-7 w-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] text-foreground/70 hover:text-foreground flex items-center justify-center transition-colors">
      {children}
    </button>
  );
}
