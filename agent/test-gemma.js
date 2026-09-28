const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const res = await ai.models.generateContent({
      model: 'gemma-4-31b-it',
      contents: "Write a 1-line React component.",
    });
    console.log(`[SUCCESS] gemma-4-31b-it:`, res.text);
  } catch (e) {
    console.log(`[ERROR] gemma-4-31b-it:`, e.message);
  }
}
run();
