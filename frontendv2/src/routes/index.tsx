import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing/Landing";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Halo — Conversations, perfected." },
      { name: "description", content: "Halo is a beautifully minimal real-time chat. Join rooms, share moments, and stay in flow." },
      { property: "og:title", content: "Halo — Conversations, perfected." },
      { property: "og:description", content: "A beautifully minimal real-time chat designed with the precision of your favorite tools." },
    ],
  }),
});

function Index() {
  return <Landing />;
}
