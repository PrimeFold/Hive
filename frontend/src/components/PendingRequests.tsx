import api from "@/lib/axios";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, Check, X } from "lucide-react";
import { motion } from "framer-motion";

export function PendingRequests() {
  const queryClient = useQueryClient();

  // 1. Fetch the pending incoming requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ["pendingRequests"],
    queryFn: async () => {
      // Placeholder for your backend endpoint
      const { data } = await api.get("/friends/requests/pending");
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });

  // 2. Accept Request Mutation
  const acceptMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { data } = await api.post(`/friends/requests/${requestId}/accept`);
      return data;
    },
    onSuccess: () => {
      // Refresh the pending requests list and the active friends list
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  // 3. Reject Request Mutation
  const rejectMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { data } = await api.post(`/friends/requests/${requestId}/reject`);
      return data;
    },
    onSuccess: () => {
      // Refresh the pending requests list
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
    },
  });

  if (isLoading) {
    return (
      <motion.div
        className="flex justify-center p-6"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
      </motion.div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <motion.div
        className="p-6 text-sm text-muted-foreground/60 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        No pending requests
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-3 p-5 w-full max-w-md bg-surface/50 border border-border/50 rounded-xl shadow-lg backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-sm font-bold text-foreground">Friend Requests</h3>
      <div className="space-y-2">
        {requests.map((req: any) => (
          <motion.div
            key={req.id}
            className="flex items-center justify-between p-4 bg-secondary/30 border border-border/40 rounded-lg hover:bg-secondary/50 transition-all"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                {req.sender.displayName?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{req.sender.displayName}</p>
                <p className="text-xs text-muted-foreground/50">@{req.sender.username}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <motion.button
                onClick={() => acceptMutation.mutate(req.id)}
                disabled={acceptMutation.isPending || rejectMutation.isPending}
                className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 rounded-lg transition-all disabled:opacity-50 hover:shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {acceptMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </motion.button>
              <motion.button
                onClick={() => rejectMutation.mutate(req.id)}
                disabled={acceptMutation.isPending || rejectMutation.isPending}
                className="p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-all disabled:opacity-50 hover:shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {rejectMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
