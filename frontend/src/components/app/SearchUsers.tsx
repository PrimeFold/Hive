import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, UserPlus, Loader2, UserX } from "lucide-react";
import api from "@/lib/axios";

export function SearchUsers() {

  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  // 1. Query to search for the user
  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchUser", submittedQuery],
    queryFn: async () => {
      if (!submittedQuery) return null;
      const { data } = await api.get(`/friends/search?displayName=${encodeURIComponent(submittedQuery)}`);
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    enabled: !!submittedQuery, // Only run when a query is submitted
    retry: false,
  });

  // 2. Mutation to send the friend request
  const sendRequestMutation = useMutation({
    mutationFn: async (receiverDisplayName: string) => {
      const { data } = await api.post(`/friends/request`, { displayName: receiverDisplayName });
      return data;
    },
  });

  return (
    <div className="flex flex-col gap-4 w-full max-w-md p-4 bg-background border rounded-lg shadow-sm">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by display name..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-secondary rounded-md outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSubmittedQuery(searchQuery)}
          />
        </div>
        <button 
          onClick={() => setSubmittedQuery(searchQuery)}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
      </div>

      {isLoading && <div className="flex items-center justify-center p-4 text-muted-foreground"><Loader2 className="animate-spin h-5 w-5" /></div>}
      {isError && <div className="flex items-center gap-2 p-4 text-destructive text-sm"><UserX className="h-4 w-4" /> User not found.</div>}
      
      {data && (
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md border border-border/50">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{data.displayName}</span>
            {data.bio && <span className="text-xs text-muted-foreground truncate max-w-[200px]">{data.bio}</span>}
          </div>
          <button onClick={() => sendRequestMutation.mutate(data.displayName)} disabled={sendRequestMutation.isPending} className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all disabled:opacity-50">
            {sendRequestMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}