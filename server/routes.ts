import type { Express } from "express";
import OpenAI from "openai";

function generateRandomSeed() {
  const timestamp = Date.now();
  const randomNum = Math.random();
  const seed = `${timestamp}-${randomNum}`
    .split("")
    .reduce((a, b) => a + b.charCodeAt(0), 0);
  return seed.toString(36);
}

export function registerRoutes(app: Express) {
  app.post("/api/generate-words", async (req, res) => {
    try {
      const { seedWord } = req.body;
      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({
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
            content: `${systemPrompt}\nUse seed "${generateRandomSeed()}" for randomization.\nAdditional randomization parameters:\n- Vary word complexity within 2-4 syllable range\n- Mix abstract and concrete concepts\n- Include both modern and timeless terms\n- Balance common and sophisticated vocabulary`
          }
        ],
        functions: [{
          name: "generate_words",
          description: "Generate words for freestyle rap practice",
          parameters: {
            type: "object",
            properties: {
              words: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    word: { type: "string" },
                    theme: { type: "string" }
                  },
                  required: ["word", "theme"]
                }
              }
            },
            required: ["words"]
          }
        }],
        function_call: { name: "generate_words" },
        temperature: 1.0,
        top_p: 0.95,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
      });

      const functionCall = response.choices[0]?.message?.function_call;
      if (!functionCall || functionCall.name !== "generate_words") {
        throw new Error("Invalid response format from OpenAI");
      }

      try {
        const parsed = JSON.parse(functionCall.arguments);
        if (!parsed.words || !Array.isArray(parsed.words)) {
          throw new Error("Invalid words array in response");
        }
        res.json(parsed);
      } catch (error) {
        console.error("Error parsing OpenAI response:", error);
        throw new Error("Failed to parse OpenAI response");
      }
    } catch (error) {
      console.error("Error generating words:", error);
      res.status(500).json({ error: "Failed to generate words" });
    }
  });
}
