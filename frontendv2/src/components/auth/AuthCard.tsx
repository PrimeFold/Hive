import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { AuroraBackground } from "./AuroraBackground";

type AuthCardProps = {
  mode: "signin" | "signup";
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthCard({ mode, title, subtitle, children }: AuthCardProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // title char-by-char reveal
      if (titleRef.current) {
        const text = titleRef.current.innerText;
        titleRef.current.innerHTML = text
          .split("")
          .map((c) => `<span class="inline-block">${c === " " ? "&nbsp;" : c}</span>`)
          .join("");
        gsap.from(titleRef.current.querySelectorAll("span"), {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.025,
        });
      }
      // card lift in
      gsap.from(cardRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
      <AuroraBackground />

      {/* top brand */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 left-6 flex items-center gap-2 z-10"
      >
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 flex items-center justify-center shadow-lg shadow-primary/30">
          <MessageCircle className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight">Halo</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-6 right-6 text-xs text-muted-foreground z-10"
      >
        {mode === "signin" ? (
          <span>
            New here?{" "}
            <Link to="/signup" className="text-foreground font-medium hover:text-primary transition-colors">
              Create account →
            </Link>
          </span>
        ) : (
          <span>
            Have an account?{" "}
            <Link to="/signin" className="text-foreground font-medium hover:text-primary transition-colors">
              Sign in →
            </Link>
          </span>
        )}
      </motion.div>

      {/* glass card */}
      <div
        ref={cardRef}
        className="relative w-full max-w-md rounded-3xl p-[1px] overflow-hidden"
      >
        {/* gradient border */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-3xl opacity-60"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.75 0.16 255 / 0.6), transparent 40%, oklch(0.65 0.2 320 / 0.5) 80%)",
          }}
        />
        <div className="relative rounded-[calc(1.5rem-1px)] bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40 p-8">
          <div className="mb-7">
            <h1
              ref={titleRef}
              className="text-3xl font-semibold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent"
            >
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue as guest <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
