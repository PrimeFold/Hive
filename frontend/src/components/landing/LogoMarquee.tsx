import React from "react";
import { motion } from "framer-motion";

const LOGOS = [
  "NORTHWIND", "ACME", "INITECH", "HOOLI", "PIED PIPER",
  "STARK", "WAYNE", "SOYLENT", "UMBRELLA", "TYRELL"
];

export function LogoMarquee() {
  return (
    <section className="py-12 border-y border-border bg-surface/30 overflow-hidden relative">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
      
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6"
      >
        Trusted by teams at
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.25, delay: 0.08, ease: "easeOut" }}
        className="relative flex overflow-hidden"
      >
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex items-center gap-12 whitespace-nowrap animate-marquee w-max">
          {[...LOGOS, ...LOGOS].map((name, i) => (
            <div key={i} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-6 h-6 rounded-md border border-border flex items-center justify-center bg-surface group-hover:border-primary/30 transition-colors duration-300" />
              <span className="text-sm font-bold tracking-widest text-foreground/40 group-hover:text-foreground/80 transition-colors duration-300">
                {name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
