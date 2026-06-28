/*
 * =============================================================================
 * TaskFlow - Main Entry Point
 * =============================================================================
 *
 * Arquivo: src/main.tsx
 * Descrição: Ponto de entrada do React. Renderiza o componente App dentro
 *            do StrictMode do React para detecção de problemas em desenvolvimento.
 *            Monta a aplicação no elemento #root do index.html.
 *
 * Tecnologias: React 18, ReactDOM, TypeScript
 * =============================================================================
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);