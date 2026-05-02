import { createFileRoute } from "@tanstack/react-router";
import { Mail, Lock, User } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { GlassInput } from "@/components/auth/GlassInput";
import { GlowButton } from "@/components/auth/GlowButton";
import { SocialButtons } from "@/components/auth/SocialButtons";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
  head: () => ({
    meta: [
      { title: "Create account — Halo" },
      { name: "description", content: "Join Halo — minimal, fast, beautiful real-time chat." },
    ],
  }),
});

function SignUpPage() {
  return (
    <AuthCard mode="signup" title="Create your account" subtitle="A new home for your conversations.">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <GlassInput
          id="name"
          label="Full name"
          placeholder="Ada Lovelace"
          icon={<User className="h-4 w-4" />}
          delay={0.22}
        />
        <GlassInput
          id="email"
          label="Email"
          type="email"
          placeholder="you@halo.app"
          icon={<Mail className="h-4 w-4" />}
          delay={0.28}
        />
        <GlassInput
          id="password"
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          icon={<Lock className="h-4 w-4" />}
          delay={0.34}
        />

        <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
          By creating an account, you agree to our{" "}
          <span className="text-foreground/80 underline-offset-2 hover:underline">Terms</span> and{" "}
          <span className="text-foreground/80 underline-offset-2 hover:underline">Privacy Policy</span>.
        </p>

        <div className="pt-1">
          <GlowButton delay={0.42}>Create account</GlowButton>
        </div>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              or sign up with
            </span>
          </div>
        </div>

        <SocialButtons />
      </form>
    </AuthCard>
  );
}
