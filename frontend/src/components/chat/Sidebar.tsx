import { Link } from "@tanstack/react-router";

import { RoomItem } from "./RoomItem";

export function Sidebar({ activeRoomId = "general" }: { activeRoomId?: string }) {
  return (
    <aside className="w-[260px] shrink-0 border-r border-border bg-[var(--color-sidebar-bg)] flex flex-col">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-[15px] font-semibold tracking-tight text-foreground/90">Rooms</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{rooms.length} active</p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {rooms.map((room) => (
          <RoomItem key={room.id} room={room} active={room.id === activeRoomId} />
        ))}
      </div>
      <div className="px-5 py-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">Y</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">You</p>
            <p className="text-xs text-muted-foreground truncate">Online</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to="/signin"
            className="flex-1 text-center text-xs py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="flex-1 text-center text-xs py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </aside>
  );
}
