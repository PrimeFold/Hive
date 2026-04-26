import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Loader2 } from "lucide-react";
import api from "@/lib/axios";

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
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return <div className="p-4 text-sm text-muted-foreground text-center">No pending friend requests.</div>;
  }

  return (
    <div className="flex flex-col gap-2 p-4 w-full max-w-md bg-background border rounded-lg shadow-sm">
      <h3 className="text-sm font-semibold mb-2">Pending Requests</h3>
      {requests.map((req: any) => (
        <div key={req.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md border border-border/50">
          <div className="flex flex-col">
            {/* Assuming the backend populates the sender's details */}
            <span className="text-sm font-medium">{req.sender.displayName}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => acceptMutation.mutate(req.id)} disabled={acceptMutation.isPending || rejectMutation.isPending} className="p-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">
              <Check className="h-4 w-4" />
            </button>
            <button onClick={() => rejectMutation.mutate(req.id)} disabled={acceptMutation.isPending || rejectMutation.isPending} className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}