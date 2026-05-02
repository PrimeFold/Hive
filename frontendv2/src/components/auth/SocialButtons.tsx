import { motion } from "framer-motion";
import { Github, Chrome, Apple } from "lucide-react";

export function SocialButtons() {
  const items = [
    { icon: Apple, label: "Apple" },
    { icon: Chrome, label: "Google" },
    { icon: Github, label: "GitHub" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(({ icon: Icon, label }, i) => (
        <motion.button
          key={label}
          type="button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="group relative flex items-center justify-center gap-2 h-11 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-colors"
        >
          <Icon className="h-4 w-4 text-foreground/80 group-hover:text-foreground" />
          <span className="text-xs font-medium text-foreground/70 group-hover:text-foreground hidden sm:inline">
            {label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
