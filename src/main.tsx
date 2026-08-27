import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Register lightweight Service Worker for PWA installation
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const basePath = import.meta.env.BASE_URL || './';
    const swPath = `${basePath.endsWith('/') ? basePath : basePath + '/'}sw.js`;
    navigator.serviceWorker.register(swPath).catch((err) => {
      if (import.meta.env.DEV) {
        console.debug('Service Worker registration:', err);
      }
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

