import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import OwllocatePage from './pages/OwllocatePage.jsx'
import TrainingImpactPage from './pages/TrainingImpactPage.jsx'
import NeedsAnalysisPage from './pages/NeedsAnalysisPage.jsx'
import VirtualOnboardingPage from './pages/VirtualOnboardingPage.jsx'
import NewWorkWayPart1Page from './pages/NewWorkWayPart1Page.jsx'
import Analytics from './components/Analytics.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/owllocate-get-started" element={<OwllocatePage />} />
        <Route path="/training-impact" element={<TrainingImpactPage />} />
        <Route path="/needs-analysis" element={<NeedsAnalysisPage />} />
        <Route path="/virtual-onboarding" element={<VirtualOnboardingPage />} />
        <Route path="/new-work-way-part-1" element={<NewWorkWayPart1Page />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
