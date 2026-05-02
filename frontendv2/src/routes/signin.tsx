import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Lock } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { GlassInput } from "@/components/auth/GlassInput";
import { GlowButton } from "@/components/auth/GlowButton";
import { SocialButtons } from "@/components/auth/SocialButtons";

export const Route = createFileRoute("/signin")({
  component: SignInPage,
  head: () => ({
    meta: [
      { title: "Sign in — Halo" },
      { name: "description", content: "Sign in to Halo, a beautifully minimal real-time chat." },
    ],
  }),
});

function SignInPage() {
  return (
    <AuthCard mode="signin" title="Welcome back" subtitle="Sign in to continue the conversation.">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <GlassInput
          id="email"
          label="Email"
          type="email"
          placeholder="you@halo.app"
          icon={<Mail className="h-4 w-4" />}
          delay={0.25}
        />
        <GlassInput
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          delay={0.32}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-primary" />
            Remember me
          </label>
          <Link to="/signin" className="text-foreground/80 hover:text-primary transition-colors">
            Forgot password?
          </Link>
        </div>

        <div className="pt-1">
          <GlowButton delay={0.4}>Sign in</GlowButton>
        </div>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-transparent text-[10px] uppercase tracking-widest text-muted-foreground">
              or continue with
            </span>
          </div>
        </div>

        <SocialButtons />
      </form>
    </AuthCard>
  );
}
