import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, User, Lock } from "lucide-react";
import { forgotPassword } from "@/lib/auth";
import { GlowButton } from "@/components/auth/GlowButton";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({
    meta: [
      { title: "Forgot Password — Hive" },
      {
        name: "description",
        content: "Reset your Hive account password.",
      },
    ],
  }),
});

const inputCls =
  "w-full h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg pr-3 text-[13.5px] text-white/80 outline-none transition-colors focus:border-violet-400/50 focus:bg-white/[0.07] placeholder:text-white/20";

function ForgotPasswordPage() {
  const [step, setStep] = useState<"identifier" | "password" | "success">(
    "identifier"
  );
  const [identifier, setIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const forgotPasswordMutation = useMutation({
    mutationFn: () => {
      const isEmail = identifier.includes("@");
      const email = isEmail ? identifier : "";
      const username = !isEmail ? identifier : "";
      return forgotPassword(email, username, newPassword);
    },
    onSuccess: () => {
      setStep("success");
    },
  });

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError(null);
    forgotPasswordMutation.mutate();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden px-4">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-30 -left-20 w-105 h-105 rounded-full bg-violet-600/20 blur-[110px]" />
        <div className="absolute -bottom-20 -right-15 w-85 h-85 rounded-full bg-fuchsia-600/15 blur-[100px]" />
      </div>

      {/* Brand mark */}
      <div className="absolute top-6 left-7 flex items-center gap-2 z-10">
        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400" />
        <span className="text-[13px] font-medium text-white/70 tracking-tight">
          Hive
        </span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-100 rounded-2xl border border-white/8 bg-white/4 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] px-8 py-9">
        {step === "success" ? (
          <div>
            <h2 className="text-[28px] font-semibold tracking-tight text-white/90 mb-1.5">
              Password Reset
            </h2>
            <p className="text-[13px] text-white/40 mb-7">
              Your password has been successfully reset.
            </p>
            <Link
              to="/signin"
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        ) : step === "identifier" ? (
          <>
            <h2 className="text-[28px] font-semibold tracking-tight text-white/90 mb-1.5">
              Forgot your password?
            </h2>
            <p className="text-[13px] text-white/40 mb-7">
              Enter your email or username to reset your password.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("password");
              }}
              className="space-y-4"
            >
              {/* Email or Username */}
              <div>
                <label className="block text-[11px] font-medium text-white/35 uppercase tracking-[0.06em] mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <User className="h-4 w-4 text-white/40" />
                  </div>
                  <input
                    type="text"
                    placeholder="you@hive.app or your_username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-1">
                <GlowButton delay={0.4} type="submit">
                  Continue
                </GlowButton>
              </div>
            </form>

            {/* Footer links */}
            <p className="mt-5 text-[12px] text-white/20 text-center">
              <Link
                to="/signin"
                className="text-white/40 hover:text-violet-400 transition-colors"
              >
                ← Back to sign in
              </Link>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-[28px] font-semibold tracking-tight text-white/90 mb-1.5">
              Create new password
            </h2>
            <p className="text-[13px] text-white/40 mb-7">
              Enter and confirm your new password.
            </p>

            <form onSubmit={handleRequest} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-[11px] font-medium text-white/35 uppercase tracking-[0.06em] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="h-4 w-4 text-white/40" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-[11px] font-medium text-white/35 uppercase tracking-[0.06em] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="h-4 w-4 text-white/40" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>

              {/* Error */}
              {(forgotPasswordMutation.isError || passwordError) && (
                <p className="text-[12px] text-red-400/80">
                  {passwordError || "Something went wrong. Please try again."}
                </p>
              )}

              {/* Submit */}
              <div className="pt-1">
                <GlowButton
                  delay={0.4}
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending
                    ? "Resetting..."
                    : "Reset Password"}
                </GlowButton>
              </div>
            </form>

            {/* Footer links */}
            <p className="mt-5 text-[12px] text-white/20 text-center">
              <Link
                to="/signin"
                className="text-white/40 hover:text-violet-400 transition-colors"
              >
                ← Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}