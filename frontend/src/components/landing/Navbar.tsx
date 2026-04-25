import { Link } from "@tanstack/react-router";
import { Hexagon } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/60 backdrop-blur-xl border-b border-border/50"
    >
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="relative">
          <Hexagon className="h-7 w-7 text-primary fill-primary/20 group-hover:fill-primary/30 transition-colors" />
          <div className="absolute inset-0 blur-lg bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <span className="text-lg font-bold text-foreground tracking-tight">Hive</span>
      </Link>

      <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
        <Link
          to="/about"
          className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg"
          activeProps={{ className: "px-3 py-2 text-sm font-medium text-foreground rounded-lg" }}
        >
          About
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          to="/login"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
        >
          Sign in
        </Link>
        <Link
          to="/register"
          className="px-5 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
        >
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
}
