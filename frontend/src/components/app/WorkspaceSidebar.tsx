import { type Workspace, currentUser } from "@/data/dummy";
import { Plus, Hexagon } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  onCreateWorkspace: () => void;
}

export function WorkspaceSidebar({ workspaces, activeWorkspaceId, onSelectWorkspace, onCreateWorkspace }: Props) {
  return (
    <div className="w-[72px] bg-background flex flex-col items-center py-3 border-r border-border">
      {/* Logo */}
      <div className="mb-3 pb-3 border-b border-border w-full flex justify-center">
        <Hexagon className="h-6 w-6 text-primary fill-primary/20" />
      </div>

      {/* Workspaces */}
      <div className="flex-1 flex flex-col items-center gap-2 w-full">
        {workspaces.map((ws) => {
          const isActive = ws.id === activeWorkspaceId;
          return (
            <div key={ws.id} className="relative w-full flex justify-center group">
              {/* Active indicator */}
              <motion.div
                initial={false}
                animate={{
                  height: isActive ? 36 : 0,
                  opacity: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-primary"
              />
              <button
                onClick={() => onSelectWorkspace(ws.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                }`}
                title={ws.name}
              >
                {ws.avatar}
              </button>
              {/* Tooltip */}
              <div className="absolute left-[72px] top-1/2 -translate-y-1/2 z-50 hidden group-hover:block">
                <div className="bg-popover text-popover-foreground text-xs font-medium px-3 py-1.5 rounded-lg border border-border shadow-lg whitespace-nowrap ml-2">
                  {ws.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider + Add */}
      <div className="w-8 h-px bg-border my-2" />
      <button
        onClick={onCreateWorkspace}
        className="w-12 h-12 rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
        title="Create workspace"
      >
        <Plus className="h-5 w-5" />
      </button>

      {/* User avatar */}
      <div className="mt-3 pt-3 border-t border-border w-full flex justify-center">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
            {currentUser.avatar}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-online border-2 border-background" />
        </div>
      </div>
    </div>
  );
}
