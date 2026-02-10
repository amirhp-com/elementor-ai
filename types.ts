
import React from 'react';

export interface AIPortal {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

export type InputMode = 'html' | 'jsx' | 'component';

export interface PromptConfig {
  includeRTL: boolean;
  useGrids: boolean;
  optimizeSVGs: boolean;
  inputMode: InputMode;
  customPrompt?: string;
}