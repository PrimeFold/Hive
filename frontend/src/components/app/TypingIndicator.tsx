import { motion } from "framer-motion";

interface Props {
  username: string;
}

export function TypingIndicator({ username }: Props) {
  return (
    <div className="px-4 py-2 flex items-center gap-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{username} is typing...</span>
    </div>
  );
}
