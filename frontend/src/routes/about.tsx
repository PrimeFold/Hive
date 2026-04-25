import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Hexagon, Zap, Heart, Target, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Hive" },
      { name: "description", content: "Learn about Hive — the fast, focused team collaboration tool built for modern teams." },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: Zap,
    title: "Speed first",
    description: "Every interaction should feel instant. Under 50ms or it's a bug.",
  },
  {
    icon: Target,
    title: "Focused by default",
    description: "We strip away noise so your team can do its best work without distraction.",
  },
  {
    icon: Heart,
    title: "Built with care",
    description: "Crafted by a small team who use Hive every day. Quality over quantity.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8"
          >
            <Hexagon className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">About Hive</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.05]"
          >
            Collaboration without
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              the noise
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.12 }}
            className="mt-6 text-lg text-muted-foreground leading-relaxed"
          >
            Hive is a real-time team collaboration tool built for teams that ship.
            We believe great software comes from focused conversations, not endless threads.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-border bg-surface p-8 md:p-10"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">Our story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We started Hive after years of frustration with bloated chat tools that prioritized
                features over focus. Notifications everywhere. Endless threads. Slow load times.
                Teams were spending more time managing their tools than using them.
              </p>
              <p>
                So we built something different — a fast, minimal, snappy collaboration app
                that gets out of your way. No tabs that take 3 seconds to switch. No animations
                that feel like obstacles. Just instant, clean communication.
              </p>
              <p className="text-foreground/80">
                Hive is built by a small, focused team who care deeply about craft.
                Every detail — from the keyboard shortcuts to the typing indicators — is shaped by
                people who use it every day.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground">What we value</h2>
            <p className="mt-3 text-muted-foreground">The principles that guide every decision.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="rounded-xl border border-border bg-surface p-6 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto text-center rounded-xl border border-border bg-surface/50 p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Ready to try Hive?
          </h2>
          <p className="text-muted-foreground mb-6">Join thousands of teams shipping faster.</p>
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/25"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
