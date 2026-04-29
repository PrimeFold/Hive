import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, UserPlus, Loader2, UserX } from "lucide-react";
import api from "@/lib/axios";
import { motion } from "framer-motion";

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
    enabled: !!submittedQuery,
    retry: false,
  });

  // 2. Mutation to send the friend request
  const sendRequestMutation = useMutation({
    mutationFn: async (receiverDisplayName: string) => {
      const { data } = await api.post(`/friends/request`, { displayName: receiverDisplayName });
      return data;
    },
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery);
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-4 w-full max-w-md p-5 bg-surface/50 border border-border/50 rounded-xl shadow-lg backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-sm font-bold text-foreground">Find Friends</h3>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search by display name..."
            className="w-full pl-10 pr-3 py-2.5 text-sm bg-secondary/40 border border-border/30 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <motion.button
          onClick={handleSearch}
          className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search
        </motion.button>
      </div>

      {isLoading && (
        <motion.div
          className="flex items-center justify-center p-6 text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Loader2 className="animate-spin h-5 w-5" />
        </motion.div>
      )}

      {isError && (
        <motion.div
          className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <UserX className="h-4 w-4 flex-shrink-0" />
          <span>User not found. Try another search.</span>
        </motion.div>
      )}

      {data && (
        <motion.div
          className="flex items-center justify-between p-4 bg-secondary/30 border border-border/40 rounded-lg hover:bg-secondary/50 transition-all"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-foreground">{data.displayName}</span>
            {data.bio && (
              <span className="text-xs text-muted-foreground/70 truncate max-w-xs">{data.bio}</span>
            )}
          </div>
          <motion.button
            onClick={() => sendRequestMutation.mutate(data.displayName)}
            disabled={sendRequestMutation.isPending}
            className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all disabled:opacity-50 flex-shrink-0 shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {sendRequestMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
