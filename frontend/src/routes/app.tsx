import { useAuth } from "@/context/authContext";
import { RightSidebar } from "@/components/chat/RightSidebar";
import { WorkspaceRail } from "@/components/chat/WorkspaceRail";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute('/app')({
  component: App
})


function App() {
  console.log('App rendering');
  const { isAuthenticated, isLoading } = useAuth();
   console.log('auth state:', { isAuthenticated, isLoading });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/signin' });
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) return null;

  console.log('rendering layout');
  return (
    <div className="h-screen w-full flex bg-background text-foreground overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-120 w-120 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-130 w-130 rounded-full bg-fuchsia-500/10 blur-[160px]" />
        <div className="absolute bottom-0 left-1/3 h-100 w-100 rounded-full bg-emerald-400/6 blur-[140px]" />
      </div>

      <div className="relative z-10 flex w-full h-full">
        <WorkspaceRail />
        <div className="flex-1 flex flex-col min-w-0">
          <Outlet/>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}