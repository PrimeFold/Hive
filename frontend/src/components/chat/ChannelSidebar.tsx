import { cn } from "@/lib/utils";
import { Search, Hash, GitBranch, ChevronDown, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getChannels } from "@/lib/channel";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreateChannelModal } from "./CreateChannelModal";
import { getWorkspaceById } from "@/lib/workspace";

function iconFor(label: string) {
  if (label === "Channels") return Hash;
  return GitBranch;
}

export function ChannelSidebar({ workspaceId }: { workspaceId: string }) {
  
  const [ModalOpen,setModalOpen] = useState(false)
  const navigate = useNavigate();

  const { data: workspace } = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => getWorkspaceById(workspaceId),
  });

  const {data : channels = [] , isLoading,isError} = useQuery({
    queryKey:['channels',workspaceId],
    queryFn:()=> getChannels(workspaceId)
  })  


  
  

  return (
    <aside className="w-70 shrink-0 h-full flex flex-col px-3 py-5 gap-4 bg-linear-to-b from-[oklch(0.17_0.005_270)] to-[oklch(0.15_0.005_270)] border-r border-white/[0.06]">
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight">{workspace?.name}</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_oklch(0.75_0.18_150)]" />
              online
            </p>
          </div>
          <button className="h-7 w-7 rounded-lg hover:bg-white/6 flex items-center justify-center text-muted-foreground transition-colors">
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative px-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          placeholder="Search channels…"
          className="w-full h-10 pl-10 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:bg-white/[0.07] focus:border-white/10 transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-5">
      <div>
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-[11px] uppercase tracking-[0.12em] font-semibold text-muted-foreground/80">
            Channels
          </span>
          <button onClick={()=>setModalOpen(true)} className="h-5 w-5 rounded-md hover:bg-white/[0.06] flex items-center justify-center text-muted-foreground/60 hover:text-foreground transition-colors">
            <Plus className="h-4 w-4" />
          </button>
          <CreateChannelModal open={ModalOpen} onClose={()=> setModalOpen(false)}/>
        </div>
        {isLoading ? (
          <p/>
        ) : (
          <ul className="space-y-0.5">
            {channels.map((channel: any) => (
              <li key={channel.id}>
                <button onClick={()=>navigate({to:'/app/$workspaceId/$channelId',params:{workspaceId,channelId:channel.id}})}  className={cn(
                  "w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
                  "hover:bg-white/4 text-foreground/75"
                )}>
                  <span className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-white/[0.04] text-foreground/60 group-hover:text-foreground/90">
                    <Hash className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <span className="text-[13px] truncate font-medium">{channel.name}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06] px-2">
      </div>
      </div>
    </div>
      
    </aside>
  );
}
