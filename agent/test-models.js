const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    // The @google/genai SDK doesn't have a direct listModels yet? 
    // Wait, let's just make a raw fetch request to the API.
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch(e) { console.error(e); }
}
run();
