// Entry point for PromptOverflow application
// Built with React 19, Vite, and Tailwind CSS
// Stack Setup & Build Config: Farrel
// Architecture: Ren

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize React app with strict mode for development best practices
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
