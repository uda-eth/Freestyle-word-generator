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
            content: "You are a hip-hop freestyle word generator. Generate 100 thematically related words that would be good for freestyle rap practice. Each word should have a theme. Respond with JSON in this format: { 'words': Array<{ 'word': string, 'theme': string }> }"
          }
        ],
        response_format: { type: "json_object" }
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
