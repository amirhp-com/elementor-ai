import React from 'react';
import { AIPortal, AIModelPreset } from './types';

export const PREDEFINED_AI_MODELS: AIModelPreset[] = [
  {
    name: 'DeepSeek Chat',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    description: 'High-performance model with very low latency. Best for fast code generation.',
    providerUrl: 'https://platform.deepseek.com/'
  },
  {
    name: 'OpenRouter (Free Models)',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'deepseek/deepseek-r1-0528:free',
    description: 'Access various free and paid models (Llama, Gemma, Mistral) through one API.',
    providerUrl: 'https://openrouter.ai/keys'
  },
  {
    name: 'Groq Llama 3 (Fast)',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama3-70b-8192',
    description: 'Incredibly fast inference speed. Excellent for immediate code results.',
    providerUrl: 'https://console.groq.com/'
  },
  {
    name: 'OpenAI GPT-4o',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o',
    description: 'Most intelligent reasoning for complex React component structures.',
    providerUrl: 'https://platform.openai.com/'
  },
];

export const AI_PORTALS: AIPortal[] = [
  {
    name: 'Google AI Studio',
    url: 'https://aistudio.google.com/u/2/prompts/new_chat?model=gemini-3-flash-preview',
    icon: <img src="/google-ai-studio.svg" className="w-5 h-5 rounded-sm" alt="Google AI Studio" />,
    color: 'bg-slate-900 border-blue-400/30 hover:bg-blue-900/20'
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com/',
    icon: <img src="/gemini.svg" className="w-5 h-5 rounded-sm" alt="Gemini" />,
    color: 'bg-slate-900 border-blue-500/30 hover:bg-blue-900/20'
  },
  {
    name: 'Claude',
    url: 'https://claude.ai/',
    icon: <img src="/claude.svg" className="w-5 h-5 rounded-sm" alt="Claude" />,
    color: 'bg-slate-900 border-orange-500/30 hover:bg-orange-900/20'
  },
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com/',
    icon: <img src="/gpt.svg" className="w-5 h-5 rounded-sm" alt="ChatGPT" />,
    color: 'bg-slate-900 border-emerald-500/30 hover:bg-emerald-900/20'
  },
  {
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    icon: <img src="/deepseek.svg" className="w-5 h-5 rounded-sm" alt="DeepSeek" />,
    color: 'bg-slate-900 border-cyan-500/30 hover:bg-cyan-900/20'
  },
  {
    name: 'Perplexity',
    url: 'https://perplexity.ai/',
    icon: <img src="/perplexity.ico" className="w-5 h-5 rounded-sm" alt="Perplexity" />,
    color: 'bg-slate-900 border-indigo-500/30 hover:bg-indigo-900/20'
  },
  {
    name: 'Mistral',
    url: 'https://chat.mistral.ai/',
    icon: <img src="/mistral.svg" className="w-5 h-5 rounded-sm" alt="Mistral" />,
    color: 'bg-slate-900 border-amber-500/30 hover:bg-amber-900/20'
  },
  {
    name: 'Grok (xAI)',
    url: 'https://grok.com/',
    icon: <img src="/grok.svg" className="w-5 h-5 rounded-sm" alt="Grok" />,
    color: 'bg-slate-900 border-white/30 hover:bg-white/5'
  }
];

