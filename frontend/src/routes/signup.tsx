import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User } from "lucide-react";
import { signup } from "@/lib/auth";
import { GlowButton } from "@/components/auth/GlowButton";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
  head: () => ({
    meta: [
      { title: "Sign up — Hive" },
      {
        name: "description",
        content: "Create your Hive account and start chatting.",
      },
    ],
  }),
});

const inputCls =
  "w-full h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg pr-3 text-[13.5px] text-white/80 outline-none transition-colors focus:border-violet-400/50 focus:bg-white/[0.07] placeholder:text-white/20";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signupMutation = useMutation({
    mutationFn: () => signup(name, email, password),
    onSuccess: () => {
      navigate({ to: "/App" });
      setName("");
      setEmail("");
      setPassword("");
    },
    onError: (error) => {
      console.error("Signup failed:", error);
    },
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden px-4">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] rounded-full bg-violet-600/20 blur-[110px]" />
        <div className="absolute bottom-[-80px] right-[-60px] w-[340px] h-[340px] rounded-full bg-fuchsia-600/15 blur-[100px]" />
      </div>

      {/* Brand mark */}
      <div className="absolute top-6 left-7 flex items-center gap-2 z-10">
        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400" />
        <span className="text-[13px] font-medium text-white/70 tracking-tight">
          Hive
        </span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[400px] rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] px-8 py-9">
        <h2 className="text-[28px] font-semibold tracking-tight text-white/90 mb-1.5">
          Start your journey.
        </h2>
        <p className="text-[13px] text-white/40 mb-7">
          Create your account and join Hive.
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[11px] font-medium text-white/35 uppercase tracking-[0.06em] mb-1.5">
              Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <User className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-medium text-white/35 uppercase tracking-[0.06em] mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Mail className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="email"
                placeholder="you@Hive.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-medium text-white/35 uppercase tracking-[0.06em] mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Lock className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>

          {/* Error */}
          {signupMutation.isError && (
            <p className="text-[12px] text-red-400/80">
              Something went wrong. Please try again.
            </p>
          )}

          {/* Submit */}
          <div className="pt-1">
            <GlowButton
              delay={0.4}
              type="submit"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Creating account…" : "Create account"}
            </GlowButton>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[11px] text-white/20">or</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Google SSO */}
        <button className="w-full h-[38px] rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white/50 hover:text-white/70 text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google
        </button>

        {/* Footer links */}
        <p className="mt-5 text-[12px] text-white/20 text-center">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-white/40 hover:text-violet-400 transition-colors"
          >
            Sign in →
          </Link>
        </p>
        <p className="mt-2 text-[12px] text-white/20 text-center">
          <Link
            to="/"
            className="text-white/25 hover:text-white/45 transition-colors"
          >
            Continue as guest →
          </Link>
        </p>
      </div>
    </div>
  );
}