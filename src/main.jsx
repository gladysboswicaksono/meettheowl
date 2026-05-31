import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import OwllocatePage from './pages/OwllocatePage.jsx'
import TrainingImpactPage from './pages/TrainingImpactPage.jsx'
import NeedsAnalysisPage from './pages/NeedsAnalysisPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/owllocate-get-started" element={<OwllocatePage />} />
        <Route path="/training-impact" element={<TrainingImpactPage />} />
        <Route path="/needs-analysis" element={<NeedsAnalysisPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
