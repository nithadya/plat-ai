import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './Context/StoreContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter futureFlags={{ v7_startTransition: true, v7_relativeSplatPath: true }}>    
  <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </BrowserRouter>,
)
