import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import { CartProvider } from './context/CartContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import ScrollToTop from './components/ScrollToTop';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ThemeProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
