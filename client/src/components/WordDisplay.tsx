import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface WordDisplayProps {
  word: string;
}

export default function WordDisplay({ word }: WordDisplayProps) {
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
          {word || "Ready"}
        </motion.h2>
      </motion.div>
      <Progress value={66} className="h-2" />
    </div>
  );
}
