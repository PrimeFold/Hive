import { MessageSquare, Layout, Users, Zap, Shield, Globe } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: MessageSquare,
    title: "Real-time messaging",
    description: "Instant messages with typing indicators and presence awareness. Never miss a beat.",
  },
  {
    icon: Layout,
    title: "Organized workspaces",
    description: "Separate spaces for every team, project, or community. Keep things tidy.",
  },
  {
    icon: Users,
    title: "Team presence",
    description: "See who's online and available at a glance. Stay connected effortlessly.",
  },
];

const stats = [
  { value: "99.9%", label: "Uptime" },
  { value: "<50ms", label: "Latency" },
  { value: "2,400+", label: "Teams" },
  { value: "10M+", label: "Messages/day" },
];

export function Features() {
  return (
    <section className="py-24 px-6 relative">
      {/* Section divider gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Everything your team needs
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-lg mx-auto">
            Built for speed, designed for clarity.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.08 }}
              className="group relative rounded-xl border border-border bg-surface p-6 hover:border-primary/30 transition-all hover:-translate-y-0.5"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="mt-16 rounded-xl border border-border bg-surface/50 p-1"
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center py-6 ${
                  i < stats.length - 1 ? "border-r border-border/50" : ""
                }`}
              >
                <span className="text-2xl font-bold text-foreground">{s.value}</span>
                <span className="text-xs text-muted-foreground mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
