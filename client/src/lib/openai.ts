import { useMutation } from "@tanstack/react-query";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
export const useGenerateWords = (apiKey: string) => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/generate-words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate words");
      }

      return response.json();
    },
  });
};
