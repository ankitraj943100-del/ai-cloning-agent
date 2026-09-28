const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function testModel(modelName) {
  try {
    const res = await ai.models.generateContent({
      model: modelName,
      contents: "Write a 1-line React component.",
    });
    console.log(`[SUCCESS] ${modelName}:`, res.text);
    return true;
  } catch (e) {
    console.log(`[ERROR] ${modelName}:`, e.message);
    return false;
  }
}
async function run() {
  await testModel('gemini-1.5-flash');
  await testModel('gemini-1.5-pro');
  await testModel('gemini-2.0-flash-exp');
  await testModel('gemini-2.5-flash');
  await testModel('gemini-3.5-flash');
}
run();
