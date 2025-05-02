
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "next-themes"
import { initializeThemePreferences } from './utils/theme-initializer.ts'

// Initialize theme preferences
initializeThemePreferences();

// Update favicon dynamically
const setFavicon = () => {
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/png';
  link.rel = 'shortcut icon';
  link.href = '/lovable-uploads/bca827df-e2b6-4764-8e29-be1293c605af.png';
  document.getElementsByTagName('head')[0].appendChild(link);
};

// Set favicon
setFavicon();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
