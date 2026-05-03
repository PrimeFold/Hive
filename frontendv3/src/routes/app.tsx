import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { WorkspaceRail } from "../components/chat/WorkspaceRail";
import { ChannelSidebar } from "../components/chat/ChannelSidebar";
import { ChatHeader } from "../components/chat/ChatHeader";
import { MessageList } from "../components/chat/MessageList";
import { ChatInput } from "../components/chat/ChatInput";
import { RightSidebar } from "../components/chat/RightSidebar";


export const Route = createFileRoute('/app')({
  beforeLoad: ({ context }) => {
    //if (context.auth?.isLoading) return;
    //if (!context.auth?.isAuthenticated) {
    //  throw redirect({ to: '/signin' })
    //}
  },
  component: app
})

function app() {
  return (
    <div className="h-screen w-full flex bg-background text-foreground overflow-hidden relative">
      {/* ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-120 w-120 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-130 w-130 rounded-full bg-fuchsia-500/10 blur-[160px]" />
        <div className="absolute bottom-0 left-1/3 h-100 w-100 rounded-full bg-emerald-400/6 blur-[140px]" />
      </div>

      <div className="relative z-10 flex w-full h-full">
        <WorkspaceRail />
          <Outlet/>
        <RightSidebar />
      </div>
    </div>
  );
}
