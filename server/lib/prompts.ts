export function getWordGenerationPrompt(seedWord): string {
  return `You are a hip-hop freestyle word generator. Generate 100 complex words that are good for freestyle rap, with these strict rules:
     - Use only words with 2-4 syllables (STRICTLY NO 1 or 5+ syllable words)
     ${seedWord ? '' : '- Use the word "' + seedWord + '" as the seed word and share words that are related to it'}
     - Ensure consecutive words do not rhyme with each other
     - Each word should belong to a different category than the previous 3 words
     - Categories should flow naturally`;
}
