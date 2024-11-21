import type { Express } from "express";
import OpenAI from "openai";
import { getWordGenerationPrompt } from './lib/prompts';

export function registerRoutes(app: Express) {
  app.post("/api/generate-words", async (req, res) => {
    try {
      const { seedWord } = req.body;
      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        return res
          .status(500)
          .json({
            error: "Server configuration error: OpenAI API key not found",
          });
      }

      const openai = new OpenAI({ apiKey });

      const systemPrompt = getWordGenerationPrompt(seedWord);

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${systemPrompt}
Use timestamp ${Date.now()} as inspiration to ensure variety.
IMPORTANT: Respond with a valid JSON object in this exact format: { "words": [ { "word": string, "theme": string } ] }
Do not include any other text or explanation in your response, only the JSON object.`,
          },
        ],
        temperature: 0.8,
        top_p: 0.7,
        stream: true,
      });

      try {
        let fullContent = "";
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || "";
          fullContent += content;
        }

        if (!fullContent) {
          throw new Error("No content received from OpenAI");
        }

        // Clean up the content to find valid JSON
        const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No valid JSON found in response");
        }

        // Parse and validate the JSON structure
        const parsed = JSON.parse(jsonMatch[0]);
        if (!parsed.words || !Array.isArray(parsed.words)) {
          throw new Error("Invalid response format from OpenAI");
        }

        const words = parsed.words.map((item: { word: string; theme: string }) => ({
          word: String(item.word).trim(),
          theme: String(item.theme).trim()
        }));

        console.log(`Words generated: ${words.map(w => w.word).join(", ")}`);

        res.json({ words });
      } catch (error) {
        console.error("Error processing OpenAI response:", error);
        res.status(500).json({ 
          error: "Failed to generate words",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    } catch (error) {
      console.error("Error generating words:", error);
      res.status(500).json({ error: "Failed to generate words" });
    }
  });
}
