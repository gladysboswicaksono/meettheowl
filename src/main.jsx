import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import './styles/navigation.css'
import './styles/site.css'
import './styles/projects.css'
import './styles/expertise.css'
import './styles/responsive.css'
import App from './App.jsx'
import OwllocatePage from './pages/OwllocatePage.jsx'
import TrainingImpactPage from './pages/TrainingImpactPage.jsx'
import NeedsAnalysisPage from './pages/NeedsAnalysisPage.jsx'
import VirtualOnboardingPage from './pages/VirtualOnboardingPage.jsx'
import MeetOwllocatePage from './pages/MeetOwllocatePage.jsx'
import Analytics from './components/Analytics.jsx'
import TitleManager from './components/TitleManager.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Analytics />
      <TitleManager />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/meet-owllocate" element={<MeetOwllocatePage />} />
        <Route path="/owllocate-get-started" element={<OwllocatePage />} />
        <Route path="/training-effectiveness" element={<TrainingImpactPage />} />
        <Route path="/training-impact" element={<Navigate to="/training-effectiveness" replace />} />
        <Route path="/needs-analysis" element={<NeedsAnalysisPage />} />
        <Route path="/virtual-onboarding" element={<VirtualOnboardingPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
