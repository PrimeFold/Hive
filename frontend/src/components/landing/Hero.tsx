import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ImageIcon } from "lucide-react";
import DotField from "./DotField";
import SoftAurora from './SoftAurora';

export function Hero() {
  return (
    <section className="relative pt-28 pb-8 px-6 overflow-hidden">

      {/* Layer 1: SoftAurora — teal wash */}
      <div className="absolute inset-0 pointer-events-none">
        <SoftAurora
          speed={0.4}
          scale={1.8}
          brightness={1}
          color1="#0D9488"
          color2="#4F5EC7"
          noiseFrequency={1.8}
          noiseAmplitude={0.7}
          bandHeight={0.45}
          bandSpread={1.2}
          octaveDecay={0.45}
          layerOffset={0.15}
          colorSpeed={0.8}
          enableMouseInteraction
          mouseInfluence={0.15}
        />
      </div>

      {/* Layer 2: DotField — teal-tinted dots */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-50">
        <DotField
          dotRadius={1.2}
          dotSpacing={18}
          bulgeStrength={55}
          glowRadius={180}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={420}
          cursorForce={0.08}
          bulgeOnly
          gradientFrom="#0D9488"
          gradientTo="#5BB8B3"
          glowColor="#064E4A"
        />
      </div>

      {/* Soften behind text */}
      <div className="absolute inset-0 bg-linear-to-b from-background/50 via-background/25 to-background pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">Now in public beta</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05]"
        >
          Where teams come
          <br />
          <span className="relative inline-block">
            <span className="relative z-10 bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              together
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
              className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-primary/30 rounded-full origin-left"
            />
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.12 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
        >
          Real-time messaging, organized workspaces, and seamless collaboration — all in one place.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="px-7 py-3.5 text-sm font-semibold rounded-xl border border-border text-foreground hover:bg-secondary/80 transition-all hover:-translate-y-0.5"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-12 flex items-center justify-center gap-6"
        >
          <div className="flex -space-x-2">
            {["S", "M", "E", "A", "J"].map((l, i) => (
              <div
                key={l}
                className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-semibold"
                style={{
                  backgroundColor: [
                    "oklch(0.55 0.13 185)",  /* teal */
                    "oklch(0.55 0.13 262)",  /* indigo */
                    "oklch(0.55 0.15 150)",  /* sage */
                    "oklch(0.55 0.13 220)",  /* blue-indigo */
                    "oklch(0.55 0.14 195)",  /* teal-cyan */
                  ][i],
                  color: "white",
                  zIndex: 5 - i,
                }}
              >
                {l}
              </div>
            ))}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className="w-3.5 h-3.5"
                  style={{ color: "oklch(0.62 0.11 185)", fill: "oklch(0.62 0.11 185)" }}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Loved by <span className="text-foreground font-medium">2,400+</span> teams</p>
          </div>
        </motion.div>

        {/* Screenshot placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="mt-16 mx-auto max-w-4xl relative"
        >
          <div className="absolute -inset-4 bg-linear-to-b from-primary/10 via-primary/5 to-transparent rounded-2xl blur-2xl pointer-events-none" />

          <div className="relative rounded-xl border border-border/80 bg-surface overflow-hidden shadow-2xl shadow-black/40 aspect-[16/10]">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-linear-to-br from-surface to-background">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-primary/70" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">App screenshot</p>
                <p className="text-xs text-muted-foreground mt-0.5">Drop your product image here (16:10)</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-12 left-4 right-4 h-24 bg-linear-to-b from-primary/5 to-transparent rounded-2xl blur-xl pointer-events-none" />
        </motion.div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </section>
  );
}