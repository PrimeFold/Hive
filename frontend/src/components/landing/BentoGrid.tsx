import React from "react";
import { motion } from "framer-motion";
import { ImageIcon, Hash, Bell, Zap, Lock, Workflow } from "lucide-react";

interface BentoCellProps {
  className?: string;
  children?: React.ReactNode;
  image?: boolean;
  label?: string;
}

function BentoCell({ className = "", children, image, label }: BentoCellProps) {
  return (
    <div
      className={`group relative rounded-2xl border border-border bg-surface p-5 overflow-hidden hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none z-0" />

      {image && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-primary/70" />
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
        </div>
      )}

      <div className="z-10 flex flex-col h-full w-full">{children}</div>
    </div>
  );
}

function CellReveal({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.25, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function BentoGrid() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="mb-12 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
          The toolkit
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          A workspace, not a wall of messages.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[180px]">
        <CellReveal className="md:col-span-4 md:row-span-2" delay={0}>
          <BentoCell image label="Channel view - drop screenshot (16:10)" />
        </CellReveal>

        <CellReveal className="md:col-span-2" delay={0.05}>
          <BentoCell>
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">design-crit</span>
              <div className="flex items-center gap-1.5 ml-auto px-2 py-0.5 rounded-full bg-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse" />
                <span className="text-[10px] font-medium text-foreground/70 uppercase">live</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-sm">
                <span className="font-medium text-foreground">Sarah</span>
                <span className="text-muted-foreground mx-1">-</span>
                <span className="text-muted-foreground">v3 spacing is much tighter</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-foreground">Marcus</span>
                <span className="text-muted-foreground mx-1">-</span>
                <span className="text-muted-foreground">shipping it.</span>
              </div>
            </div>
          </BentoCell>
        </CellReveal>

        <CellReveal className="md:col-span-2" delay={0.1}>
          <BentoCell>
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Smart inbox</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Prioritize threads, mentions, and follow-ups effortlessly.
            </p>
          </BentoCell>
        </CellReveal>

        <CellReveal className="md:col-span-2" delay={0.15}>
          <BentoCell>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
              <Zap className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">LATENCY</span>
            </div>
            <div className="text-4xl font-bold text-foreground tracking-tight mb-4">42ms</div>
            <div className="mt-auto">
              <div className="h-px w-full bg-secondary overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-primary/60 to-primary w-[18%]" />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-medium">
                <span>p50</span>
                <span>industry avg 230ms</span>
              </div>
            </div>
          </BentoCell>
        </CellReveal>

        <CellReveal className="md:col-span-2" delay={0.2}>
          <BentoCell>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
              <Lock className="h-4 w-4" />
              <h3 className="text-base font-semibold text-foreground">SOC 2 - E2E</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enterprise-grade security built into every layer of your workspace.
            </p>
            <div className="mt-auto flex gap-2">
              {["SOC 2", "GDPR", "HIPAA"].map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </BentoCell>
        </CellReveal>

        <CellReveal className="md:col-span-4" delay={0.25}>
          <BentoCell image label="Integrations diagram - drop graphic (3:1)">
            <div className="absolute top-5 left-5 flex items-center gap-1.5 px-2.5 py-1 bg-background/80 backdrop-blur rounded-full border border-border shadow-sm z-20">
              <Workflow className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                100+ INTEGRATIONS
              </span>
            </div>
          </BentoCell>
        </CellReveal>
      </div>
    </section>
  );
}
