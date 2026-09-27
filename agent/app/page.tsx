"use client";

import { useState } from "react";
import { Loader2, Globe, Send, Play, Terminal } from "lucide-react";

export default function AgentDashboard() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isModifying, setIsModifying] = useState(false);
  const [previewKey, setPreviewKey] = useState(0); // Used to force reload iframe

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    addLog(`Starting analysis for: ${url}`);
    
    try {
      addLog("Launching headless browser and capturing screenshot...");
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        addLog("Website cloned successfully! Refreshing preview...");
        setPreviewKey(prev => prev + 1);
      } else {
        addLog(`Error: ${data.error}`);
      }
    } catch (err: any) {
      addLog(`Failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleModify = async () => {
    if (!prompt) return;
    setIsModifying(true);
    addLog(`Sending modification prompt: "${prompt}"`);
    
    try {
      const res = await fetch("/api/modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        addLog("Modification applied successfully! Hot reloading...");
        setPreviewKey(prev => prev + 1);
        setPrompt("");
      } else {
        addLog(`Error: ${data.error}`);
      }
    } catch (err: any) {
      addLog(`Failed: ${err.message}`);
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Left Sidebar - Control Panel */}
      <div className="w-1/3 min-w-[400px] border-r bg-white p-6 flex flex-col h-full shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Globe className="text-blue-600" />
            AI Cloning Agent
          </h1>
          <p className="text-sm text-gray-500">
            Enter a URL to recreate its UI using React & Tailwind.
          </p>
        </div>

        {/* Action: Clone */}
        <div className="space-y-4 mb-8 bg-gray-50 p-4 rounded-xl border">
          <label className="block text-sm font-medium text-gray-700">Target Website URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isAnalyzing}
            />
            <button
              onClick={handleAnalyze}
              disabled={!url || isAnalyzing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center min-w-[100px] transition-colors"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Play className="w-4 h-4 mr-1" /> Clone</>}
            </button>
          </div>
        </div>

        {/* Action: Modify */}
        <div className="space-y-4 mb-8 bg-gray-50 p-4 rounded-xl border flex-1">
          <label className="block text-sm font-medium text-gray-700">AI Modification</label>
          <div className="flex flex-col gap-2 h-full">
            <textarea
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none bg-white"
              placeholder="e.g. Change the primary button color to red..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isModifying || isAnalyzing}
            />
            <button
              onClick={handleModify}
              disabled={!prompt || isModifying || isAnalyzing}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center mt-2 transition-colors"
            >
              {isModifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-1" /> Apply Changes</>}
            </button>
          </div>
        </div>

        {/* Logs terminal */}
        <div className="h-48 bg-gray-900 rounded-xl p-4 overflow-y-auto text-xs text-green-400 font-mono flex flex-col shadow-inner">
          <div className="flex items-center text-gray-500 mb-2 gap-2 border-b border-gray-700 pb-2">
             <Terminal className="w-4 h-4"/> System Logs
          </div>
          {logs.map((log, i) => (
            <div key={i} className="mb-1 leading-relaxed">{log}</div>
          ))}
          {logs.length === 0 && <span className="text-gray-600 italic">No activity yet...</span>}
        </div>
      </div>

      {/* Right Content - Sandbox Preview */}
      <div className="flex-1 flex flex-col bg-gray-100 p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-4 px-2">
           <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              Sandbox Preview <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">Live</span>
           </h2>
           <span className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded">localhost:5051</span>
        </div>
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden relative group">
          {/* Iframe pointing to the generated site running on port 5051 */}
          <iframe 
            key={previewKey}
            src="http://localhost:5051" 
            className="w-full h-full border-none"
            title="Sandbox Preview"
          />
        </div>
      </div>
    </div>
  );
}
