import { Bell, Pin, Users, Search, Phone, Video } from "lucide-react";

export function ChatHeader({ roomName = "General", users = 24 }: { roomName?: string; users?: number }) {
  return (
    <header className="h-[68px] px-8 flex items-center justify-between border-b border-white/[0.06] bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-2xl">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/30 to-fuchsia-500/20 border border-white/[0.08] flex items-center justify-center text-base font-semibold text-primary">
          #
        </div>
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
            {roomName}
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
              Live
            </span>
          </h2>
          <p className="text-[11.5px] text-muted-foreground mt-0.5 flex items-center gap-3">
            <span className="flex items-center gap-1.5"><Users className="h-3 w-3" />{users} members</span>
            <span className="text-muted-foreground/40">•</span>
            <span>Polishing typography & motion</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div className="relative mr-2 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search in channel"
            className="w-56 h-9 pl-9 pr-3 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs placeholder:text-muted-foreground/70 focus:outline-none focus:bg-white/[0.07] focus:w-72 transition-all"
          />
        </div>
        {[Phone, Video, Pin, Bell].map((Icon, i) => (
          <button key={i} className="h-9 w-9 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <div className="ml-2 flex -space-x-2">
          {["from-rose-400 to-orange-400", "from-violet-400 to-fuchsia-400", "from-emerald-400 to-teal-400"].map((g, i) => (
            <div key={i} className={`h-7 w-7 rounded-full bg-gradient-to-br ${g} ring-2 ring-background`} />
          ))}
          <div className="h-7 w-7 rounded-full bg-white/[0.08] ring-2 ring-background flex items-center justify-center text-[10px] font-semibold text-foreground/80">
            +9
          </div>
        </div>
      </div>
    </header>
  );
}
