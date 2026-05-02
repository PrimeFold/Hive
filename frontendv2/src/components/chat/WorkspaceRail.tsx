import { workspaces } from "./mockData"
import { Plus, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorkspaceRail() {
  return (
    <aside className="w-[76px] shrink-0 h-full flex flex-col items-center py-5 gap-2 bg-gradient-to-b from-[oklch(0.12_0.005_270)] to-[oklch(0.10_0.005_270)] border-r border-white/5">
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.65_0.20_295)] flex items-center justify-center text-[13px] font-bold text-primary-foreground shadow-[0_8px_24px_-6px_oklch(0.72_0.16_255/0.6)]">
        ✦
      </div>
      <div className="h-px w-8 bg-white/10 my-2" />

      <div className="flex-1 flex flex-col gap-2 items-center w-full px-3">
        {workspaces.map((w) => (
          <button
            key={w.id}
            className={cn(
              "group relative h-11 w-11 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-300",
              "hover:rounded-xl",
              w.active
                ? "text-white shadow-[0_8px_30px_-8px_rgba(0,0,0,0.6)]"
                : "text-foreground/70 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white"
            )}
            style={
              w.active
                ? {
                    backgroundImage: `linear-gradient(135deg, oklch(0.65 0.18 ${w.hue}), oklch(0.55 0.20 ${w.hue + 30}))`,
                  }
                : undefined
            }
          >
            {w.active && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-white" />
            )}
            {w.initial}
            <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur text-[11px] font-medium whitespace-nowrap text-white opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 border border-white/10">
              {w.name}
            </span>
          </button>
        ))}

        <button className="h-11 w-11 rounded-2xl flex items-center justify-center text-emerald-300/80 bg-emerald-400/[0.06] hover:bg-emerald-400/[0.12] border border-emerald-400/10 transition-colors">
          <Plus className="h-4 w-4" />
        </button>
        <button className="h-11 w-11 rounded-2xl flex items-center justify-center text-foreground/60 bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
          <Compass className="h-4 w-4" />
        </button>
      </div>

      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-400/40 flex items-center justify-center text-[11px] font-semibold ring-2 ring-white/10">
        Y
      </div>
    </aside>
  );
}
