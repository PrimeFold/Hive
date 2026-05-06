import { logout } from "@/lib/auth.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useNavigate } from "@tanstack/react-router";
import { LogOut, User, Settings } from "lucide-react";

export function UserNav() {

  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      authLogout();
      queryClient.clear();
      navigate({ to: "/signin", replace: true }); 
    },
  });

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const userInitial = (user.displayName || user.username)?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/40 to-fuchsia-400/40 flex items-center justify-center text-[11px] font-semibold ring-2 ring-white/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          {userInitial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* NOTE: Update navigation paths if they are different */}
        <DropdownMenuItem onSelect={() => navigate({ to: "/app/profile" })}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate({ to: "/app/profile/settings" })}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
