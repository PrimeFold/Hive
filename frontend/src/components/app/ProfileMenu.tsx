import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut, UserPen } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ProfileMenu() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");

  if (!user) return null;

  const initial = (user.displayName?.charAt(0) || user.username?.charAt(0) || "U").toUpperCase();

  const openProfileDialog = () => {
    setUsername(user.username);
    setEmail(user.email);
    setPassword("");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const nextUsername = username.trim();
    const nextEmail = email.trim();
    const nextPassword = password.trim();

    if (!nextUsername || !nextEmail) {
      toast.error("Username and email are required");
      return;
    }

    const usernameChanged = nextUsername !== user.username;
    const emailChanged = nextEmail !== user.email;
    const passwordChanged = nextPassword.length > 0;

    if (!usernameChanged && !emailChanged && !passwordChanged) {
      setDialogOpen(false);
      return;
    }

    setSaving(true);
    try {
      if (usernameChanged) {
        const response = await api.put("/update-username", { username: nextUsername });
        const updatedUsername = response.data?.user?.username || nextUsername;
        updateUser({ username: updatedUsername });
      }

      if (emailChanged) {
        const response = await api.put("/update-email", { email: nextEmail });
        const updatedEmail = response.data?.user?.email || nextEmail;
        updateUser({ email: updatedEmail });
      }

      if (passwordChanged) {
        await api.put("/update-password", { password: nextPassword });
      }

      toast.success("Profile updated");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // Keep this best-effort until backend logout route is added.
      await api.post("/auth/logout");
    } catch {
      // no-op
    } finally {
      logout();
      setLoggingOut(false);
      navigate({ to: "/login" });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 flex items-center justify-center text-sm font-bold text-primary transition-all hover:shadow-md group"
            aria-label="Profile menu"
            title={`${user.username} profile menu`}
          >
            {initial}
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background shadow-md group-hover:shadow-lg transition-shadow" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end" className="w-56 rounded-lg">
          <DropdownMenuLabel className="text-xs leading-relaxed py-3">
            <div className="font-bold text-foreground">{user.username}</div>
            <div className="text-muted-foreground/70 font-normal text-xs mt-1">{user.email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openProfileDialog} className="cursor-pointer">
            <UserPen className="h-4 w-4 mr-2" />
            <span>Edit profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-red-500 focus:text-red-500 cursor-pointer"
          >
            {loggingOut ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg">Edit profile</DialogTitle>
            <DialogDescription>Update your account details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-secondary/40 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-secondary/40 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">New password (optional)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-secondary/40 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2.5 text-sm font-medium rounded-lg border border-border/50 bg-background hover:bg-secondary/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2.5 text-sm font-medium rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
