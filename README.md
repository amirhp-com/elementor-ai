# Elementor AI Prompt Master v2.0

A high-end professional utility for developers to bridge the gap between modern web code (HTML/JSX/React) and Elementor v3.0+ Flexbox/Grid architectures.

## 🚀 New in v2.0
- **Paste-Ready JSON Conversion**: Instantly transform standard Elementor template JSON into the specific "Paste" format required for direct clipboard insertion in the Elementor editor.
- **Persistence 2.0**: Enhanced local storage logic now saves your preferred layout (Side-by-Side vs Stacked) along with theme and AI configurations.
- **Improved UI Stability**: Fixed tab label clipping and squishing issues on smaller viewports.
- **Side-by-Side Default View**: Optimized for widescreen monitors with a refined split-screen workspace enabled by default.
- **Refined Action Bar**: Grouped "Save JSON" and "Copy Paste-Ready" buttons into a single row for a faster conversion workflow.
- **Version 2.0 Engine**: Minor updates to the master bridge prompt for even better container hierarchy detection.

## 🌟 Key Features
- **Master Bridge Engine**: Generates highly specialized instructions for LLMs to ensure valid JSON output.
- **Live UI Simulation**: Real-time rendering of your source code within a sandboxed environment.
- **Midnight & Daylight Themes**: Full visual adaptability with state-saving.
- **Global AI Hub**: Direct access to top-tier AI models including Gemini, AI Studio, Claude, DeepSeek, and more.
- **One-Click Workflow**: Instant "Generate & Copy" shortcuts (Ctrl+C / Ctrl+Enter).

## 🌐 cPanel Deployment Guide

Deploying this React application to a cPanel environment is straightforward. Follow these steps:

### 1. Build the Application
Run the following command in your terminal to generate the production-ready files:
```bash
npm run build
```
This will create a `dist` folder in your project directory.

### 2. Prepare for Upload
1. Navigate into the `dist` folder.
2. Select all files inside and compress them into a single `.zip` file (e.g., `archive.zip`).

### 3. Upload to cPanel
1. Log in to your **cPanel dashboard**.
2. Open **File Manager**.
3. Go to `public_html` (for primary domain) or your specific subdomain folder.
4. Click **Upload** and select your `archive.zip`.
5. Once uploaded, right-click the zip file and select **Extract**.

### 4. Configure .htaccess (Optional but Recommended)
To ensure the application handles page refreshes correctly (especially if you add routing later), create a file named `.htaccess` in the same directory with this content:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 5. Verify the Base Path
The `vite.config.ts` is currently configured with `base: './'`, which works perfectly for most cPanel shared hosting and subdomain setups.

## 📦 Deployment (Cloud)
If you prefer automated cloud hosting:
1. Connect your repository to **Netlify** or **Vercel**.
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`

## 🛠️ Technical Stack
- **React 19**: Modern UI composition.
- **Tailwind CSS**: Utility-first styling with native Dark Mode support.
- **Lucide React**: High-quality vector iconography.
- **Vite**: Ultra-fast build tool and dev server.

---
*Developed with focus on DX by [AMIRHP.COM](https://amirhp.com)*