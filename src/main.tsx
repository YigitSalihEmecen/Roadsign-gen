import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RoadSignAPI } from './api';

declare global {
  interface Window {
    RoadSignAPI: typeof RoadSignAPI;
  }
}

if (typeof window !== 'undefined') {
  window.RoadSignAPI = RoadSignAPI;
}

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export * from './api';
