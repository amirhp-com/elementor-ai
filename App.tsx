import React, { useState, useEffect } from 'react';
import { 
  Copy, Check, Code2, Wand2, Settings2, Cpu, 
  AlertCircle, Eye, EyeOff, Github, Globe, ShieldAlert, 
  MousePointer2, Info, Download, FileJson, Layout,
  Sun, Moon, Trash2, Zap, RefreshCw
} from 'lucide-react';
import Button from './components/Button';
import { AI_PORTALS, DEFAULT_PROMPT_TEMPLATE, SAMPLE_HTML } from './constants';
import { PromptConfig } from './types';

const App: React.FC = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [htmlError, setHtmlError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [previewContent, setPreviewContent] = useState('');
  const [activeTab, setActiveTab] = useState<'prompt' | 'json'>('prompt');
  const [pastedJson, setPastedJson] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [config, setConfig] = useState<PromptConfig>({
    includeRTL: true,
    useGrids: true,
    optimizeSVGs: true
  });

  // Dark Mode Sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Debounced Preview Engine
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!sourceCode.trim()) {
        setPreviewContent('');
        setHtmlError(null);
        return;
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(sourceCode, 'text/html');
      const errorNode = doc.querySelector('parsererror');
      setHtmlError(errorNode ? 'Syntax error in HTML structure' : null);

      const docString = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { 
                background: white; 
                color: black; 
                padding: 1.5rem; 
                font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; 
                min-height: 100vh;
                margin: 0;
                overflow-x: hidden;
              }
              * { max-width: 100%; box-sizing: border-box; }
            </style>
          </head>
          <body>${sourceCode}</body>
        </html>
      `.replace(/<\/script>/g, '<\\/script>');
      
      setPreviewContent(docString);
    }, 500);

    return () => clearTimeout(timer);
  }, [sourceCode]);

  const handleGeneratePrompt = () => {
    if (!sourceCode.trim()) return;
    const prompt = DEFAULT_PROMPT_TEMPLATE(sourceCode, config);
    setGeneratedPrompt(prompt);
    setActiveTab('prompt');
    // Scroll to output on mobile
    if (window.innerWidth < 1024) {
      document.getElementById('output-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyToClipboard = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleClear = () => {
    if (confirm("Clear all source code?")) {
      setSourceCode('');
    }
  };

  const loadSample = () => {
    setSourceCode(SAMPLE_HTML);
  };

  const downloadJson = () => {
    if (!pastedJson.trim()) return;
    try {
      JSON.parse(pastedJson);
      
      const now = new Date();
      const mm = (now.getMonth() + 1).toString().padStart(2, '0');
      const dd = now.getDate().toString().padStart(2, '0');
      const hh = now.getHours().toString().padStart(2, '0');
      const mi = now.getMinutes().toString().padStart(2, '0');
      const ss = now.getSeconds().toString().padStart(2, '0');
      
      const filename = `elementor-ai-${mm}${dd}${hh}${mi}${ss}.json`;
      const blob = new Blob([pastedJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Invalid JSON format. Please ensure the content is a valid Elementor JSON template.");
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen pb-20 px-4 md:px-10 max-w-full mx-auto flex flex-col gap-8 text-slate-900 dark:text-slate-200 transition-colors duration-300 bg-slate-50 dark:bg-[#0f172a]">
      <header className="py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/30 group hover:rotate-12 transition-transform cursor-pointer">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Elementor <span className="text-indigo-600 dark:text-indigo-400">AI Prompt Master</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium tracking-wide">
              Advanced HTML/JSX Bridge — Built for Senior Developers by <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400/30">amirhp-com</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsDarkMode(!isDarkMode)}
             className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-all shadow-sm group"
             title="Toggle Theme"
           >
             {isDarkMode ? <Sun className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" /> : <Moon className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />}
           </button>
           <a href="https://github.com/amirhp-com" target="_blank" className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-all shadow-sm">
             <Github className="w-5 h-5 text-slate-600 dark:text-slate-400" />
           </a>
           <a href="https://amirhp.com" target="_blank" className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-all shadow-sm">
             <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
           </a>
        </div>
      </header>

      {/* Hero Description */}
      <section className="bg-white dark:bg-indigo-600/10 border border-slate-200 dark:border-indigo-500/20 rounded-3xl p-8 shadow-xl backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
          <Wand2 className="w-64 h-64 -mr-20 -mt-20" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/40 shrink-0">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Bridge Code to Elementor v3.0+ Architecture</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-5xl">
              Construct high-fidelity master prompts for <span className="text-indigo-600 dark:text-indigo-300 font-semibold">GPT-4o, Claude 3.5 Sonnet, or Gemini 1.5 Pro</span>. 
              The v1.4 engine specializes in <span className="text-indigo-600 dark:text-indigo-300 font-semibold">Flexbox Containers</span> and <span className="text-indigo-600 dark:text-indigo-300 font-semibold">Responsive Breakpoints</span>. 
              Paste the AI output back into the Download tab to generate your final importable template.
            </p>
          </div>
        </div>
      </section>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Code and Preview */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-300 uppercase tracking-widest">
                  <Code2 className="w-4 h-4" /> Source Editor
                </h2>
                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
                <button 
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-white transition-colors font-bold"
                >
                  {showPreview ? <><EyeOff className="w-3.5 h-3.5" /> Hide Preview</> : <><Eye className="w-3.5 h-3.5" /> Show Preview</>}
                </button>
              </div>
              <div className="flex items-center gap-3">
                {!sourceCode.trim() && (
                  <button 
                    onClick={loadSample}
                    className="text-[10px] flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline transition-colors font-bold uppercase tracking-tighter"
                  >
                    <RefreshCw className="w-3 h-3" /> Load Sample
                  </button>
                )}
                {sourceCode.trim() && (
                   <button 
                    onClick={handleClear}
                    className="text-[10px] flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors font-bold uppercase tracking-tighter"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold hidden md:block">HTML / JSX / React</span>
              </div>
            </div>
            
            <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-700`}>
              <div className="relative">
                <textarea
                  className="w-full h-[600px] bg-white dark:bg-slate-900/50 p-6 text-slate-800 dark:text-slate-300 code-font text-sm focus:outline-none transition-all resize-none leading-relaxed"
                  placeholder="Paste your HTML or JSX code here..."
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                />
                <div className="absolute bottom-4 right-6 text-[10px] text-slate-400 dark:text-slate-600 font-mono pointer-events-none">
                  {sourceCode.length} chars
                </div>
                {htmlError && (
                  <div className="absolute bottom-10 left-6 right-6 bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start gap-3 backdrop-blur-md">
                    <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 dark:text-red-200/80 line-clamp-2">{htmlError}</p>
                  </div>
                )}
              </div>
              
              {showPreview && (
                <div className="h-[600px] bg-white relative">
                  {!sourceCode.trim() ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none p-8 text-center bg-slate-50 dark:bg-slate-900/10">
                      <Layout className="w-10 h-10 mb-4 opacity-10 text-slate-900" />
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide">Live UI Rendering Space</p>
                    </div>
                  ) : (
                    <iframe 
                      srcDoc={previewContent}
                      className="w-full h-full border-none"
                      title="HTML Preview"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-xl">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-300 mb-8">
              <Settings2 className="w-5 h-5" /> Conversion Tuning
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <label className="flex items-center gap-4 cursor-pointer group bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-all hover:border-indigo-500">
                <input
                  type="checkbox"
                  className="w-6 h-6 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                  checked={config.includeRTL}
                  onChange={(e) => setConfig({ ...config, includeRTL: e.target.checked })}
                />
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-slate-200 font-bold text-base">RTL Intelligence</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Auto-mirror layouts for Farsi, Arabic, and Hebrew</span>
                </div>
              </label>

              <label className="flex items-center gap-4 cursor-pointer group bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-all hover:border-indigo-500">
                <input
                  type="checkbox"
                  className="w-6 h-6 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                  checked={config.useGrids}
                  onChange={(e) => setConfig({ ...config, useGrids: e.target.checked })}
                />
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-slate-200 font-bold text-base">CSS Grid Engine</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Enable modern Elementor Grid Container support</span>
                </div>
              </label>
            </div>
            
            <div className="mt-10">
              <Button 
                variant="primary"
                size="lg" 
                className="w-full py-5 text-lg font-black shadow-2xl transition-all hover:-translate-y-1"
                onClick={handleGeneratePrompt}
                disabled={!!htmlError || !sourceCode.trim()}
              >
                <Wand2 className="w-6 h-6 mr-3" /> Generate Master Prompt v1.4
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Output */}
        <div id="output-section" className="lg:col-span-4 flex flex-col gap-8 sticky top-8">
          <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 p-0 flex flex-col h-full overflow-hidden shadow-2xl relative">
            <div className="flex items-center border-b border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setActiveTab('prompt')}
                className={`flex-1 py-5 text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${activeTab === 'prompt' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
              >
                <Wand2 className="w-4 h-4" /> Prompt
              </button>
              <button 
                onClick={() => setActiveTab('json')}
                className={`flex-1 py-5 text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${activeTab === 'json' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
              >
                <FileJson className="w-4 h-4" /> Download
              </button>
            </div>

            <div className="p-8 flex flex-col flex-grow bg-slate-50/30 dark:bg-transparent">
              {activeTab === 'prompt' ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-300 uppercase tracking-[0.2em]">
                      AI Master Prompt
                    </h2>
                    {generatedPrompt && (
                      <button
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all shadow-xl active:scale-95 ${
                          isCopied ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600'
                        }`}
                      >
                        {isCopied ? <><Check className="w-3 h-3" /> COPIED</> : <><Copy className="w-3 h-3" /> COPY ALL</>}
                      </button>
                    )}
                  </div>
                  
                  <div className="relative flex-grow min-h-[450px]">
                    <div className="absolute inset-0 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-slate-800 dark:text-slate-400 text-xs overflow-y-auto whitespace-pre-wrap code-font leading-relaxed scrollbar-thin shadow-inner">
                      {generatedPrompt ? (
                        generatedPrompt
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-8">
                          <Wand2 className="w-14 h-14 mb-4 text-slate-400" />
                          <p className="text-xs font-bold uppercase tracking-widest leading-loose">Ready for Code Input</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-300 uppercase tracking-[0.2em]">
                      Elementor JSON Paste
                    </h2>
                    {pastedJson && (
                      <button
                        onClick={downloadJson}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all shadow-xl bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95"
                      >
                        <Download className="w-3 h-3" /> DOWNLOAD .JSON
                      </button>
                    )}
                  </div>
                  
                  <div className="relative flex-grow min-h-[450px]">
                    <textarea
                      className="absolute inset-0 w-full h-full bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-slate-800 dark:text-slate-400 text-xs overflow-y-auto whitespace-pre-wrap code-font leading-relaxed scrollbar-thin focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none shadow-inner"
                      placeholder="Paste the JSON response from the AI here..."
                      value={pastedJson}
                      onChange={(e) => setPastedJson(e.target.value)}
                    />
                    {!pastedJson && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-30 p-8 pointer-events-none">
                        <FileJson className="w-14 h-14 mb-4 text-slate-400" />
                        <p className="text-xs font-bold uppercase tracking-widest leading-loose">Paste AI-Generated JSON</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="mt-10 flex flex-col gap-5">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] px-1 flex items-center gap-2">
                  <MousePointer2 className="w-3.5 h-3.5" /> AI Environments
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {AI_PORTALS.map((portal) => (
                    <button
                      key={portal.name}
                      onClick={() => window.open(portal.url, '_blank')}
                      className={`flex items-center justify-center gap-2.5 p-4 rounded-2xl text-[10px] font-black text-white transition-all transform hover:scale-[1.03] active:scale-95 shadow-lg ${portal.color}`}
                    >
                      <span className="text-lg">{portal.icon}</span>
                      <span className="truncate">{portal.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-12 bg-white dark:bg-slate-800/40 p-10 rounded-3xl border border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row items-center gap-10 shadow-xl">
        <div className="bg-indigo-600/10 p-6 rounded-2xl border border-indigo-500/20 shadow-xl shrink-0">
          <ShieldAlert className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-grow">
          <h4 className="text-slate-900 dark:text-slate-100 font-black text-sm mb-3 uppercase tracking-[0.2em]">Developer Integrity Notice</h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed italic font-medium">
            This workspace is curated by <strong>amirhp-com</strong>. The v1.4 logic is tuned for Elementor v3.0+ Flexbox Containers. 
            While highly optimized, we recommend manual verification of <strong>Dynamic Tags</strong> and <strong>Internal Links</strong> after importing the generated JSON. 
            This utility provides the architecture; final execution depends on your choice of LLM.
          </p>
        </div>
      </div>

      <footer className="mt-auto py-20 text-center border-t border-slate-200 dark:border-slate-800/60 flex flex-col items-center gap-12">
        <div className="flex flex-wrap items-center justify-center gap-10">
          <a href="https://amirhp.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center gap-4 font-black text-sm bg-white dark:bg-slate-800/40 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-xl hover:shadow-indigo-500/10 uppercase tracking-widest group">
            <Globe className="w-5 h-5 group-hover:rotate-45 transition-transform" /> Visit amirhp.com
          </a>
          <a href="https://github.com/amirhp-com" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-4 font-black text-sm bg-white dark:bg-slate-800/40 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-xl hover:shadow-white/5 uppercase tracking-widest group">
            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" /> Open Source
          </a>
        </div>
        <div className="space-y-3">
          <p className="text-slate-800 dark:text-slate-300 text-lg font-black tracking-tight">
            © {currentYear} | Handcrafted by <a href="https://amirhp.com" target="_blank" className="text-indigo-600 dark:text-indigo-400 hover:underline transition-colors">amirhp-com</a>
          </p>
          <div className="flex items-center justify-center gap-4">
            <p className="text-slate-500 dark:text-slate-600 text-[12px] uppercase tracking-[0.5em] font-black">Signature Developer Tools by amirhp.com</p>
            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-full border border-indigo-200 dark:border-indigo-800 animate-pulse shadow-sm">v1.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;