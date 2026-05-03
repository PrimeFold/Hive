import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { conversations, friends, friendRequests, type Friend } from "./mockData";
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

type Tab = "conversations" | "friends" | "add";

const statusRing: Record<Friend["status"], string> = {
  online: "bg-emerald-400 shadow-[0_0_8px_oklch(0.75_0.18_150)]",
  idle: "bg-amber-400",
  dnd: "bg-rose-400",
  offline: "bg-zinc-500",
};

export function RightSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState<Tab>("conversations");

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
        <CollapsedRail tab={tab} onPick={(t) => { setTab(t); setCollapsed(false); }} />
      ) : (
        <ExpandedPanel tab={tab} setTab={setTab} />
      )}
    </motion.aside>
  );
}

function CollapsedRail({ tab, onPick }: { tab: Tab; onPick: (t: Tab) => void }) {
  const items: { id: Tab; icon: typeof MessageCircle; label: string; badge?: number }[] = [
    { id: "conversations", icon: MessageCircle, label: "Conversations", badge: 2 },
    { id: "friends", icon: Users, label: "Friends" },
    { id: "add", icon: UserPlus, label: "Add Friends", badge: friendRequests.length },
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

function ExpandedPanel({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
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
            {tab === "add" && <AddFriendsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ConversationsTab() {
  return (
    <ul className="space-y-1">
      {conversations.map((c) => (
        <li key={c.id}>
          <button className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors text-left">
            <div className="relative shrink-0">
              <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${c.avatarColor}`} />
              <span className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-[oklch(0.16_0.005_270)]",
                statusRing[c.status]
              )} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-medium truncate">{c.name}</span>
                <span className="text-[10px] text-muted-foreground/70 shrink-0">{c.timestamp}</span>
              </div>
              <p className="text-[11.5px] text-muted-foreground/80 truncate mt-0.5">{c.lastMessage}</p>
            </div>
            {c.unread ? (
              <span className="ml-1 shrink-0 min-w-[18px] h-[18px] px-1.5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                {c.unread}
              </span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}

function FriendsTab() {
  const online = friends.filter((f) => f.status !== "offline");
  const offline = friends.filter((f) => f.status === "offline");

  return (
    <div className="space-y-5">
      <Section label={`Online — ${online.length}`}>
        {online.map((f) => (
          <FriendRow key={f.id} friend={f} />
        ))}
      </Section>
      <Section label={`Offline — ${offline.length}`}>
        {offline.map((f) => (
          <FriendRow key={f.id} friend={f} dim />
        ))}
      </Section>
    </div>
  );
}

function FriendRow({ friend, dim }: { friend: Friend; dim?: boolean }) {
  return (
    <div className={cn("group flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-white/[0.05] transition-colors", dim && "opacity-60")}>
      <div className="relative shrink-0">
        <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${friend.avatarColor}`} />
        <span className={cn(
          "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-[oklch(0.16_0.005_270)]",
          statusRing[friend.status]
        )} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium truncate">{friend.name}</div>
        <div className="text-[11px] text-muted-foreground/80 truncate">{friend.activity || friend.handle}</div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconBtn><MessageSquare className="h-3.5 w-3.5" /></IconBtn>
        <IconBtn><Phone className="h-3.5 w-3.5" /></IconBtn>
        <IconBtn><MoreHorizontal className="h-3.5 w-3.5" /></IconBtn>
      </div>
    </div>
  );
}

function AddFriendsTab() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-4 bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-transparent border border-white/[0.08]">
        <h3 className="text-[13px] font-semibold">Add a friend</h3>
        <p className="text-[11.5px] text-muted-foreground mt-0.5">Use their username to send a request.</p>
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="username#0000"
            className="w-full h-10 pl-9 pr-24 rounded-xl bg-black/30 border border-white/10 text-[12.5px] placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/40 transition-colors"
          />
          <button className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-3 rounded-lg bg-gradient-to-r from-primary to-[oklch(0.65_0.20_295)] text-primary-foreground text-[11px] font-semibold hover:opacity-90 transition-opacity">
            Send
          </button>
        </div>
      </div>

      <Section label={`Pending — ${friendRequests.length}`}>
        {friendRequests.map((r) => (
          <div key={r.id} className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors">
            <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${r.avatarColor} shrink-0`} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium truncate">{r.name}</div>
              <div className="text-[11px] text-muted-foreground/80 truncate">{r.handle} · {r.mutual} mutual</div>
            </div>
            <button className="h-7 w-7 rounded-lg bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400/25 flex items-center justify-center transition-colors">
              <Check className="h-3.5 w-3.5" />
            </button>
            <button className="h-7 w-7 rounded-lg bg-white/[0.05] text-muted-foreground hover:bg-rose-400/15 hover:text-rose-300 flex items-center justify-center transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </Section>

      <Section label="Suggested">
        {[
          { id: "s1", name: "Priya Nair", handle: "@priya", mutual: 6, avatarColor: "from-teal-400 to-cyan-400" },
          { id: "s2", name: "Theo Walsh", handle: "@theo", mutual: 3, avatarColor: "from-orange-400 to-red-400" },
        ].map((s) => (
          <div key={s.id} className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors">
            <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${s.avatarColor} shrink-0`} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium truncate">{s.name}</div>
              <div className="text-[11px] text-muted-foreground/80 truncate">{s.handle} · {s.mutual} mutual</div>
            </div>
            <button className="h-7 px-2.5 rounded-lg bg-white/[0.06] hover:bg-primary/20 hover:text-primary text-[11px] font-medium text-foreground/80 flex items-center gap-1 transition-colors">
              <UserPlus className="h-3 w-3" /> Add
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
