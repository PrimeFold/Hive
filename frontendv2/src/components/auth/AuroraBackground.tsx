import { motion } from "framer-motion";

/**
 * Animated aurora / glow background. Pure decoration, no logic.
 */
export function AuroraBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
      {/* base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.22_0.04_270)_0%,_oklch(0.12_0.005_270)_60%)]" />

      {/* animated orbs */}
      <motion.div
        aria-hidden
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, oklch(0.62 0.18 255) 0%, transparent 60%)" }}
        animate={{ x: [0, 80, -40, 0], y: [0, 60, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.2 320) 0%, transparent 60%)" }}
        animate={{ x: [0, -60, 40, 0], y: [0, -40, 60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-1/3 h-[480px] w-[480px] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.16 200) 0%, transparent 60%)" }}
        animate={{ x: [0, 40, -50, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_oklch(0.10_0.005_270)_85%)]" />
    </div>
  );
}
