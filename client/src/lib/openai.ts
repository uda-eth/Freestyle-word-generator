import { useMutation } from "@tanstack/react-query";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
export interface GeneratedWord {
  word: string;
  theme: string;
}

export const useGenerateWords = (apiKey: string) => {
  return useMutation({
    mutationFn: async (): Promise<GeneratedWord> => {
      const response = await fetch("/api/generate-words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate words");
      }

      return response.json();
    },
  });
};
