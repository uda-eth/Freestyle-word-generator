import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pause, Play, SkipForward } from "lucide-react";

interface ControlsProps {
  isPlaying: boolean;
  onPause: () => void;
  onSkip: () => void;
}

export default function Controls({ isPlaying, onPause, onSkip }: ControlsProps) {
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
    </motion.div>
  );
}
