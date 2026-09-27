import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
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
        console.log(`[Analyze] API overloaded. Retrying in ${2000 * (i + 1)}ms...`);
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
      } else {
        throw error;
      }
    }
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log(`[Analyze] Starting analysis for: ${url}`);
    
    const browser = await puppeteer.launch({
      headless: true,
      channel: 'chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });
    
    console.log(`[Analyze] Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log(`[Analyze] Capturing screenshot...`);
    const screenshotBuffer = await page.screenshot({ fullPage: true, encoding: 'base64', type: 'jpeg', quality: 80 });
    
    const pageData = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, a, button'))
        .map(el => (el as HTMLElement).innerText.trim())
        .filter(t => t.length > 0);
      return {
        title: document.title,
        texts: texts.slice(0, 100).join('\n'),
      };
    });
    
    await browser.close();
    
    console.log(`[Analyze] Extracted data. Sending to LLM...`);

    const systemPrompt = `You are an expert Frontend AI Assistant. Your task is to accurately recreate the given website UI using React, Next.js (App Router), and Tailwind CSS.
    
REQUIREMENTS:
- Output a SINGLE React component as default export.
- Use Lucide React icons if icons are needed.
- Write valid, responsive Tailwind CSS classes.
- Ensure the layout closely matches the provided screenshot.
- Only output the raw TypeScript (TSX) code inside a \`\`\`tsx code block. Do NOT include any explanations or markdown outside the block.
- DO NOT use any external CSS files. Use Tailwind utility classes.
- Include dummy images (e.g., https://placehold.co/600x400) if the original has images.`;

    const userPrompt = `Recreate this website. Here is some extracted text from the DOM to help you with content:\n\nTitle: ${pageData.title}\nText snippets:\n${pageData.texts}`;

    const llmOutput = await generateWithRetry([
      {
        role: 'user',
        parts: [
          { text: systemPrompt + '\n\n' + userPrompt },
          {
            inlineData: {
              data: screenshotBuffer,
              mimeType: 'image/jpeg'
            }
          }
        ]
      }
    ]) || '';
    
    const match = llmOutput.match(/```(?:tsx|jsx|ts|js)?\n([\s\S]*?)```/);
    const code = match ? match[1] : llmOutput;
    
    console.log(`[Analyze] Generated code length: ${code.length}`);

    const sandboxDir = path.resolve(process.cwd(), '../generated-site/app');
    const targetFile = path.join(sandboxDir, 'page.tsx');
    
    fs.writeFileSync(targetFile, code, 'utf-8');
    
    console.log(`[Analyze] Wrote to ${targetFile}`);

    return NextResponse.json({ success: true, message: 'Website cloned successfully' });

  } catch (error: any) {
    console.error(`[Analyze] Error:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
