# Elementor AI Prompt Master v1.6

A professional utility for developers to convert HTML/React code into high-quality Elementor JSON templates.

## 🌟 New in v1.6
- **Enhanced Live Preview**: Added Full-Width and Full-Screen viewing modes for better responsive testing.
- **Rendering States**: Integrated loading spinners and debounced rendering for a smoother UI experience.
- **Stability Fixes**: Refactored the code clearing logic and updated project repository references.
- **Improved Preview Engine**: Better handling of React fragments and inline styles.

## 🚀 Deployment (Crucial)
This app uses TypeScript and JSX. You **cannot** simply upload the source files to a static host. You must use a build tool like Vite.

### Deploying to Netlify
1. Connect your repository.
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`

### Deploying to GitHub Pages
1. Ensure you have a GitHub Action that runs `npm run build`.
2. Configure the action to deploy the contents of the `dist` folder to the `gh-pages` branch.

## 🛠️ Local Development
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build`

## 💻 Technical Stack
- **React 19**
- **Tailwind CSS**
- **Vite** (Build Tool)
- **Lucide React** (Icons)

---
*Created with ❤️ by [AMIRHP.COM](https://amirhp.com)*