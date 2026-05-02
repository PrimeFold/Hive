import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function GlowButton({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.button
      type="submit"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group relative w-full h-12 rounded-xl overflow-hidden font-medium text-sm text-primary-foreground"
    >
      <span
        className="absolute inset-0 bg-gradient-to-r from-primary via-fuchsia-500 to-primary bg-[length:200%_100%] animate-[shimmer_4s_linear_infinite]"
        style={{ animation: "shimmer 4s linear infinite" }}
      />
      <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      <span className="absolute -inset-1 rounded-xl bg-primary/40 blur-xl opacity-60 group-hover:opacity-90 transition-opacity -z-10" />
      <span className="relative flex items-center justify-center gap-2 text-white">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
      `}</style>
    </motion.button>
  );
}
