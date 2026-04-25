import { Hexagon } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Hexagon className="h-12 w-12 text-primary fill-primary/20" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
            style={{ margin: "-8px" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}
