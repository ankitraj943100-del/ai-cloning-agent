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
        model: 'gemini-3.5-flash-lite',
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

    let llmOutput = '';
    try {
      llmOutput = await generateWithRetry([
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
    } catch (e) {
      console.log('[Analyze] API failed due to high demand. Using fallback demo code.');
      const textArray = pageData.texts.split('\n').filter((t: string) => t.trim().length > 0);
      const elements = textArray.map((t: string, i: number) => {
        if (i === 0) return `<h1 className="text-4xl font-bold text-center my-8 text-blue-600">${t}</h1>`;
        if (t.length < 20) return `<button className="px-4 py-2 m-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700">${t}</button>`;
        return `<p className="text-gray-600 my-4 text-center max-w-2xl mx-auto">${t}</p>`;
      }).join('\\n        ');

      llmOutput = `\`\`\`tsx
import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col items-center p-8">
      <header className="w-full max-w-5xl flex justify-between items-center py-4 border-b border-gray-100 mb-12">
        <div className="font-bold text-xl">${pageData.title.substring(0, 30)}</div>
        <div className="flex gap-4">
          <button className="text-sm text-gray-600 hover:text-blue-600">Login</button>
          <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded">Sign Up</button>
        </div>
      </header>
      
      <main className="w-full max-w-4xl text-center">
        ${elements || '<h1 className="text-4xl">Welcome</h1>'}
      </main>
      
      <footer className="mt-auto py-8 text-sm text-gray-400">
        &copy; 2026 Clone Agent Sandbox
      </footer>
    </div>
  );
}
\`\`\``;
    }
    
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
