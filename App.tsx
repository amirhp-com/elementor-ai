import React, { useState, useEffect, useRef } from 'react';
import {
  Copy, Check, Code2, Wand2, Settings2, Cpu,
  AlertCircle, Eye, EyeOff, Github, Globe, ShieldAlert,
  MousePointer2, Info, Download, FileJson, Layout,
  Sun, Moon, Trash2, Zap, RefreshCw, Maximize2, Minimize2, X, Monitor, Loader2,
  FileCode, SquareTerminal, Layers, Settings, Save, Upload, ArrowUp, Command, RotateCcw,
  Link, Key, Bot, Play, ExternalLink, Coins, Columns, Rows, ClipboardCheck
} from 'lucide-react';
import Button from './components/Button';
import { AI_PORTALS, INITIAL_PROMPT_TEMPLATE, SAMPLE_HTML, SAMPLE_JSX, SAMPLE_COMPONENT, PREDEFINED_AI_MODELS } from './constants';
import { PromptConfig, InputMode, AISettings, AIModelPreset } from './types';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

const App: React.FC = () => {
  const savedPrompt = localStorage.getItem('elementor_custom_prompt') || INITIAL_PROMPT_TEMPLATE;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const savedAISettings = localStorage.getItem('elementor_ai_settings');
  const savedLayout = localStorage.getItem('elementor_layout') || 'split';

  const [sourceCode, setSourceCode] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [activeTab, setActiveTab] = useState<'prompt' | 'json' | 'ai-result'>('prompt');
  const [pastedJson, setPastedJson] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(savedTheme === 'dark');
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isAISettingsModalOpen, setIsAISettingsModalOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(savedPrompt);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'split' | 'stack'>(savedLayout as 'split' | 'stack');

  const [aiSettings, setAiSettings] = useState<AISettings>(
    savedAISettings ? JSON.parse(savedAISettings) : {
      endpoint: PREDEFINED_AI_MODELS[0].endpoint,
      apiKey: '',
      model: PREDEFINED_AI_MODELS[0].model,
    }
  );

  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiResponseText, setAiResponseText] = useState('');

  const [config, setConfig] = useState<PromptConfig>({
    includeRTL: true,
    useGrids: true,
    optimizeSVGs: true,
    inputMode: 'html'
  });

  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleLoadSample = () => {
    let sample = SAMPLE_HTML;
    if (config.inputMode === 'jsx') sample = SAMPLE_JSX;
    if (config.inputMode === 'component') sample = SAMPLE_COMPONENT;
    setSourceCode(sample);
    addToast(`Loaded Default ${config.inputMode.toUpperCase()}`, 'info');
  };

  const handleResetTemplate = () => {
    setCustomPrompt(INITIAL_PROMPT_TEMPLATE);
    addToast('Default Template Restored', 'info');
  };

  const buildPrompt = () => {
    return (customPrompt || INITIAL_PROMPT_TEMPLATE)
      .replace('{{CODE}}', sourceCode)
      .replace('{{RTL_INSTRUCTION}}', config.includeRTL ? "Mirror layouts for RTL (Farsi/Arabic)." : "LTR only.")
      .replace('{{GRID_INSTRUCTION}}', config.useGrids ? "Use Elementor Grid Containers." : "Use Flexbox Containers.");
  };

  const handleGeneratePrompt = () => {
    if (!sourceCode.trim()) {
      addToast('Please enter some code first', 'warning');
      return;
    }
    setGeneratedPrompt(buildPrompt());
    setActiveTab('prompt');
    addToast('Master Prompt Generated', 'success');
    if (window.innerWidth < 1024) {
      document.getElementById('output-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const runWithAI = async () => {
    if (!sourceCode.trim()) {
      addToast('Input code required', 'warning');
      return;
    }
    if (!aiSettings.apiKey) {
      addToast('API Key is missing', 'error');
      setIsAISettingsModalOpen(true);
      return;
    }

    const fullPrompt = buildPrompt();
    setGeneratedPrompt(fullPrompt);
    setIsAIProcessing(true);
    setAiResponseText('');
    setActiveTab('ai-result');

    try {
      const response = await fetch(aiSettings.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiSettings.apiKey}`,
        },
        body: JSON.stringify({
          model: aiSettings.model,
          messages: [{ role: 'user', content: fullPrompt }],
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `AI Provider Error (HTTP ${response.status})`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'No response data.';
      setAiResponseText(content);
      addToast('AI Generation Complete', 'success');
    } catch (err: any) {
      setAiResponseText(`Error: ${err.message}`);
      addToast(err.message, 'error');
    } finally {
      setIsAIProcessing(false);
    }
  };

  const checkAIConnection = async () => {
    if (!aiSettings.apiKey) {
      addToast('Please enter an API Key first', 'warning');
      return;
    }
    addToast('Testing connection...', 'info');
    setIsCheckingBalance(true);

    try {
      if (aiSettings.endpoint.includes('openrouter.ai')) {
        const balanceRes = await fetch('https://openrouter.ai/api/v1/auth/key', {
          headers: { 'Authorization': `Bearer ${aiSettings.apiKey}` }
        });
        if (balanceRes.ok) {
          const balData = await balanceRes.json();
          const limit = balData.data.limit === null ? 'Unlimited' : `$${balData.data.limit.toFixed(4)}`;
          const usage = `$${balData.data.usage.toFixed(4)}`;
          setAiSettings(prev => ({ ...prev, balance: `Usage: ${usage} / Limit: ${limit}` }));
          addToast('OpenRouter Connected', 'success');
          return;
        }
      }

      const response = await fetch(aiSettings.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiSettings.apiKey}`,
        },
        body: JSON.stringify({
          model: aiSettings.model,
          messages: [{ role: 'user', content: 'Ping' }],
          max_tokens: 5,
        }),
      });
      if (response.ok) {
        addToast('Connection Successful!', 'success');
      } else {
        throw new Error(`Provider returned error ${response.status}`);
      }
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsCheckingBalance(false);
    }
  };

  const handleSelectPreset = (m: AIModelPreset) => {
    setAiSettings({ ...aiSettings, endpoint: m.endpoint, model: m.model, balance: undefined });
    addToast(`Preset ${m.name} Loaded`, 'info');
  };

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      addToast('Copied to Clipboard', 'success');
    } catch (err) {}
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('elementor_ai_settings', JSON.stringify(aiSettings));
  }, [aiSettings]);

  useEffect(() => {
    localStorage.setItem('elementor_layout', layoutMode);
  }, [layoutMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGeneratePrompt();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const selection = window.getSelection()?.toString();
        if (!selection && sourceCode.trim()) {
          e.preventDefault();
          handleGenerateAndCopy();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sourceCode, customPrompt, config]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('elementor_custom_prompt', customPrompt);
  }, [customPrompt]);

  useEffect(() => {
    if (!sourceCode.trim()) {
      setPreviewContent('');
      setIsPreviewLoading(false);
      return;
    }

    setIsPreviewLoading(true);
    const timer = setTimeout(() => {
      let renderLogic = '';
      if (config.inputMode === 'html') {
        renderLogic = `document.getElementById('preview-root').innerHTML = \`${sourceCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;`;
      } else if (config.inputMode === 'jsx') {
        renderLogic = `
          const Content = () => (<React.Fragment>${sourceCode}</React.Fragment>);
          ReactDOM.createRoot(document.getElementById('preview-root')).render(<Content />);
        `;
      } else {
        renderLogic = `
          ${sourceCode}
          const rootElement = document.getElementById('preview-root');
          const componentMatch = "${sourceCode.match(/function\s+(\w+)/)?.[1] || sourceCode.match(/const\s+(\w+)\s*=\s*\(/)?.[1] || 'App'}";
          try {
            const Target = typeof eval(componentMatch) !== 'undefined' ? eval(componentMatch) : () => <div>Component {componentMatch} not found.</div>;
            ReactDOM.createRoot(rootElement).render(<Target />);
          } catch(e) {
             document.getElementById('preview-root').innerHTML = '<div class="error-box">Render Error: ' + e.message + '</div>';
          }
        `;
      }

      const docString = `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <style>
              body { background: transparent; padding: 2rem; margin: 0; min-height: 100vh; font-family: sans-serif; color: ${isDarkMode ? '#f1f5f9' : '#334155'}; }
              .error-box { background: #450a0a; color: #fca5a5; padding: 1rem; border: 1px solid #ef4444; border-radius: 8px; font-family: monospace; }
            </style>
          </head>
          <body>
            <div id="preview-root"></div>
            <script type="text/babel">
              try { ${renderLogic} } catch (err) {
                document.getElementById('preview-root').innerHTML = '<div class="error-box">Error: ' + err.message + '</div>';
              }
            </script>
          </body>
        </html>
      `;
      setPreviewContent(docString);
      setTimeout(() => setIsPreviewLoading(false), 300);
    }, 600);
    return () => clearTimeout(timer);
  }, [sourceCode, config.inputMode, isDarkMode]);

  const downloadResultJson = () => {
    if (!pastedJson.trim()) return;
    try {
      JSON.parse(pastedJson);
      const blob = new Blob([pastedJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `elementor-template.json`;
      link.click();
      addToast('File Downloaded', 'success');
    } catch (e) {
      addToast('Invalid JSON structure', 'error');
    }
  };

  const copyPasteReadyJson = async () => {
    if (!pastedJson.trim()) return;
    try {
      const source = JSON.parse(pastedJson);
      // Logic: convert template JSON (version, title, content) to Paste JSON (type: elementor, elements: content)
      const pasteReady = {
        type: "elementor",
        siteurl: "",
        elements: source.content || source.elements || []
      };
      await navigator.clipboard.writeText(JSON.stringify(pasteReady, null, 2));
      addToast('Paste-Ready JSON Copied!', 'success');
    } catch (e) {
      addToast('Could not convert to Paste-Ready format', 'error');
    }
  };

  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return <Check className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <ShieldAlert className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getToastColor = (type: Toast['type']) => {
    switch (type) {
      case 'success': return 'bg-emerald-600 dark:bg-emerald-500 text-white';
      case 'info': return 'bg-blue-600 dark:bg-blue-500 text-white';
      case 'warning': return 'bg-amber-600 dark:bg-amber-500 text-white';
      case 'error': return 'bg-rose-600 dark:bg-rose-500 text-white';
      default: return 'bg-slate-800 text-white';
    }
  };

  const handleGenerateAndCopy = async () => {
    if (!sourceCode.trim()) return;
    const processedPrompt = buildPrompt();
    setGeneratedPrompt(processedPrompt);
    try {
      await navigator.clipboard.writeText(processedPrompt);
      setIsCopied(true);
      addToast('Prompt Copied', 'success');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {}
  };

  const renderAIResponse = () => {
    if (isAIProcessing) {
      return (
        <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Processing Code Bridge...</span>
        </div>
      );
    }
    if (!aiResponseText) {
      return <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-10">
        <Bot className="w-10 h-10 mb-4 mx-auto" />
        <div className="text-[10px] font-bold uppercase tracking-widest">Connect AI in settings to automate the bridge conversion.</div>
      </div>;
    }

    const blocks = aiResponseText.split(/```/);
    return (
      <div className="space-y-4 pb-10">
        {blocks.map((block, i) => {
          if (i % 2 === 1) {
            const lines = block.split('\n');
            const lang = lines[0].trim();
            const content = lines.slice(1).join('\n').trim();
            return (
              <div key={i} className="group relative bg-slate-900 rounded-xl border border-white/10 overflow-hidden">
                <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{lang || 'code'}</span>
                  <button onClick={() => copyToClipboard(content)} className="p-1.5 hover:bg-indigo-500 hover:text-white rounded-md transition-all text-indigo-400">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <pre className="p-5 text-[11px] font-mono text-indigo-300 overflow-x-auto whitespace-pre">{content}</pre>
              </div>
            );
          }
          return <p key={i} className="text-[12px] text-slate-400 leading-relaxed whitespace-pre-wrap">{block.trim()}</p>;
        })}
      </div>
    );
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 selection:bg-indigo-500/30 transition-all duration-500 pt-32 pb-20">

      {/* Dynamic Toasts */}
      <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`backdrop-blur-md px-5 py-3 rounded-xl shadow-2xl border border-white/10 animate-toast flex items-center gap-3 ${getToastColor(toast.type)} pointer-events-auto`}>
            {getToastIcon(toast.type)}
            <span className="text-[11px] font-semibold uppercase tracking-wider">{toast.message}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-10 right-10 z-[100] p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-2xl transition-all duration-500 active:scale-90 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {/* Master Prompt Modal */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md" onClick={() => setIsPromptModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <SquareTerminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold uppercase tracking-widest text-slate-800 dark:text-white">Global Prompt Template Editor</h3>
              </div>
              <button onClick={() => setIsPromptModalOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"><X /></button>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">System Placeholders: <code>{'{{CODE}}'}</code>, <code>{'{{RTL_INSTRUCTION}}'}</code>, <code>{'{{GRID_INSTRUCTION}}'}</code></p>
              <textarea
                className="w-full h-96 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl p-6 text-sm font-mono focus:ring-1 focus:ring-indigo-500 outline-none resize-none leading-relaxed dark:text-slate-200 text-slate-700"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-white/10 flex justify-between gap-3">
              <Button variant="outline" onClick={handleResetTemplate} className="gap-2 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/30">
                <RotateCcw className="w-4 h-4" /> Load Default Template
              </Button>
              <Button variant="primary" onClick={() => setIsPromptModalOpen(false)} className="gap-2 px-10">
                <Save className="w-4 h-4" /> Save Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Settings Modal */}
      {isAISettingsModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md" onClick={() => setIsAISettingsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold uppercase tracking-widest text-slate-800 dark:text-white">AI Engine Gateway</h3>
              </div>
              <button onClick={() => setIsAISettingsModalOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"><X /></button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">Optimized Provider Presets</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PREDEFINED_AI_MODELS.map(m => (
                    <div
                      key={m.name}
                      onClick={() => handleSelectPreset(m)}
                      className={`p-4 border rounded-xl text-left transition-all cursor-pointer group relative ${aiSettings.endpoint === m.endpoint ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/5'}`}
                    >
                      <div className={`text-[10px] font-bold uppercase mb-1 ${aiSettings.endpoint === m.endpoint ? 'text-indigo-500' : 'text-slate-600 dark:text-slate-400'}`}>{m.name}</div>
                      <div className="text-[10px] text-slate-500 leading-tight mb-2 opacity-60 group-hover:opacity-100">{m.description}</div>
                      <a
                        href={m.providerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-[9px] text-indigo-400 font-medium hover:underline z-20 relative"
                      >
                        Get API Key <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400"><Link className="w-3 h-3"/> Endpoint URL</label>
                  <input
                    type="text"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                    value={aiSettings.endpoint}
                    onChange={(e) => setAiSettings({ ...aiSettings, endpoint: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400"><Bot className="w-3 h-3"/> Model ID</label>
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={aiSettings.model}
                      onChange={(e) => setAiSettings({ ...aiSettings, model: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400"><Key className="w-3 h-3"/> Auth Key</label>
                    <input
                      type="password"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                      placeholder="sk-..."
                      value={aiSettings.apiKey}
                      onChange={(e) => setAiSettings({ ...aiSettings, apiKey: e.target.value })}
                    />
                  </div>
                </div>
                {aiSettings.balance && (
                  <div className="flex items-center gap-2 p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-[10px] font-bold">
                    <Coins className="w-3.5 h-3.5" />
                    {aiSettings.balance}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-white/10 flex justify-between gap-3">
              <Button variant="outline" onClick={checkAIConnection} disabled={isCheckingBalance} className="gap-2">
                {isCheckingBalance ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Check Connectivity
              </Button>
              <Button variant="primary" onClick={() => setIsAISettingsModalOpen(false)} className="gap-2 px-10">
                <Save className="w-4 h-4" /> Save Configuration
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Preview */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[500] bg-slate-50 dark:bg-slate-950 flex flex-col">
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-200">Elementor UI Engine Simulation</span>
            </div>
            <button onClick={() => setIsFullscreen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"><X /></button>
          </div>
          <iframe srcDoc={previewContent} className="flex-grow w-full border-none bg-white" title="Live" />
        </div>
      )}

      {/* Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-[250] bg-white/80 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 shadow-xl">
        <div className="max-w-7xl mx-auto py-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-900/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">Elementor AI <span className="text-indigo-600 dark:text-indigo-400">v2.0</span></h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-[9px] uppercase tracking-widest">Advanced HTML/JSX Bridge Code to Elementor v3.0+</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             {/* AI Config Stack */}
             <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/20 p-1.5 rounded-xl border border-slate-200 dark:border-white/10">
               <button
                 onClick={() => setIsAISettingsModalOpen(true)}
                 className="p-2 px-3 hover:bg-white dark:hover:bg-white/5 rounded-lg transition-all text-slate-600 dark:text-slate-300 flex items-center gap-2"
               >
                 <Bot className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">AI Config</span>
               </button>
               <div className="w-px h-5 bg-slate-200 dark:bg-white/10"></div>
               <button
                 onClick={() => setIsPromptModalOpen(true)}
                 className="p-2 px-3 hover:bg-white dark:hover:bg-white/5 rounded-lg transition-all text-slate-600 dark:text-slate-300 flex items-center gap-2"
               >
                 <Settings className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">Prompt</span>
               </button>
             </div>

             {/* Utility Stack */}
             <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/20 p-1.5 rounded-xl border border-slate-200 dark:border-white/10">
                <button
                  onClick={() => setLayoutMode(layoutMode === 'split' ? 'stack' : 'split')}
                  className={`p-2 rounded-lg transition-all text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/5 ${layoutMode === 'split' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
                  title={layoutMode === 'split' ? "Stacked Layout" : "Side-by-Side Layout"}
                >
                  {layoutMode === 'split' ? <Columns className="w-4 h-4" /> : <Rows className="w-4 h-4" />}
                </button>
                <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1"></div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 hover:bg-white dark:hover:bg-white/5 rounded-lg transition-all text-slate-600 dark:text-slate-300"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                </button>
                <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1"></div>
                <a href="https://github.com/amirhp-com" target="_blank" className="p-2 hover:bg-white dark:hover:bg-white/5 rounded-lg transition-all text-slate-600 dark:text-slate-300">
                  <Github className="w-4 h-4" />
                </a>
             </div>
          </div>
        </div>
      </header>

      <main className={`max-w-7xl mx-auto px-6 grid gap-8 items-start ${layoutMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        <div className={layoutMode === 'split' ? 'lg:col-span-8 space-y-10' : 'space-y-10'}>

          {/* Editor Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex bg-white dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-white/5">
                   {(['html', 'jsx', 'component'] as const).map(mode => (
                     <button
                       key={mode}
                       onClick={() => setConfig({...config, inputMode: mode})}
                       className={`px-4 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-tighter transition-all ${config.inputMode === mode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                     >
                       {mode === 'component' ? 'React Component' : mode}
                     </button>
                   ))}
                </div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center gap-2"
                >
                  {showPreview ? <><EyeOff className="w-4 h-4" /> Hide</> : <><Eye className="w-4 h-4" /> Preview</>}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadSample}
                  className="p-2 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-lg text-indigo-600 dark:text-indigo-400 transition-all"
                  title="Load Default Template"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setSourceCode(''); addToast('Editor Cleared', 'info'); }}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={`grid ${showPreview && !isPreviewExpanded ? 'grid-cols-2' : 'grid-cols-1'} divide-x divide-slate-200 dark:divide-white/5 h-[600px]`}>
              {(!isPreviewExpanded || !showPreview) && (
                <div className="relative flex bg-white dark:bg-slate-950 overflow-hidden">
                  <div className="w-10 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 pt-6 text-center text-[10px] font-mono text-slate-400 dark:text-slate-700 select-none">
                    {Array.from({length: 30}).map((_, i) => <div key={i} className="leading-relaxed">{i+1}</div>)}
                  </div>
                  <textarea
                    className="flex-grow bg-transparent p-6 text-slate-800 dark:text-slate-300 font-mono text-sm focus:outline-none resize-none leading-relaxed"
                    placeholder="Input code (HTML, JSX, or Component)..."
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                  />
                </div>
              )}

              {showPreview && (
                <div className="relative bg-white flex flex-col group">
                  <div className="absolute top-4 right-4 z-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setIsPreviewExpanded(!isPreviewExpanded)} className="p-2 bg-slate-900/80 backdrop-blur rounded-lg text-white shadow-xl" title="Expand Viewport"><Maximize2 className="w-4 h-4" /></button>
                    <button onClick={() => setIsFullscreen(true)} className="p-2 bg-slate-900/80 backdrop-blur rounded-lg text-white shadow-xl" title="Full Screen"><Monitor className="w-4 h-4" /></button>
                  </div>
                  {isPreviewLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 dark:bg-slate-900/40 backdrop-blur-[1px]">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                  )}
                  <iframe srcDoc={previewContent} className="w-full h-full border-none bg-transparent" />
                </div>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Bridge Logic Optimizers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'includeRTL', label: 'RTL Conversion', desc: 'Auto-mirror for Persian/Arabic layouts' },
                { id: 'useGrids', label: 'Flex/Grid Architecture', desc: 'Prioritize Elementor 3.0 Grid Containers' }
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 cursor-pointer hover:border-indigo-500/30 transition-all">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-indigo-600 focus:ring-0"
                    checked={(config as any)[opt.id]}
                    onChange={(e) => setConfig({...config, [opt.id]: e.target.checked})}
                  />
                  <div>
                    <div className="font-semibold text-xs tracking-wide text-slate-800 dark:text-slate-200">{opt.label}</div>
                    <div className="text-[10px] text-slate-500">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="xl"
                className="w-full border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/5 group"
                onClick={handleGeneratePrompt}
                disabled={!sourceCode.trim()}
              >
                <div className="flex items-center justify-center gap-4">
                  <Wand2 className="w-5 h-5" />
                  <span className="text-lg">Build Prompt</span>
                </div>
              </Button>
              <Button
                variant="primary"
                size="xl"
                className="w-full shadow-2xl shadow-indigo-900/20 group"
                onClick={runWithAI}
                disabled={!sourceCode.trim() || isAIProcessing}
              >
                <div className="flex items-center justify-center gap-4">
                  {isAIProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                  <span className="text-lg">Automate Bridge</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        <aside id="output-section" className={`${layoutMode === 'split' ? 'lg:col-span-4 sticky top-32' : ''} space-y-8`}>
          <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl flex flex-col ${layoutMode === 'split' ? 'h-[750px]' : 'h-[600px]'}`}>
            <div className="flex border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50 overflow-x-auto scrollbar-none">
              <button onClick={() => setActiveTab('prompt')} className={`flex-1 min-w-[100px] py-4 text-[9px] font-semibold uppercase tracking-widest transition-all ${activeTab === 'prompt' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-indigo-500'}`}>Prompt</button>
              <button onClick={() => setActiveTab('ai-result')} className={`flex-1 min-w-[100px] py-4 text-[9px] font-semibold uppercase tracking-widest transition-all ${activeTab === 'ai-result' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-indigo-500'}`}>AI Output</button>
              <button onClick={() => setActiveTab('json')} className={`flex-1 min-w-[100px] py-4 text-[9px] font-semibold uppercase tracking-widest transition-all ${activeTab === 'json' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-indigo-500'}`}>JSON</button>
            </div>

            <div className="p-6 flex-grow flex flex-col gap-5 overflow-hidden">
              <div className="flex flex-col gap-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
                    {activeTab === 'prompt' ? 'Bridge Instruction' : activeTab === 'ai-result' ? 'Direct Intelligence' : 'Ready JSON'}
                  </span>
                  {activeTab === 'prompt' && generatedPrompt && (
                    <button onClick={() => copyToClipboard(generatedPrompt)} className="px-4 py-2 rounded-lg text-[10px] font-semibold uppercase transition-all flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  )}
                </div>
                {activeTab === 'json' && pastedJson && (
                   <div className="flex flex-row gap-2">
                     <button onClick={downloadResultJson} className="flex-1 px-4 py-2 rounded-lg text-[10px] font-semibold uppercase transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg">
                        <Download className="w-3 h-3" /> Save JSON
                      </button>
                      <button onClick={copyPasteReadyJson} className="flex-1 px-4 py-2 rounded-lg text-[10px] font-semibold uppercase transition-all flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-white/5">
                        <ClipboardCheck className="w-3 h-3" /> Copy Paste-Ready
                      </button>
                   </div>
                )}
              </div>

              <div className="flex-grow bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/5 p-5 relative overflow-y-auto scrollbar-thin">
                {activeTab === 'prompt' ? (
                  <div className="h-full text-[11px] font-mono leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                    {generatedPrompt || <div className="h-full flex flex-col items-center justify-center opacity-30 text-center"><Wand2 className="w-10 h-10 mb-4" /> Ready to build instructions</div>}
                  </div>
                ) : activeTab === 'ai-result' ? (
                  renderAIResponse()
                ) : (
                  <textarea
                    className="w-full h-full bg-transparent outline-none resize-none text-[11px] font-mono leading-relaxed text-indigo-600 dark:text-indigo-300 placeholder:text-slate-400 dark:placeholder:text-slate-800"
                    placeholder="Paste your AI generated Elementor JSON here..."
                    value={pastedJson}
                    onChange={(e) => setPastedJson(e.target.value)}
                  />
                )}
              </div>

              <div className="space-y-4 flex-shrink-0">
                <h3 className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Global AI Hub Portals</h3>
                <div className="grid grid-cols-2 gap-2">
                  {AI_PORTALS.map(portal => (
                    <button key={portal.name} onClick={() => window.open(portal.url, '_blank')} className={`p-3 border border-slate-200 dark:border-white/5 rounded-xl flex items-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-95 bg-white dark:bg-slate-950 group shadow-sm`}>
                      <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                        {portal.icon}
                      </div>
                      <span className="text-[9px] font-medium uppercase tracking-tight text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 truncate">{portal.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="max-w-7xl mx-auto px-6 border-t border-slate-200 dark:border-white/5 mt-20 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
        <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
          <span>Copyright &copy; {currentYear}, A Project by</span>
          <a href="https://amirhp.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">Amirhp.Com</a>
        </div>
        <div className="flex gap-8 text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
          <a href="https://blackswandev.com" className="hover:text-slate-900 dark:hover:text-white">BlackSwan</a>
          <a href="https://github.com/amirhp-com/elementor-ai" className="hover:text-slate-900 dark:hover:text-white">GitHub Project</a>
        </div>
      </footer>
    </div>
  );
};

export default App;