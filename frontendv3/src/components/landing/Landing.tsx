import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Sparkles, Zap, Lock, Globe2, Users } from "lucide-react";
import GithubStarButton from "./StarOnGithub";
import Spline from '@splinetool/react-spline';
import {GetStartedButton} from "./GetStartedButton";

function Nav() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl px-4 py-2.5 shadow-lg shadow-black/20">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-linear-to-br from-primary to-fuchsia-500 flex items-center justify-center shadow-md shadow-primary/30">
              <MessageCircle className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Hive</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-xs text-foreground/70">
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/signin" className="text-xs px-3 py-1.5 rounded-lg text-foreground/80 hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link
              to="/signup"

            >
              <GetStartedButton/>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const splineRef = useRef<any>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    const ctx = gsap.context(() => {
      const words = titleRef.current!.querySelectorAll("[data-word]");
      gsap.fromTo(
        words,
        { y: 60, opacity: 0, rotateX: -40 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.08,
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleSplineLoad = (splineApp: any) => {
    splineRef.current = splineApp;
  };

  return (
    <section className="relative pt-40 pb-0 px-4 overflow-hidden">

      {/* ── Globe: anchored to bottom-center, peeking up behind mockup ── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[820px] h-[820px] -z-10">
        <div className="absolute inset-x-0 top-0 h-48  z-10" />
        <div className="absolute inset-x-0 bottom-0 h-40  z-10" />
        <Spline
          scene="https://prod.spline.design/Yoc36xAQHXb1cJdl/scene.splinecode"
          onLoad={handleSplineLoad}
          className="w-full h-full"
        />
      </div>

      {/* ── Accent: soft violet bloom behind hero text ── */}
      <div className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/10 blur-[90px] -z-10" />

      {/* ── Accent: two side edge glows ── */}
      <div className="pointer-events-none absolute top-40 -left-32 w-[320px] h-[320px] rounded-full bg-fuchsia-700/10 blur-[80px] -z-10" />
      <div className="pointer-events-none absolute top-40 -right-32 w-[320px] h-[320px] rounded-full bg-violet-700/10 blur-[80px] -z-10" />

      {/* ── Hero content ── */}
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs text-foreground/80 mb-8 backdrop-blur-sm"
        >
          <Sparkles className="h-3 w-3 text-primary" />
          New · Real-time rooms with end-to-end vibes
        </motion.div>

        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05] [perspective:800px]"
        >
          {"Conversations, perfected."
            .split(" ")
            .map((word, i) => (
              <span
                key={i}
                data-word
                style={{ opacity: 0 }}
                className="inline-block mr-3 bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent"
              >
                {word}
              </span>
            ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Hive is a beautifully minimal real-time chat. Join rooms, share moments, and stay
          in flow — designed with the precision you'd expect from your favorite tools.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <Link
            to="/signup"
            className="group relative inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-white text-black font-medium text-sm overflow-hidden"
          >
            <span className="absolute -inset-1 rounded-xl bg-primary/40 blur-xl opacity-60 group-hover:opacity-100 transition-opacity -z-10" />
            Get started free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="https://github.com/PrimeFold/Hive" to={"."}>
            <GithubStarButton />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-6 text-[11px] uppercase tracking-widest text-muted-foreground"
        >
          No credit card · Free forever for small teams
        </motion.div>
      </div>

      {/* ── Accent: horizontal rule with glow ── */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.6 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1.1, duration: 1, ease: "easeOut" }}
        className="relative max-w-2xl mx-auto mt-16 mb-0 z-10"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        <div className="absolute inset-0 h-px blur-sm bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
      </motion.div>

      {/* ── Mockup — sits on top of globe ── */}
      <motion.div
        id="preview"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="relative max-w-5xl mx-auto mt-14 z-10"
      >
        {/* accent ring behind mockup */}
        <div className="absolute -inset-x-10 top-1/2 h-40 bg-violet-600/10 blur-3xl -z-10" />

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-2 shadow-2xl shadow-black/50">
          <div className="rounded-xl overflow-hidden border border-white/5 bg-[oklch(0.13_0.005_270)]">
            {/* window chrome */}
            <div className="h-9 flex items-center gap-1.5 px-4 border-b border-white/5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
              <span className="ml-3 text-[10px] text-muted-foreground"># general · Hive.app</span>
            </div>
            <div className="grid grid-cols-[180px_1fr] h-[360px]">
              <div className="border-r border-white/5 p-3 space-y-1 bg-[oklch(0.11_0.005_270)]">
                {["General", "Design", "Engineering", "Random", "Product"].map((r, i) => (
                  <div
                    key={r}
                    className={`text-xs px-2.5 py-2 rounded-md ${
                      i === 0 ? "bg-white/10 text-foreground" : "text-foreground/60"
                    }`}
                  >
                    # {r}
                  </div>
                ))}
              </div>
              <div className="p-5 space-y-3 overflow-hidden">
                {[
                  { u: "Alex", t: "Hey team — new build is live ✨", self: false },
                  { u: "You", t: "Looks beautiful. Shipping today?", self: true },
                  { u: "Mira", t: "Typography feels really crisp 👌", self: false },
                  { u: "You", t: "Thanks — tightened the line height.", self: true },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.15 }}
                    className={`flex ${m.self ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-2xl text-xs ${
                        m.self
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-white/5 text-foreground rounded-bl-md"
                      }`}
                    >
                      <div className="text-[9px] uppercase tracking-wider opacity-60 mb-0.5">{m.u}</div>
                      {m.t}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* bottom fade so mockup bleeds into next section */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent rounded-b-2xl pointer-events-none" />
      </motion.div>
    </section>
  );
}

const features = [
  {
    icon: Zap,
    title: "Realtime by default",
    desc: "Messages land instantly. No spinners, no waiting — just flow.",
  },
  {
    icon: Lock,
    title: "Private by design",
    desc: "Your rooms, your rules. End-to-end vibes with zero noise.",
  },
  {
    icon: Globe2,
    title: "Works everywhere",
    desc: "A single beautiful interface across desktop, tablet, and mobile browsers.",
  },
  {
    icon: Users,
    title: "Built for teams",
    desc: "Rooms, DMs, and presence — everything stays organized.",
  },
];

function Features() {
  return (
    <section id="features" className="relative py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-widest text-primary font-medium mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Everything you need.<br />Nothing you don't.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/30 to-fuchsia-500/20 border border-white/10 flex items-center justify-center mb-4">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-28 px-4">
      <div className="max-w-4xl mx-auto text-center relative">
        <div className="absolute -inset-x-10 -inset-y-10 bg-primary/20 blur-3xl rounded-full -z-10 opacity-60" />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-semibold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
        >
          Say hello to better conversations.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors"
          >
            Create your account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-fuchsia-500 flex items-center justify-center">
            <MessageCircle className="h-3 w-3 text-white" />
          </div>
          <span className="text-xs font-medium">Hive</span>
          <span className="text-xs text-muted-foreground ml-2">© 2026</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Status</a>
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}

export function Landing() {
  return (
    <div className="relative min-h-screen text-foreground">
      <Nav />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}