export const INITIAL_PROMPT_TEMPLATE = `Act as a Senior WordPress & Elementor Full-Stack Developer with 10+ years of experience in high-performance UI conversion. Your task is to convert the provided [HTML/React] code into a valid, production-ready Elementor JSON Template (Schema v3.0+).

### CORE ARCHITECTURAL RULES:
1. **Container Hierarchy (Flexbox First)**:
   - **Section (Outer)**: Set "content_width" to "full".
   - **Wrapper (Inner)**: Set "content_width" to "boxed" (1140px).
   - **Internal Elements**: Use Flexbox containers primarily. Use "Elementor Grid Container" ONLY for complex bento-style layouts or asymmetrical grids.
2. **Responsive Precision**:
   - You MUST explicitly define responsive values for **Desktop**, **tablet**, and **mobile** devices.
   - Adjust "flex_direction", "padding", "margin", "gap", and "font_size" for each breakpoint.
3. **RTL Optimization**: {{RTL_INSTRUCTION}}
4. **Performance**:
   - Avoid deep nesting.
   - Use Elementor's native widget settings for 95% of styling.
   - Use "custom_css" only for complex CSS pseudo-elements (::before, ::after) or hover transitions that the UI cannot handle natively.
5. Grid: {{GRID_INSTRUCTION}}

### WIDGET MAPPING STRATEGY:
1. **Headings & Text**: Map to "Heading" and "Text Editor" widgets. Ensure HTML tags (h1-h6, p) are preserved.
2. **Media**:
   - Images -> "Image" widget.
   - Backgrounds -> Container "background_overlay" or "background".
3. **Icons & SVGs**:
   - Convert all UI icons to optimized, minified SVG code.
   - Place SVGs inside "HTML" widgets or "Icon" widgets with custom SVG upload structure.
   - **CRITICAL**: Escape all double quotes (") with backslashes (\\") within SVG strings to prevent JSON parsing errors.
4. **Interactive Elements**: Map buttons to the "Button" widget. Map lists to "Icon List" where applicable.

### OUTPUT REQUIREMENTS (STRICT):
1. **Pure JSON**: Return ONLY the JSON code block. No explanations, no "Here is your JSON".
2. **Prettified**: The JSON must be well-indented and human-readable.
3. **Completeness**: Every single div, span, and style from the source must be accounted for in the Elementor structure.
4. **JSON FORMAT**: always remember to include "version": "0.4", "title": "{generate_title}", "type": "container" at top of json.
5. **Validation**: Ensure the final JSON adheres to Elementor's schema v3.0+ without any syntax errors.
6. **No External Resources**: Do NOT reference external CSS or JS. All styles must be embedded within the Elementor JSON structure.
7. **No Placeholder Text**: Do NOT include any placeholder text like "Generated JSON goes here". The output must be the actual JSON code block.
8. **Error Handling**: If the input code contains unsupported HTML elements or attributes, gracefully ignore them and proceed with the conversion without breaking the JSON structure.
9. **Testing**: The generated JSON should be directly importable into Elementor without any modifications or errors.
10. **Title Generation**: Create a concise, descriptive title for the template based on the content (e.g., "Hero Section with Button").
11. **Code Optimization**: Optimize the JSON for performance by minimizing unnecessary containers and using Elementor's native settings effectively.
12. **Semantic Accuracy**: Ensure that the semantic meaning of HTML elements is preserved in the Elementor structure (e.g., headings remain headings, paragraphs remain text editors).
13. **Class Handling**: If the input HTML contains classes, attempt to map them to Elementor's styling options. If a direct mapping isn't possible, include the class names in the "custom_css" field of the relevant widget for potential manual adjustments later.
14. **Color Handling**: If the input HTML contains color styles (e.g., text color, background color), ensure these are accurately reflected in the Elementor JSON using the appropriate color settings for each widget.
15. **Font Handling**: If the input HTML specifies font sizes, weights, or families, map these to Elementor's typography settings for the relevant widgets.
16. **Spacing Handling**: If the input HTML includes padding, margin, or gap styles, ensure these are translated into the corresponding Elementor settings for each widget and container.
17. **Flexbox Handling**: If the input HTML uses Flexbox for layout, ensure that the Elementor JSON reflects this with appropriate "flex_direction", "align_items", and "justify_content" settings in the relevant containers.
18. **Fallback Handling**: If certain HTML features cannot be directly translated into Elementor widgets or settings, provide a best-effort approximation using available Elementor features while maintaining the overall design and functionality as closely as possible.
19. **Testing and Validation**: After generating the JSON, validate it against Elementor's schema to ensure it can be imported without errors. If any issues are detected, adjust the JSON structure accordingly to meet Elementor's requirements.

---
### INPUT CODE:
\`\`\`
{{CODE}}
\`\`\`
---

Generate the complete Elementor JSON now. Ues a format so i can paste as widget, not import as json file. Give in Code Block to be Easy to Copy, Prettify and Indent json Code.`.trim();

export const SAMPLE_HTML = `<div class="p-10 bg-indigo-900 rounded-2xl text-white shadow-xl flex flex-col items-center gap-6 border border-white/10">
  <h2 class="text-3xl font-semibold tracking-tight">Midnight HTML</h2>
  <p class="text-indigo-200 text-center max-w-sm">This is a pure HTML sample for Elementor conversion.</p>
  <button class="px-6 py-2 bg-indigo-500 rounded-lg font-medium hover:bg-indigo-400">Action</button>
</div>`;

export const SAMPLE_JSX = `<div className="p-10 bg-indigo-950 rounded-2xl text-white flex flex-col gap-4">
  <h2 className="text-2xl font-bold">Midnight JSX</h2>
  <ul className="space-y-2">
    {[1, 2, 3].map(i => (
      <li key={i} className="flex items-center gap-2">
        <span className="w-2 h-2 bg-indigo-400 rounded-full" />
        Feature Item {i}
      </li>
    ))}
  </ul>
</div>`;

export const SAMPLE_COMPONENT = `function MidnightHero() {
  const [active, setActive] = React.useState(false);
  return (
    <div className="relative overflow-hidden bg-slate-900 p-12 rounded-3xl border border-white/5">
      <div className="relative z-10">
        <h1 className="text-5xl font-extrabold text-white mb-4">The Future is Indigo</h1>
        <p className="text-slate-400 text-lg mb-8 max-w-lg">A full React component sample ready for Elementor translation.</p>
        <button
          onClick={() => setActive(!active)}
          className="px-8 py-3 bg-indigo-600 rounded-xl text-white font-semibold transition-all active:scale-95"
        >
          {active ? 'Active Mode' : 'Explore Now'}
        </button>
      </div>
    </div>
  );
}`;