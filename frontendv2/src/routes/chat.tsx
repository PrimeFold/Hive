import { createFileRoute } from "@tanstack/react-router";
import { ChatLayout } from "@/components/chat/ChatLayout";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({
    meta: [
      { title: "Chat — Halo" },
      { name: "description", content: "Real-time rooms, beautifully minimal." },
    ],
  }),
});

function ChatPage() {
  return <ChatLayout />;
}
