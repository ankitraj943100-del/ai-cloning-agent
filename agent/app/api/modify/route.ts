import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export const maxDuration = 300;

async function generateWithRetry(contents: any, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents,
        config: { temperature: 0.2 }
      });
      return response.text || '';
    } catch (error: any) {
      if ((error.status === 503 || error.status === 429) && i < retries - 1) {
        console.log(`[Modify] API overloaded. Retrying in ${2000 * (i + 1)}ms...`);
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
      } else {
        throw error;
      }
    }
  }
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const sandboxDir = path.resolve(process.cwd(), '../generated-site/app');
    const targetFile = path.join(sandboxDir, 'page.tsx');
    
    if (!fs.existsSync(targetFile)) {
      return NextResponse.json({ error: 'Generated site page.tsx not found' }, { status: 404 });
    }

    const currentCode = fs.readFileSync(targetFile, 'utf-8');

    console.log(`[Modify] Request: "${prompt}"`);

    const systemPrompt = `You are an expert Frontend AI Assistant. You are given an existing React (Next.js App Router) component using Tailwind CSS.
The user wants to modify this code based on a prompt.

REQUIREMENTS:
- Implement the requested changes accurately.
- Keep the rest of the layout and styling intact unless they conflict with the prompt.
- Output ONLY the fully updated React component code inside a \`\`\`tsx block.
- Do NOT include markdown formatting outside the code block, and do not explain the changes.`;

    const userPrompt = `Current Code:\n\`\`\`tsx\n${currentCode}\n\`\`\`\n\nUser Modification Request: ${prompt}`;

    const llmOutput = await generateWithRetry([
      {
        role: 'user',
        parts: [{ text: systemPrompt + '\n\n' + userPrompt }]
      }
    ]) || '';

    const match = llmOutput.match(/```(?:tsx|jsx|ts|js)?\n([\s\S]*?)```/);
    const updatedCode = match ? match[1] : llmOutput;
    
    fs.writeFileSync(targetFile, updatedCode, 'utf-8');
    
    console.log(`[Modify] Wrote updated code to ${targetFile}`);

    return NextResponse.json({ success: true, message: 'Website modified successfully' });

  } catch (error: any) {
    console.error(`[Modify] Error:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
