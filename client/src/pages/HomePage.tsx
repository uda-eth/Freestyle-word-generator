import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import WordDisplay from "../components/WordDisplay";
import Controls from "../components/Controls";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [apiKey, setApiKey] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const { toast } = useToast();

  const handleStart = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to start.",
        variant: "destructive",
      });
      return;
    }
    setIsPlaying(true);
  };

  const handleSkip = () => {
    // Trigger new word generation
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.h1 
        className="text-4xl md:text-6xl font-bold mb-8 text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Freestyle Practice
      </motion.h1>

      <div className="w-full max-w-md space-y-6">
        {!isPlaying ? (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Input
              placeholder="Enter OpenAI API Key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <Button 
              onClick={handleStart}
              className="w-full"
              size="lg"
            >
              Start Practice
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <WordDisplay word={currentWord} />
              <Controls 
                isPlaying={isPlaying} 
                onPause={() => setIsPlaying(false)}
                onSkip={handleSkip}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
