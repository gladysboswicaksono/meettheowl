import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import OwllocatePage from './pages/OwllocatePage.jsx'
import TrainingImpactPage from './pages/TrainingImpactPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/owllocate-get-started" element={<OwllocatePage />} />
        <Route path="/training-impact" element={<TrainingImpactPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
