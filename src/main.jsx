// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
)

const form     = document.getElementById('event-form');
const urlInput = document.getElementById('url');

form.addEventListener('submit', e => {
    e.preventDefault();                   // ← stops navigation
    console.log('Submitted URL:', urlInput.value);
    // …do your fetch/validation here…
});

