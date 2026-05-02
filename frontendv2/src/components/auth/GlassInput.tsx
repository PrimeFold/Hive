import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  delay?: number;
  icon?: React.ReactNode;
};

export function GlassInput({ id, label, type = "text", placeholder, delay = 0, icon }: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword && showPw ? "text" : type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="space-y-1.5"
    >
      <label htmlFor={id} className="text-xs font-medium text-foreground/70 ml-1">
        {label}
      </label>
      <div
        className={cn(
          "relative flex items-center rounded-xl border transition-all duration-300 bg-white/[0.03]",
          focused
            ? "border-primary/60 shadow-[0_0_0_4px_oklch(0.72_0.16_255_/_0.12)]"
            : "border-white/10 hover:border-white/20"
        )}
      >
        {icon && <span className="pl-3.5 text-muted-foreground">{icon}</span>}
        <input
          id={id}
          type={effectiveType}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 h-11 bg-transparent px-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="pr-3.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </motion.div>
  );
}
