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
    <div className="w-20 bg-background flex flex-col items-center py-4 border-r border-border/50">
      {/* Logo */}
      <div className="mb-6 pb-4 border-b border-border/50 w-full flex justify-center">
        <Hexagon className="h-6 w-6 text-primary fill-primary/20" />
      </div>

      {/* Workspaces */}
      <div className="flex-1 flex flex-col items-center gap-3 w-full px-2">
        {workspaces.map((ws) => {
          const isActive = ws.id === activeWorkspaceId;
          const displayChar = ws.name.charAt(0).toUpperCase();

          return (
            <motion.div
              key={ws.id}
              className="relative w-full flex justify-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => onSelectWorkspace(ws.id)}
                className={`w-14 h-14 flex items-center justify-center text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl shadow-lg"
                    : "bg-secondary/50 text-foreground rounded-lg hover:bg-secondary hover:shadow-md"
                }`}
                title={ws.name}
              >
                <motion.span
                  className="relative z-10"
                  initial={false}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {ws.avatar ? (
                    <span className="text-lg">{ws.avatar}</span>
                  ) : (
                    displayChar
                  )}
                </motion.span>

                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>

              {/* Modern Tooltip */}
              <motion.div
                className="absolute left-full top-1/2 -translate-y-1/2 z-50 ml-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none"
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
              >
                <div className="bg-foreground text-background text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap shadow-lg backdrop-blur">
                  {ws.name}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-10 h-px bg-border/30 my-4" />

      {/* Create Workspace Button */}
      <motion.button
        onClick={onCreateWorkspace}
        className="w-14 h-14 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center hover:shadow-md"
        title="Create workspace"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="h-5 w-5" />
      </motion.button>

      {/* User profile avatar */}
      <div className="mt-4 pt-4 border-t border-border/50 w-full flex justify-center">
        <ProfileMenu />
      </div>
    </div>
  );
}
