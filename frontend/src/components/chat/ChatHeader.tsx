import { useQuery } from "@tanstack/react-query";
import { getChannelById } from "@/lib/channel";

interface Props {
  channelId: string;
  workspaceId: string;
}

export function ChatHeader({ channelId, workspaceId }: Props) {
  const { data: channel, isLoading, error } = useQuery({
    queryKey: ['channel', channelId],
    queryFn: () => getChannelById(workspaceId, channelId),
  })

  const channelName = isLoading ? '...' : error ? 'Error loading channel' : channel?.name || 'Unknown Channel';

  return (
    <header className="h-17 px-8 flex items-center justify-between border-b border-white/6 bg-linear-to-b from-background/80 to-background/40 backdrop-blur-2xl">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary/30 to-fuchsia-500/20 border border-white/8 flex items-center justify-center text-base font-semibold text-primary">
          #
        </div>
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
            {channelName}
            {!error && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
                Live
              </span>
            )}
            {error && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-400/10 text-red-300 border border-red-400/20">
                Error
              </span>
            )}
          </h2>
          <p className="text-[11.5px] text-muted-foreground mt-0.5 flex items-center gap-3">

            <span className="text-muted-foreground/40">{}online</span>

          </p>
        </div>
      </div>
    </header>
  );
}
