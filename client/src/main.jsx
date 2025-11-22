import React from 'react'
import ReactDOM from 'react-dom/client'
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import App from './App.jsx'
import './styles/global.css'

// Manifest URL must be absolute for production, but relative works for some local setups or needs a tunnel.
// For localhost, we might need to use the full URL if testing on a real device, but for now:
const manifestUrl = '/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>,
)
