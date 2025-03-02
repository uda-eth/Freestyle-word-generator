import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import WordDisplay from "../components/WordDisplay";
import Controls from "../components/Controls";
import { useToast } from "@/hooks/use-toast";
import { useGenerateWords, type GeneratedWord } from "../lib/openai";

export default function HomePage() {
const LOADING_MESSAGES = [
  "Warming up those freestyle neurons... 🧠",
  "Cooking up some fresh vocabulary... 🔥",
  "Channeling your inner lyricist... 🎤",
  "Loading rhyme ammunition... 🎯",
  "Preparing your verbal arsenal... 💪",
  "Igniting the creative spark... ⚡",
  "Summoning the flow state... 🌊",
  "Getting those bars ready... 🎵",
  "Loading inspiration... 💭",
  "Setting the stage for greatness... 🎪"
];
  
  
  const [currentWord, setCurrentWord] = useState("");
  const [currentTheme, setCurrentTheme] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [wordQueue, setWordQueue] = useState<GeneratedWord[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { toast } = useToast();
  
  const generateWords = useGenerateWords();

  const fetchNewBatch = useCallback(async () => {
    try {
      const result = await generateWords.mutateAsync();
      setWordQueue(prevQueue => [...prevQueue, ...result.words]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate words",
        variant: "destructive",
      });
    }
  }, [generateWords, toast]);

  const getNextWord = useCallback(() => {
    if (wordQueue.length === 0) {
      return;
    }

    const nextWord = wordQueue[0];
    setWordQueue(prevQueue => prevQueue.slice(1));
    setCurrentWord(nextWord.word);
    setCurrentTheme(nextWord.theme);
    setTimeLeft(10);
    setWordCount(prev => prev + 1);

    // Fetch new batch when queue is running low (reduced threshold)
    if (wordQueue.length < 5) {
      fetchNewBatch();
    }
  }, [wordQueue, fetchNewBatch]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      getNextWord();
    }
    return () => clearInterval(timer);
  }, [timeLeft, getNextWord]);

  const handleStart = async () => {
    setLoadingMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    try {
      await fetchNewBatch();
      getNextWord();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start practice. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setLoadingMessage("");
    }
  };

  const handleReset = () => {
    setWordQueue([]);
    setWordCount(0);
    setCurrentWord("");
    setCurrentTheme("");
    setTimeLeft(10);
  };

  const handleSkip = () => {
    getNextWord();
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
        {!currentWord ? (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            
            <Button 
              onClick={handleStart}
              className="w-full"
              size="lg"
              disabled={!!loadingMessage}
            >
              {loadingMessage || "Start Practice"}
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
              <WordDisplay 
                word={currentWord} 
                timeLeft={timeLeft}
                isLoading={generateWords.isPending} 
              />
              <Controls 
                onSkip={handleSkip}
                onReset={handleReset}
              />
              <div className="text-sm text-muted-foreground text-center mt-4">
                {wordCount}/{wordQueue.length} words
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
