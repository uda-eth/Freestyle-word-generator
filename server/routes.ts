import type { Express } from "express";
import OpenAI from "openai";

function generateRandomSeed() {
  const timestamp = Date.now();
  const randomNum = Math.random();
  const seed = `${timestamp}-${randomNum}`.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return seed.toString(36);
}

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

      const systemPrompt = `You are a hip-hop rap freestyle word generator. Generate 100 complex words that are good for freestyle rap, with these rules:
     - Use only words with 2-4 syllables (STRICTLY NO 1 or 5+ syllable words)
     ${!seedWord ? `` : `- First 20 words should subtly relate to "${seedWord}" while maintaining variety. Progress away from the seed theme naturally.`}     
     - Ensure consecutive words do not rhyme with each other
     - Each word should belong to a different category than the previous 3 words
     - Categories should flow naturally`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `${systemPrompt}
Use seed "${generateRandomSeed()}" for randomization.
Additional randomization parameters:
- Vary word complexity within 2-4 syllable range
- Mix abstract and concrete concepts
- Include both modern and timeless terms
- Balance common and sophisticated vocabulary

IMPORTANT: Respond with a valid JSON object in this exact format: { "words": [ { "word": string, "theme": string } ] }
Do not include any other text or explanation in your response, only the JSON object.`,
          },
        ],
        temperature: 1.0,
        top_p: 0.95,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
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

        // Add validation to ensure the response is properly formatted
        const parsed = JSON.parse(fullContent);
        if (!parsed.words || !Array.isArray(parsed.words)) {
          throw new Error("Invalid response format from OpenAI");
        }

        res.json(parsed);
      } catch (error) {
        console.error("Error processing OpenAI response:", error);
        res.status(500).json({ error: "Failed to generate words" });
      }
    } catch (error) {
      console.error("Error generating words:", error);
      res.status(500).json({ error: "Failed to generate words" });
    }
  });
}
