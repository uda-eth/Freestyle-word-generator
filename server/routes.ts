import type { Express } from "express";
import OpenAI from "openai";

export function registerRoutes(app: Express) {
  app.post("/api/generate-words", async (req, res) => {
    try {
      const { apiKey } = req.body;

      if (!apiKey) {
        return res.status(400).json({ error: "API key is required" });
      }

      const openai = new OpenAI({ apiKey });

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a hip-hop freestyle word generator. Generate 250 complex words that are good for freestyle rap, using only words with 2-4 syllables (no single syllable or 5+ syllable words). Words should transition between different but related categories (e.g., from 'technology' to 'innovation' to 'revolution'). Use timestamp ${Date.now()} as inspiration to ensure variety. Respond with JSON in this format: { 'words': Array<{ 'word': string, 'theme': string }> }`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 1.0,
        top_p: 0.9
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      const result = JSON.parse(content) as { words: Array<{ word: string; theme: string }> };
      res.json(result);
    } catch (error) {
      console.error("Error generating words:", error);
      res.status(500).json({ error: "Failed to generate words" });
    }
  });
}
