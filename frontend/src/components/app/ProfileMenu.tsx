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
            className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary hover:rounded-2xl transition-all"
            aria-label="Profile menu"
            title={`${user.username} profile menu`}
          >
            {initial}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background shadow-sm" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end" className="w-56">
          <DropdownMenuLabel className="text-xs leading-tight">
            <div className="font-semibold text-foreground">{user.username}</div>
            <div className="text-muted-foreground font-normal">{user.email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openProfileDialog}>
            <UserPen className="h-4 w-4" />
            Edit profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-red-500 focus:text-red-500"
          >
            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Update account details used in Hive.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                placeholder="Leave blank to keep current password"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="px-3 py-2 text-sm rounded-lg border border-border bg-background hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
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
