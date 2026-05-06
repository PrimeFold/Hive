import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChannel } from "@/lib/channel";
import { useNavigate, useParams } from "@tanstack/react-router";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateChannelModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { workspaceId } = useParams({ from: '/app/$workspaceId' });

  const { mutate, isPending } = useMutation({
    mutationFn: () => createChannel(name, workspaceId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      navigate({to:'/app/$workspaceId/$channelId',params:{workspaceId:data.workspaceId,channelId:data.id}})
      setName("");
      setError(null);
      onClose();
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Failed to create channel. Please try again.";
      setError(message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Channel name cannot be empty");
      return;
    }

    if (trimmedName.length < 4) {
      setError("Channel name must be at least 4 characters");
      return;
    }

    if (trimmedName.length > 25) {
      setError("Channel name must be less than 25 characters");
      return;
    }

    setError(null);
    mutate();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/8 bg-[#111114] px-8 py-7 shadow-xl">
        <h2 className="text-lg font-semibold text-white/90 mb-1">Create a channel</h2>
        <p className="text-[13px] text-white/40 mb-6">Give your channel a name to get started.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="e.g. Halo Studio"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            className="w-full h-10 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 text-[13.5px] text-white/80 outline-none focus:border-violet-400/50 placeholder:text-white/20"
            autoFocus
          />

          {error && (
            <p className="text-[12px] text-red-400/80">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[13px] text-white/40 hover:text-white/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-[13px] text-white font-medium transition-colors"
            >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
