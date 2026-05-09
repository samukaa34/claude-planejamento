// Ponto de entrada da aplicação — monta o componente raiz App dentro do elemento #root do HTML
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode ativa avisos extras durante o desenvolvimento (não afeta produção)
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
