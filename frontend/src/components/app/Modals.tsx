import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function ModalShell({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full max-w-sm rounded-xl border border-border bg-surface p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">{title}</h2>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function CreateWorkspaceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (workspaceName: string) => {
      const { data } = await api.post("/workspace", { name: workspaceName });
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Workspace "${variables}" created`);
      setName("");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] }); 
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create workspace");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate(name);
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Create workspace">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Workspace name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            placeholder="My workspace"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending || !name.trim()}
          className="w-full py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Create
        </button>
      </form>
    </ModalShell>
  );
}

export function CreateChannelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (channelName: string) => {
      const { data } = await api.post("/channels", { name: channelName });
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Channel #${variables} created`);
      setName("");
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create channel");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate(name);
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Create channel">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Channel name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            placeholder="new-channel"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending || !name.trim()}
          className="w-full py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Create
        </button>
      </form>
    </ModalShell>
  );
}

export function InviteMemberModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (memberEmail: string) => {
      // Adjust the endpoint to match your exact backend invite route
      const { data } = await api.post("/workspace/invite", { email: memberEmail });
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Invite sent to ${variables}`);
      setEmail("");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send invite");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    mutation.mutate(email);
  };

  return (
    <ModalShell open={open} onClose={onClose} title="Invite member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            placeholder="colleague@example.com"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending || !email.trim()}
          className="w-full py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Send invite
        </button>
      </form>
    </ModalShell>
  );
}
