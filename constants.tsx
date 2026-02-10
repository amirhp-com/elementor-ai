
import React from 'react';
import { AIPortal, PromptConfig } from './types';

export const AI_PORTALS: AIPortal[] = [
  {
    name: 'Google AI Studio',
    url: 'https://aistudio.google.com/',
    icon: '✨',
    color: 'bg-blue-600 hover:bg-blue-500'
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com/',
    icon: '♊',
    color: 'bg-indigo-600 hover:bg-indigo-500'
  },
  {
    name: 'Google Cloud AI',
    url: 'https://console.cloud.google.com/vertex-ai',
    icon: '☁️',
    color: 'bg-sky-700 hover:bg-sky-600'
  },
  {
    name: 'Claude',
    url: 'https://claude.ai/',
    icon: '🎙️',
    color: 'bg-orange-700 hover:bg-orange-600'
  },
  {
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    icon: '🐳',
    color: 'bg-cyan-600 hover:bg-cyan-500'
  },
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com/',
    icon: '🤖',
    color: 'bg-emerald-600 hover:bg-emerald-500'
  }
];

export const DEFAULT_PROMPT_TEMPLATE = (code: string, config: PromptConfig) => `
Act as a Senior WordPress & Elementor Full-Stack Developer with 10+ years of experience in high-performance UI conversion. Your task is to convert the provided [HTML/React] code into a valid, production-ready Elementor JSON Template (Schema v3.0+).

### CORE ARCHITECTURAL RULES:
1. **Container Hierarchy (Flexbox First)**:
   - **Section (Outer)**: Set "content_width" to "full".
   - **Wrapper (Inner)**: Set "content_width" to "boxed" (1140px).
   - **Internal Elements**: Use Flexbox containers primarily. Use "Elementor Grid Container" ONLY for complex bento-style layouts or asymmetrical grids.
2. **Responsive Precision**:
   - You MUST explicitly define responsive values for **Desktop**, **tablet**, and **mobile** devices.
   - Adjust "flex_direction", "padding", "margin", "gap", and "font_size" for each breakpoint.
3. **RTL Optimization**:
   ${config.includeRTL ? "- Detect Persian/Arabic content. If present, mirror flex alignments (e.g., 'flex-start' becomes 'flex-end') and switch horizontal padding/margin logic for RTL compatibility." : "- Standard LTR alignment."}
4. **Performance**:
   - Avoid deep nesting.
   - Use Elementor's native widget settings for 95% of styling.
   - Use "custom_css" only for complex CSS pseudo-elements (::before, ::after) or hover transitions that the UI cannot handle natively.

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
### INPUT CODE TO CONVERT:
\`\`\`html
${code}
\`\`\`
---

Generate the complete Elementor JSON now.
`.trim();

export const SAMPLE_HTML = `<div class="p-8 bg-indigo-600 rounded-3xl text-white shadow-2xl flex flex-col items-center gap-4">
  <h2 class="text-3xl font-bold">Hello World!</h2>
  <p class="text-indigo-100 text-center">This is a sample component generated to test the Elementor AI Prompt Master v1.5</p>
  <button class="px-6 py-2 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-colors">
    Get Started
  </button>
</div>`;
