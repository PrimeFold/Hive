import { WorkspaceRail } from "./WorkspaceRail";
import { ConversationsPanel } from "./ConversationsPanel";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

export function ChatLayout() {
  return (
    <div className="h-screen w-full flex bg-background text-foreground overflow-hidden relative">
      {/* ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-emerald-400/[0.06] blur-[140px]" />
      </div>

      <div className="relative z-10 flex w-full h-full">
        <WorkspaceRail />
        <ConversationsPanel activeRoomId="general" />

        <main className="flex-1 flex flex-col min-w-0">
          <ChatHeader roomName="General" users={24} />
          <MessageList />
          <ChatInput />
        </main>
      </div>
    </div>
  );
}
