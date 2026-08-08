import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './css/portal-theme.css';
import './css/portal-app.css';
import './css/portal-alerts.css';
import './css/portal-ui.css';
import './css/msnc-overrides.css';
import './css/portal-compat.css';
import './css/msnc-pages.css';
import './css/app.css';
import { ensureCsrf } from './lib/api';

ensureCsrf().catch(() => {});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
