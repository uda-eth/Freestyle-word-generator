import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pause, Play, SkipForward } from "lucide-react";

interface ControlsProps {
  isPlaying: boolean;
  onPause: () => void;
  onSkip: () => void;
  onReset: () => void;
}

export default function Controls({ isPlaying, onPause, onSkip, onReset }: ControlsProps) {
  return (
    <motion.div 
      className="flex justify-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Button
        variant="outline"
        size="lg"
        onClick={onPause}
        className="w-20 h-20 rounded-full"
      >
        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={onSkip}
        className="w-20 h-20 rounded-full"
      >
        <SkipForward className="h-8 w-8" />
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={onReset}
        className="w-20 h-20 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </Button>
    </motion.div>
  );
}
