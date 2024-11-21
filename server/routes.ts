import type { Express } from "express";
import OpenAI from "openai";

export function registerRoutes(app: Express) {
  app.post("/api/generate-words", async (req, res) => {
    try {
      const { seedWord } = req.body;
      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Server configuration error: OpenAI API key not found" });
      }

      const openai = new OpenAI({ apiKey });

      const systemPrompt = seedWord 
        ? `You are a hip-hop freestyle word generator. Generate 250 complex words that are good for freestyle rap, using only words with 2-4 syllables (no single syllable or 5+ syllable words) and are thematically related to "${seedWord}". Important rules:`
        : `You are a hip-hop freestyle word generator. Generate 250 complex words that are good for freestyle rap, using only words with 2-4 syllables (no single syllable or 5+ syllable words). Important rules:`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `${systemPrompt}
- Ensure consecutive words do not rhyme with each other
- Avoid repeating any word or significant subword within any 10-word sequence
- Each word should belong to a different category than the previous 3 words
- Categories should flow naturally (e.g. astronomy->space->technology->innovation)
Use timestamp ${Date.now()} as inspiration to ensure variety. Respond with JSON in this format: { 'words': Array<{ 'word': string, 'theme': string }> }`
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
