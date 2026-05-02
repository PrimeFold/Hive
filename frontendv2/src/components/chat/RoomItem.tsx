import type { Room } from "./mockData";
import { cn } from "@/lib/utils";

export function RoomItem({ room, active }: { room: Room; active?: boolean }) {
  return (
    <button
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-lg transition-colors group",
        active
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent/50 text-foreground/80"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium truncate"># {room.name}</span>
      </div>
      {room.lastMessage && (
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {room.lastMessage}
        </p>
      )}
    </button>
  );
}
