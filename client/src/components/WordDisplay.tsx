import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface WordDisplayProps {
  word: string;
  timeLeft?: number;
  isLoading?: boolean;
}

export default function WordDisplay({ word, timeLeft = 10, isLoading = false }: WordDisplayProps) {
  return (
    <div className="space-y-4">
      <motion.div
        className="bg-card p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <motion.h2
          className="text-6xl md:text-8xl font-bold text-center"
          key={word}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          {isLoading ? "Generating words..." : word || "Ready"}
        </motion.h2>
      </motion.div>
      <motion.div 
        className="h-2 bg-primary/20 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ 
            duration: 10,
            ease: "linear",
            repeat: 0
          }}
          key={word} // Reset animation when word changes
        />
      </motion.div>
    </div>
  );
}
