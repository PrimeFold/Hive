import { Link } from "@tanstack/react-router";
import { Hexagon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative px-6 pt-20 pb-8">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Ready to bring your team together?
          </h2>
          <p className="text-muted-foreground mb-6">
            Start collaborating in seconds. No credit card required.
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/25"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50">
          <div className="flex items-center gap-2.5">
            <Hexagon className="h-5 w-5 text-primary fill-primary/20" />
            <span className="text-sm font-semibold text-foreground tracking-tight">Hive</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Get Started
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">(c) {new Date().getFullYear()} Hive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
