import { Plus, Hexagon } from "lucide-react";
import { motion } from "framer-motion";
import { Workspace } from "@/types/workspace";
import { ProfileMenu } from "@/components/app/ProfileMenu";

interface Props {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  onCreateWorkspace: () => void;
}

export function WorkspaceSidebar({ 
  workspaces, 
  activeWorkspaceId, 
  onSelectWorkspace, 
  onCreateWorkspace 
}: Props) {
  return (
    <div className="w-18 bg-background flex flex-col items-center py-3 border-r border-border">
      {/* Logo */}
      <div className="mb-3 pb-3 border-b border-border w-full flex justify-center">
        <Hexagon className="h-6 w-6 text-primary fill-primary/20" />
      </div>

      {/* Workspaces */}
      <div className="flex-1 flex flex-col items-center gap-2 w-full">
        {workspaces.map((ws) => {
          const isActive = ws.id === activeWorkspaceId;
          
          // Fallback: Use the first letter of the workspace name if no avatar exists
          const displayChar = ws.name.charAt(0).toUpperCase();

          return (
            <div key={ws.id} className="relative w-full flex justify-center group">
              {/* Active indicator (The white pill on the left) */}
              <motion.div
                initial={false}
                animate={{
                  height: isActive ? 36 : 8,
                  opacity: isActive ? 1 : 0,
                  // Show a small dot on hover even if not active
                  scaleY: isActive ? 1 : 0, 
                }}
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-foreground transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 ${isActive ? "h-9" : "h-2"}`}
              />
              
              <button
                onClick={() => onSelectWorkspace(ws.id)}
                className={`w-12 h-12 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground rounded-2xl" 
                    : "bg-secondary text-muted-foreground rounded-[50%] hover:rounded-2xl hover:bg-primary hover:text-primary-foreground"
                }`}
                title={ws.name}
              >
                {/* Check for avatar property, otherwise use the letter */}
                {ws.avatar ? (
                  <span className="text-lg">{ws.avatar}</span>
                ) : (
                  displayChar
                )}
              </button>

              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 z-50 invisible group-hover:visible">
                <div className="bg-popover text-popover-foreground text-xs font-semibold px-3 py-1.5 rounded-md border border-border shadow-xl whitespace-nowrap ml-4">
                  {ws.name}
                  {/* Tooltip Arrow */}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-popover border-l border-b border-border rotate-45" />
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
        className="w-12 h-12 rounded-full bg-secondary text-muted-foreground hover:bg-green-600 hover:text-white hover:rounded-2xl transition-all duration-200 flex items-center justify-center"
        title="Create workspace"
      >
        <Plus className="h-5 w-5" />
      </button>

      {/* User profile avatar */}
      <div className="mt-3 pt-3 border-t border-border w-full flex justify-center">
        <ProfileMenu />
      </div>
    </div>
  );
}
